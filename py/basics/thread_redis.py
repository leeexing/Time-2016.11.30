# -*- coding: utf-8 -*-
"""thread redis

    : 测试线程后台执行。同时订阅redis的消息
    ：redis-cli -> PUBLISH test-demo hello
"""


import time
import threading
import redis


count = 0
thread_list = []

class Person:
    def __init__(self, name):
        self.name = name
    def __repr__(self):
        return '<Perosn {}>'.format(self.name)

pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
R = redis.StrictRedis(connection_pool=pool)
P = R.pubsub()
P.subscribe('test_demo')

class Background_Thread(threading.Thread):
    def __init__(self, threadname):
        super().__init__(name=threadname)

    def run(self):
        global count
        count += 1
        while True:
            msg = P.get_message()
            print(msg, '+-'*10)
            if msg and msg['type'] == 'message':
                count += 1
                for i in range(count):
                    p = Person('leeing-' + str(count) + '-' + str(i))
                    print(p)
            time.sleep(3)

t = Background_Thread('TEST-DEMO')
print(t)
t.setDaemon(True) # -后台进程，主程序执行完毕，跟着也结束了
t.start()
print('测试线程。。。。')