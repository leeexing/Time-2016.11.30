# -*- coding: utf-8 -*-
"""
``operator`` 模块为 Python 提供了一个 "功能性" 的标准操作符接口. 当使用 ``map`` 以及
``filter`` 一类的函数的时候, ``operator`` 模块中的函数可以替换一些 ``lambda`` 函式.
而且这些函数在一些喜欢写晦涩代码的程序员中很流行. [Example 1-62 #eg-1-62] 展示了
``operator`` 模块的一般用法.
"""
from operator import attrgetter, itemgetter
arr = [1, 5, 2, 1, 9, 1, 5, 10]
a = [ {'x':1, 'y':2}, {'x':1, 'y':3}, {'x':1, 'y':2}, {'x':2, 'y':4}]
rows = [
    {'fname': 'Brian', 'lname': 'Jones', 'uid': 1003},
    {'fname': 'David', 'lname': 'Zeazley', 'uid': 1002},
    {'fname': 'John', 'lname': 'Cleese', 'uid': 1001},
    {'fname': 'Big', 'lname': 'Jones', 'uid': 1004}
]

class User:
    def __init__(self, user_id):
        self.user_id = user_id

    def __repr__(self):
        return 'User({})'.format(self.user_id)

user_list = [User(item) for item in arr]
for info in enumerate(user_list):
    print(info)
print(user_list)
print(
    sorted(user_list, key=lambda user: user.user_id),
    sorted(user_list, key=attrgetter('user_id')),
    sep='\n'
)
