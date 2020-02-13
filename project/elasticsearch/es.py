# -*- coding: utf-8 -*-
"""elasticsearch
:description 测试学习
"""

import random
from elasticsearch import Elasticsearch

# 指定连接
es = Elasticsearch(
    ['127.0.0.1:9201'],
    # 认证信息
    # http_auth=('elastic', 'changeme')
)

# 查看索引是否已经创建
is_people_index = es.indices.exists(index='people')
print(is_people_index)
if not is_people_index:
    es.indices.create(
        index='people',
        body={
            'settings': {
                'number_of_shards': 3,
                'number_of_replicas': 1
            },
            'mappings': {
                'properties': {
                    'name': {'type': 'text', 'analyzer': 'ik_smart', 'store': True},
                    'age': {'type': 'integer', 'store': True},
                    'sex': {'type': 'keyword', 'store': True}
                }
            }
        }
    )

# 添加数据
def add_docs():

    for i in range(1, 100):
        es.index(
            index='people',
            doc_type='_doc',
            body={
                'name': 'nuc-' + str(i),
                'age': random.randint(18, 42),
                'sex': ['男', '女'][random.randint(0, 1)]
            }
        )

def search_people():
    res = es.search(
        index='people',
        body={
            'query': {
                'match': {
                    'sex': '男'
                }
            }
        }
    )
    print(res)

# - 简单查询
def simple_search():

    res = es.search(
        index = 'blog',
        body = {
            "query": {
                "term": {
                    "title": "全面"
                }
            },
            "from": 0,  # 从匹配到的结果中的第几条数据开始返回，值是匹配到的数据的下标，从 0 开始
            "size": 100    # 返回多少条数据
        }
    )
    print(res)


if __name__ == '__main__':
    search_people()