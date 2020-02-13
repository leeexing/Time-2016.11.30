# -*- coding: utf-8 -*-
"""elasticsearch
:description 测试学习
"""

import random
from time import time
from elasticsearch import Elasticsearch, helpers
from pymongo import MongoClient

# 指定连接
es = Elasticsearch(
    ['127.0.0.1:9201'],
    # 认证信息
    # http_auth=('elastic', 'changeme')
)

# 数据
conn = MongoClient(host='127.0.0.1:27017')
mongo = conn.sourceData

def init():
    """初始化"""
    # 查看索引是否已经创建
    # es.indices.delete(index='news')
    has_news_index = es.indices.exists(index='topic')
    print(has_news_index)
    if not has_news_index:
        res = es.indices.create(
            index='topic',
            body={
                'settings': {
                    'number_of_shards': 3,
                    'number_of_replicas': 1
                },
                'mappings': {
                    'properties': {
                        'title': {
                            'type': 'text',
                            'analyzer': 'ik_smart'
                        },
                        'knowledge': {
                            'type': 'text',
                            'analyzer': 'ik_smart'
                        },
                        'createTime': {
                            'type': 'date',
                            'format': 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis'
                        },
                        'creatorId': {
                            'type': 'long'
                        },
                        'modifyTime': {
                            'type': 'date',
                            'format': 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis'
                        },
                        'options': {
                            'type': 'nested',
                            'properties': {
                                'title': {
                                    'type': 'text',
                                    'analyzer': 'ik_smart'
                                }
                            }
                        }
                    }
                }
            }
        )
        print(res)

# 添加数据
def add_docs():
    """添加数据"""
    datas = [
        {
            'title' : '想见你',
            'actor' : '王全胜',
            'tags' : [
                '科幻',
                '爱情',
                '悬疑'
            ]
        },
        {
            'title' : '白夜追凶',
            'actor' : '潘粤明',
            'tags' : [
                '悬疑',
                '冒险'
            ]
        }
    ]

    for data in datas:
        es.index(index='film', doc_type='_doc', body=data)


def delete_data():
    """删除数据"""
    body = {
        'query': {
            'match_all': {}
        }
    }
    es.delete_by_query(index='topic', body=body)


def search_base():
    """基本查询"""
    res = es.search(
        index='film',
        body={
            'query': {
                'match': {
                    'tags': '冒险'
                }
            }
        }
    )
    print(res)


def mongo_data():
    res = list(mongo.topic.find())
    datas = (
        {
            "_index": "topic",
            "_type": "_doc",
            "_source": {
                'id': item['_id'],
                "number" : item['number'],
                "forLevel" : item['forLevel'],
                "knowledge" : item['knowledge'],
                "difficulty" : item['difficulty'],
                "type" : item['type'],
                "title" : item['title'],
                "analysis" : item['analysis'],
                "accuracy" : item['accuracy'],
                "creatorId" : item['creatorId'],
                "eCode" : item['eCode'],
                "createTime" : item['createTime'].strftime('%Y-%m-%d %H:%M:%S'),
                "modifyTime" : item['modifyTime'].strftime('%Y-%m-%d %H:%M:%S') if item['modifyTime'] else item['createTime'].strftime('%Y-%m-%d %H:%M:%S'),
                "options": item['options']
            }
        } for item in res)
    now = time()
    print(now)
    helpers.bulk(es, datas)
    print(time() - now)

if __name__ == '__main__':
    print('start')
    # init()
    mongo_data()
    # delete_data()
    # search_aggs()
    print('end...')