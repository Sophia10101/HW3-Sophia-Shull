import pandas as pd
df = pd.read_csv("socialMedia.csv")
fix = (df.groupby(["Platform","PostType"])["Likes"].mean()
       .round(2).rename(columns={'Likes': 'AvgLikes'}))
fix.to_csv("socialMediaAvg.csv", index=False)


