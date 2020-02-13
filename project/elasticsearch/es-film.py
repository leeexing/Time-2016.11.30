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

def init():
    """初始化"""
    # 查看索引是否已经创建
    # es.indices.delete(index='news')
    has_news_index = es.indices.exists(index='film')
    print(has_news_index)
    if not has_news_index:
        res = es.indices.create(
            index='film',
            body={
                'settings': {
                    'number_of_shards': 3,
                    'number_of_replicas': 1
                },
                'mappings': {
                    'properties': {
                        'tags': {
                            'type': 'keyword'
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


def delete_data(id):
    """删除数据"""
    body = {
        'query': {
            'match': {
                '_id': id
            }
        }
    }
    es.delete_by_query(index='film', body=body)


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


def search_filter():
    """过滤查询"""
    res = es.search(
        index='film',
        body={
            'query': {
                'constant_score': {
                    'filter': {
                        'term': {'tags': '冒险'}
                    },
                    'boost': 1
                }
                # 'constant_score': {
                #     'filter': {
                #         'bool': {
                #             'must': {
                #                 'term': {
                #                     'tags': '冒险'
                #                 },
                #                 'term': {
                #                     'tags': '爱情'
                #                 }
                #             }
                #         },
                #     }
                # }
            }
        }
    )
    print(res)


def search_aggs():
    """聚合查询"""
    res = es.search(
        index='film',
        body={
            'size': 0,
            'query': {
                'match_all': {}
            },
            'aggs': {
                'group_by_tag': {
                    'terms': {
                        'field': 'tags'
                    }
                }
            }
        }
    )
    print(res)


if __name__ == '__main__':
    print('start')
    # add_docs()
    # delete_data(id='E1c3N3ABuA_ZBa0LX5hk')
    search_aggs()