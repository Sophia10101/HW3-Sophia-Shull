import pandas as pd
df = pd.read_csv("socialMedia.csv")
print(df.columns)
new = (df.groupby("Date",as_index=False)["Likes"].mean().rename(columns={'Likes': 'AvgLikes'}))
new.to_csv("SocialMediaTime.csv", index=False)