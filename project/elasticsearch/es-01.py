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
# es.indices.delete(index='news')
has_news_index = es.indices.exists(index='news')
print(has_news_index)
if not has_news_index:
    res = es.indices.create(
        index='news',
        body={
            'settings': {
                'number_of_shards': 3,
                'number_of_replicas': 1
            },
            'mappings': {
                'properties': {
                    'title': {
                        'type': 'text',
                        'analyzer': 'ik_max_word',
                        'search_analyzer': 'ik_max_word',
                        'store': True
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
            'title': '美国留给伊拉克的是个烂摊子吗',
            'url': 'http://view.news.qq.com/zt2011/usa_iraq/index.htm',
            'date': '2011-12-16'
        },
        {
            'title': '公安部：各地校车将享最高路权',
            'url': 'http://www.chinanews.com/gn/2011/12-16/3536077.shtml',
            'date': '2011-12-16'
        },
        {
            'title': '中韩渔警冲突调查：韩警平均每天扣1艘中国渔船',
            'url': 'https://news.qq.com/a/20111216/001044.htm',
            'date': '2011-12-17'
        },
        {
            'title': '中国驻洛杉矶领事馆遭亚裔男子枪击 嫌犯已自首',
            'url': 'http://news.ifeng.com/world/detail_2011_12/16/11372558_0.shtml',
            'date': '2011-12-18'
        },
        {
            'title': '美国NBA什么时候开始',
            'url': 'http://view.news.qq.com/zt2011/NBA—sport/index.htm',
            'date': '2019-12-16'
        },
    ]

    for data in datas:
        es.index(index='news', doc_type='_doc', body=data)

def search_news():
    res = es.search(
        index='news',
        body={
            'query': {
                'range': {
                    'date': {
                        'gt': '2015-12-11'
                    }
                }
            }
        }
    )
    print(res)


if __name__ == '__main__':
    print('start')
    # add_docs()
    search_news()