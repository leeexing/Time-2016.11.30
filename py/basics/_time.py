# -*- coding: utf-8 -*-
"""时间数据类型"""
from time import time, strftime
from datetime import date, datetime, timedelta

expire_time = "2013-05-21 09:50:35"
d = datetime.strptime(expire_time, '%Y-%m-%d %H:%M:%S'),
today = date.today()
dt = timedelta(days=5)
print(
    time(),
    type(today),
    strftime('%Y-%m-%d %H:%M:%S'),
    today,
    datetime.strftime(today - dt, '%Y-%m-%d %H:%M:%S'),
    datetime.strptime('2018-11-04 00:00:00', '%Y-%m-%d %H:%M:%S'),
    timedelta(weeks=1),
    sep='\n'
)