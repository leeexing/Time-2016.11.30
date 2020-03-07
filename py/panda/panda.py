# -*- coding: utf-8 -*-
"""pandas学习"""

import pandas as pd

df = pd.read_csv(r'C:/Users/lixing1/Desktop/源数据平台/py/anPeiCloud_tagsExtract/lib/tags3_for_notCut.csv', encoding='gbk')

print(df)

print(df.drop('tags_4', axis=1).join(df['tags_4'].str.split(',', expand=True).stack().
                                                      reset_index(level=1, drop=True).rename('nuctech')))

# print(df['tags_4'])









