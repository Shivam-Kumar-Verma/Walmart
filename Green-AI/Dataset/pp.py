import pandas as pd

df=pd.read_csv('products_catalog.csv')
# print(df.head());

d=df[(df['Product']=='Television')]['Brand']

print(d.unique())

