# -*- coding: utf-8 -*-
"""
统计考题间的相似度
"""

import math
import time
from bson.int64 import Int64
from datetime import datetime
from multiprocessing import Process

import jieba
import pymongo

client = pymongo.MongoClient('localhost', 27017)
db_topic = client['sourceData']['topic']
db_topic_similarity = client['sourceData']['topic_similarity']

stopwords = ['是', '的', '在', '对', '，', '。', '、', '.', '. ', '．']


def remove_stop_words(words):
    """ 排除停用词 """
    ret = [word for word in words if word not in stopwords]
    return ret


def get_cos_distance(array1, array2):
    """ 余弦距离算法 """
    fenmu = 0
    fenzi1 = 0
    fenzi2 = 0
    for i in range(len(array1)):
        fenmu += array1[i] * array2[i]
        fenzi1 += array1[i] * array1[i]
        fenzi2 += array2[i] * array2[i]
    fenzi = math.sqrt(fenzi1) + math.sqrt(fenzi2)
    if fenzi == 0:
        return 0
    return round(fenmu / fenzi, 4)


def get_text_similarity(text1, text2):
    """ 相似度计算函数 """
    str1_cut1 = list(jieba.cut(text1))
    str1_cut2 = list(jieba.cut(text2))

    allSet = [*set(str1_cut1 + str1_cut2)]
    str1OneHot = []
    str2OneHot = []

    for value in allSet:
        str1OneHot.append(str1_cut1.count(value))
        str2OneHot.append(str1_cut2.count(value))
    # print(str1OneHot, str2OneHot)
    score = get_cos_distance(str1OneHot, str2OneHot)
    return score


def calc_one_topic_similarity():
    """计算单道考题和剩余全部考题的相似度"""
    datas = list(db_topic.find({}, {'title': 1}))
    topic1 = datas[0]
    for topic2 in datas[1:]:
        score = get_text_similarity(topic1['title'], topic2['title'])
        if score >= 0.5:
            print(topic1['_id'], topic2['_id'], score)
            db_topic_similarity.insert_one({
                'topicIds': [topic1['_id'], topic2['_id']],
                # 'topicNos': [topic1['number'], topic2['number']], # -考题的number不唯一！！
                'score': score,
                'createTime': datetime.now(),
                'version': '1.0'
            })


def calc_all_topic_similarity(start_index=0, end_index=5):
    """计算单道考题和剩余全部考题的相似度
    @param end_index 分批计算的控制字段
    has_limit = 1000
    """
    datas = list(db_topic.find({}, {'title': 1}))
    for (index, topic1) in enumerate(datas):
        if index >= start_index and index < end_index:
            for topic2 in datas[index + 1:]:
                score = get_text_similarity(topic1['title'], topic2['title'])
                if score >= 0.5:
                    print(topic1['_id'], topic2['_id'], score)
                    db_topic_similarity.insert_one({
                        'topicIds': [topic1['_id'], topic2['_id']],
                        'score': score,
                        'createTime': datetime.now(),
                        'version': '1.0'
                    })


def test(start, end):
    """ test """
    print(start, end)
    time.sleep(10)


def calc_simi_with_process():
    """使用多线程来进行相似度计算
    记录跑的值
    start = 0
    end   = 8

    target = 57934
    """
    step = 1250
    process_list = []
    for item in range(8):
        p = Process(target=calc_all_topic_similarity, args=(item * step, (item + 1) * step))
        p.start()
        process_list.append(p)

    for p in process_list:
        p.join()


def main():
    """ no """
    start = time.time()
    # calc_one_topic_similarity()
    calc_simi_with_process()
    print(time.time() - start)


if __name__ == '__main__':
    main()

