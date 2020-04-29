# -*- coding: utf-8 -*-
"""测试"""

# import argparse


# parse = argparse.ArgumentParser()
# parse.add_argument('-n', '--name', default='leeing' , help='用户名')
# parse.add_argument('-a', '--age', help='年龄', required=True)
# parse.add_argument('-t', '--test', nargs=2, help='测试')
# parse.add_argument('-c', '--choice', choices=['Hello', 'Word'], help='测试')

# args = parse.parse_args()
# print(args.age)
from flask import Flask
from apscheduler.schedulers.blocking import BlockingScheduler
# from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from threading import Thread


def my_job():
    print(datetime.now().strftime('%Y-%d-%d %H:%M:%S'))


class my_thread(Thread):

    def __init__(self, app):
        super().__init__()
        self.app = app
        self.has_init = False
        self.count = 0

    def run(self):
        if not self.has_init:
            self.count += 1
            self.init_job()

    def init_job(self):
        print('初始化几次了啊', self.count)
        self.has_init = True
        scheduler = BlockingScheduler()
        scheduler.add_job(my_job, 'cron', day_of_week='1-5', second=28)
        scheduler.add_job(self.job, 'interval', seconds=10)
        scheduler.start()


    def job(self):
        print(datetime.now().strftime('%Y-%d-%d %H:%M:%S'))


app = Flask('demo')

@app.route('/hi')
def home():
    return 'hello world'


if __name__ == '__main__':
    t = my_thread('app')
    t.setDaemon(True)
    t.start()
    app.run(port=5003, debug=False)
    print('app 结束前，这里不打印 。。。')
