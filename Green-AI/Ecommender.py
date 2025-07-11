import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
import difflib
from collections import defaultdict

class EcoCartRecommender:
    def __init__(self, product_file, event_file, profile_file):
        self.products = pd.read_csv(product_file)
        self.events = pd.read_csv(event_file)
        self.profiles = pd.read_csv(profile_file)

        self.popularity = self._compute_popularity()
        self.model = self._train_score_model()

        self.tier_weights = {
            'Bronze': {'eco_score': 1.0, 'refurbished': 1.0, 'popularity': 1.0},
            'Silver': {'eco_score': 1.2, 'refurbished': 1.2, 'popularity': 1.0},
            'Gold': {'eco_score': 1.4, 'refurbished': 1.4, 'popularity': 0.9},
            'Platinum': {'eco_score': 1.6, 'refurbished': 1.6, 'popularity': 0.8}
        }

    def _compute_popularity(self):
        pop = self.events.groupby('itemID')['event_type'].value_counts().unstack().fillna(0)
        pop['popularity_score'] = 1 * pop.get('view', 0) + 2 * pop.get('cart', 0) + 3 * pop.get('purchase', 0)
        return pop['popularity_score']

    def _generate_training_data(self):
        merged = self.events.merge(self.products, on='itemID')
        merged = merged.merge(self.profiles, on='user_id')

        merged['popularity'] = merged['itemID'].map(self.popularity).fillna(0)
        merged['eco_score'] = merged['Total(kg CO2e)']
        merged['eco_score_norm'] = (merged['eco_score'] - merged['eco_score'].min()) / (merged['eco_score'].max() - merged['eco_score'].min())

        merged['category_match'] = 1
        merged['refurbished'] = merged['refurbished_available']
        merged['price_penalty'] = merged['price'] / merged['avg_spend']

        merged['label'] = merged['event_type'].apply(lambda x: 1 if x in ['purchase', 'cart'] else 0)

        features = merged[['popularity', 'eco_score_norm', 'category_match', 'refurbished', 'price_penalty']]
        labels = merged['label']
        return features, labels

    def _train_score_model(self):
        X, y = self._generate_training_data()
        model = LogisticRegression()
        model.fit(X, y)
        return model

    def _compute_features(self, product_row, user_profile, user_tier, green_mode=True):
        pop = self.popularity.get(product_row['itemID'], 0)
        eco_score = product_row['Total(kg CO2e)']
        eco_score_norm = (eco_score - self.products['Total(kg CO2e)'].min()) / (self.products['Total(kg CO2e)'].max() - self.products['Total(kg CO2e)'].min())
        category_match = 1
        refurbished = product_row['refurbished_available']
        price_penalty = product_row['price'] / user_profile['avg_spend']

        weights = self.tier_weights.get(user_tier, self.tier_weights['Bronze']) if green_mode else {'eco_score': 1.0, 'refurbished': 1.0, 'popularity': 1.0}


        return pd.DataFrame([[pop * weights['popularity'], eco_score_norm * weights['eco_score'], category_match, refurbished * weights['refurbished'], price_penalty]], 
                            columns=['popularity', 'eco_score_norm', 'category_match', 'refurbished', 'price_penalty'])

    def recommend_for_user(self, user_id, top_n=10, green_mode=True, search_query=None):
        user_profile = self.profiles[self.profiles['user_id'] == user_id].squeeze()
        reward_engine = RewardEngine("Dataset/user_green_engagement_logs.csv")
        user_tier = reward_engine.get_user_tier(user_id)

        # Filter products by search query if provided
        if search_query:
            search_query_lower = search_query.lower()
            product_types = self.products['Product'].dropna().unique()
            match = difflib.get_close_matches(search_query_lower, product_types, n=1, cutoff=0.3)
            matched_category = match[0] if match else None

            main_products = self.products[self.products['Product'].str.lower() == matched_category.lower()] if matched_category else pd.DataFrame()
            alt_products = self.products[self.products['Product'].str.lower() != matched_category.lower()] if matched_category else self.products

            filtered_products = pd.concat([main_products, alt_products])
        else:
            filtered_products = self.products

        # Vectorized feature computation
        pop = filtered_products['itemID'].map(self.popularity).fillna(0)
        eco_score = filtered_products['Total(kg CO2e)']
        eco_score_norm = (eco_score - self.products['Total(kg CO2e)'].min()) / (self.products['Total(kg CO2e)'].max() - self.products['Total(kg CO2e)'].min())
        category_match = 1
        refurbished = filtered_products['refurbished_available']
        price_penalty = filtered_products['price'] / user_profile['avg_spend']

        weights = self.tier_weights.get(user_tier, self.tier_weights['Bronze']) if green_mode else {'eco_score': 1.0, 'refurbished': 1.0, 'popularity': 1.0}

        features = pd.DataFrame({
            'popularity': pop * weights['popularity'],
            'eco_score_norm': eco_score_norm * weights['eco_score'],
            'category_match': category_match,
            'refurbished': refurbished * weights['refurbished'],
            'price_penalty': price_penalty
        })

        # Batch prediction
        scores = self.model.predict_proba(features)[:, 1]
        filtered_products = filtered_products.copy()
        filtered_products['score'] = scores

        if search_query and matched_category:
            same_cat = filtered_products[filtered_products['Product'].str.lower() == matched_category.lower()]
            same_cat_sorted = same_cat.sort_values(['score', 'Total(kg CO2e)'], ascending=[False, True])

            same_cat_ids = set(same_cat_sorted['itemID'])
            same_cat_low = filtered_products[(filtered_products['Product'].str.lower() == matched_category.lower()) & (~filtered_products['itemID'].isin(same_cat_ids))]
            same_cat_low_sorted = same_cat_low.sort_values('Total(kg CO2e)')

            other_cat = filtered_products[filtered_products['Product'].str.lower() != matched_category.lower()]
            other_cat_sorted = other_cat.sort_values('Total(kg CO2e)')

            top_items = pd.concat([
                same_cat_sorted.head(top_n),
                same_cat_low_sorted.head(max(0, top_n - len(same_cat_sorted))),
                other_cat_sorted.head(max(0, top_n - len(same_cat_sorted) - len(same_cat_low_sorted)))
            ]).head(top_n)
        else:
            if green_mode:
                top_items = filtered_products.sort_values(['score', 'Total(kg CO2e)'], ascending=[False, True]).head(top_n)
            else:
                top_items = filtered_products.sort_values('score', ascending=False).head(top_n)

        return top_items[['itemID', 'Product', 'Variety/Size', 'Brand', 'price', 'Total(kg CO2e)', 'refurbished_available','Production(kg CO2e)','Packaging(kg CO2e)','Logistics(kg CO2e)']]


class RewardEngine:
    def __init__(self, behavior_file):
        self.behavior = pd.read_csv(behavior_file)

    def calculate_rewards(self):
        user_rewards = defaultdict(int)

        for _, row in self.behavior.iterrows():
            eco_score = row['eco_score']
            base_reward = max(0, 450 - eco_score) / 45

            if row['refurbished']:
                base_reward += 2
            if row['delivery_type'] == 'delayed':
                base_reward += 1
            if row['used_green_toggle']:
                base_reward += 0.5

            user_rewards[row['user_id']] += round(base_reward, 2)

        return pd.DataFrame(list(user_rewards.items()), columns=['user_id', 'eco_points'])

    def get_user_tier(self, user_id):
        df = self.calculate_rewards()
        points = df[df['user_id'] == user_id]['eco_points']
        if points.empty:
            return 'Bronze'
        score = points.values[0]

        if score >= 180:
            return 'Platinum'
        elif score >= 140:
            return 'Gold'
        elif score >= 100:
            return 'Silver'
        else:
            return 'Bronze'
        ## These Values are set based on after visualization and analysis of the data
        
    def get_user_perks(self, user_id):
        tier = self.get_user_tier(user_id)

        perks = {
            'Bronze': [
                "Start earning by using green mode toggle.",
                "Buy refurbished or delay delivery to earn more points."
            ],
            'Silver': [
                "5% discount on refurbished items.",
                "Bonus 0.5 pts for every green mode interaction."
            ],
            'Gold': [
                "10% discount on green deliveries.",
                "Early access to eco-friendly offers."
            ],
            'Platinum': [
                "Free shipping on refurbished products.",
                "Exclusive platinum-only deals every month.",
                "15% discount on green delivery items."
            ]
        }

        return perks.get(tier, [])