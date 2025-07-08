from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Optional
from Ecommender import EcoCartRecommender, RewardEngine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
        "http://localhost",
        "http://localhost:8000", 
        "http://127.0.0.1:5500", 
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

recommender = EcoCartRecommender(
    product_file="Dataset/products_catalog.csv",
    event_file="Dataset/user_events.csv",
    profile_file="Dataset/user_profiles.csv"
)

reward_engine = RewardEngine("Dataset/user_green_engagement_logs.csv")

@app.get("/")
def root():
    return {"message": "Welcome to the EcoCart Recommender & Reward API"}

@app.get("/recommend")
def get_recommendations(
    user_id: int = Query(..., description="User ID for recommendations"),
    top_n: int = Query(10, description="Number of recommendations to return"),
    green_mode: bool = Query(True, description="Enable green mode"),
    search_query: Optional[str] = Query(None, description="Search query for product filtering")
):
    result_df = recommender.recommend_for_user(user_id, top_n, green_mode=green_mode, search_query=search_query)
    return result_df.to_dict(orient="records")

@app.get("/reward-tier")
def get_user_tier(user_id: int = Query(..., description="User ID to get the reward tier")):
    tier = reward_engine.get_user_tier(user_id)
    return {"user_id": user_id, "tier": tier}

@app.get("/reward-perks")
def get_user_perks(user_id: int = Query(..., description="User ID to get the reward perks")):
    tier = reward_engine.get_user_tier(user_id)
    perks = reward_engine.get_user_perks(user_id)
    return {"user_id": user_id, "tier": tier, "perks": perks}


## Endpoints ##
# 1. `/` - Welcome message

# 2. `/recommend` - Get product recommendations for a user(personalized)
#    - Parameters: user_id(int), top_n(int), green_mode(bool), search_query(optional str)
#    Example: GET /recommend?user_id=101&green_mode=true&search_query=TV
#    - Returns: List of recommended products


# 3. `/reward-tier` - Get the reward tier of a user based on eco engagement
#   - Parameters: user_id(int)
#   Example: GET /reward-tier?user_id=101
#   - Returns: User ID and their reward tier


# 4. `/reward-perks` - Get the reward perks of a user based on eco engagement
#   - Parameters: user_id(int)
#   Example: GET /reward-perks?user_id=101
#   - Returns: User ID, their reward tier, and associated perks
