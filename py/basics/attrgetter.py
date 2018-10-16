# -*- coding: utf-8 -*-
# from operator import en
from operator import attrgetter
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
