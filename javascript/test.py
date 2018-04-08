# -*- coding:utf-8 -*-
"""简单测试|练习"""
from pymongo import MongoClient
from redis import StrictRedis
from datetime import datetime, timedelta
import string
from time import sleep
from random import randint, sample, random
import json
from operator import itemgetter
from functools import reduce

STRING_FORSELECT = string.ascii_letters + '0123456789' + '加几个中国汉字也挺好'

mongo = MongoClient('localhost')
db = mongo.myblog
R = StrictRedis(host='localhost', port=6379)

# data = db.todo.find({})
# print(list(data))
ret = R.hget('leeing:slip', 'todo')
print(json.loads(ret))
obj = [{
    'name': 'lee',
    'age': 23,
    'relation': {
        'friends': 45,
        'enemy': 12
    },
    'likes': ['fooball', 'basketball', 'running', 'breaking']
}, {
    'name': 'jing',
    'age': 13,
    'relation': {
        'friends': 22,
        'enemy': 48
    },
    'likes': ['door', 'call', 'singing', 'hahahah', 'riding']
}]

def save_mongo():
    """保存数据到mongodb"""
    content = sorted(obj, key=lambda x: len(x['likes']), reverse=True)
    print(content)
    print('+='*20)
    # print(sorted(obj, key=itemgetter('likes')))
    # print(list(filter(lambda x: x['age'] > 20, obj)))
    def addAge(item):
        item['age'] += 5
        return item
    def reduce_fn(cur, pre):
        return cur['age'] + pre['age']
    # d = map(addAge, obj)
    # print(list(d))
    # print(obj)
    # print(reduce(reduce_fn, obj))
    # print(list(map(lambda x,y: (x, y), range(0,10), 'leexing')))

save_mongo()