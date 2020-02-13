# -*- coding: utf-8 -*-
"""elasticsearch
:description 测试学习
:refer https://blog.csdn.net/m0_37886429/article/details/102586755
"""

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

# 指定连接
es = Elasticsearch(
    ['127.0.0.1:9201'],
    # 认证信息
    # http_auth=('elastic', 'changeme')
)

res = Search(using=es, index="blog")\
        .filter("match", title='快递')\
        .query("match", content='快递')
        # .exclude("match", message="M(")

print(res)
print(res.count())
print(res.execute())
