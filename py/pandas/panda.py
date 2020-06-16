# -*- coding: utf-8 -*-
"""pandas学习"""

import re
import pymongo
import pandas as pd

client = pymongo.MongoClient('mongodb://localhost:27017/admin')
# client = pymongo.MongoClient('mongodb://root:root123@52.80.171.106:27017/admin')
db_topic = client['sourceData']['topic_copy']

# df = pd.read_csv(r'C:/Users/lixing1/Desktop/源数据平台/py/anPeiCloud_tagsExtract/lib/tags3_for_notCut.csv', encoding='gbk')
# df = pd.read_json(r'D:/sourcedata/mongoData/20200227_sourceData_topic.json', orient='recodes')

def remove_symbol(text):
    """将文本中的标点符号去掉"""
    return re.sub(r'[\\n\[\]（）().。,，""“”{}、\s]+', '', text)


def read_pd():
    """读取pandas数据"""
    # df = pd.DataFrame(list(db_topic.find({}, {'_id': 1, 'title': 1}).sort([('title', 1)])))
    df = pd.DataFrame(list(db_topic.find({}, {'_id': 1, 'title': 1}).sort([('title', 1)])))
    data = df.loc[:, ['_id', 'title']]
    data['title_pure'] = data.apply(lambda x: remove_symbol(x['title']), axis=1)
    # data['title_pure'] = data['title'].apply(lambda x: re.sub(r'[\\n\[\]（）().。,，""“”{}、\s]+', '', x))
    # print(data)
    # unique_data = data.drop_duplicates(subset=['title_pure'], keep='first')
    unique_data = data['title_pure'].duplicated(keep='first')
    data['is_dupli'] = unique_data
    # print(data.head(10))

    # print(data.loc[lambda x: x['is_dupli'] == True].count())
    # print(data.loc[data['is_dupli'] == True])
    print(data[unique_data])

    data.to_csv('./test_topic.csv', encoding='utf_8_sig')
    # data.loc[lambda x: x['is_dupli'] == True].to_csv('./test_topic.csv', encoding='utf_8_sig')
    # data.loc[lambda x: x['is_dupli'] == True].loc[:, '_id'].to_json('./test_topic.json', orient='values')

def main():
    """to"""
    # text = remove_symbol('\n“低温液体”可能含有（   ）危险品。\n')
    # print('text', text)
    read_pd()


if __name__ == '__main__':
    main()
