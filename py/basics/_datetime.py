# -*- coding: utf-8 -*-
"""时间模块

date        表示日期的类。常用的属性有year, month, day；

    datetime.date(year, month, day)
    date.resolution：date对象表示日期的最小单位。这里是天。
    date.today()：返回一个表示当前本地日期的date对象；
    date.fromtimestamp(timestamp)：根据给定的时间戮，返回一个date对象

    date.strftime(fmt)：自定义格式化字符串。在下面详细讲解。


time        表示时间的类。常用的属性有hour, minute, second, microsecond；

    time.strftime(fmt)：返回自定义格式化字符串。在下面详细介绍；


datetime    表示日期时间。常用的属性有hour, minute, second, microsecond

    datetime.today()：返回一个表示当前本地时间的datetime对象；
    datetime.now([tz])：返回一个表示当前本地时间的datetime对象，如果提供了参数tz，则获取tz参数所指时区的本地时间；
    datetime.strptime(date_string, format)：将格式字符串转换为datetime对象；


timedelta   表示时间间隔，即两个时间点之间的长度。
"""

import datetime, time
t = datetime.datetime(2009, 10, 21, 0, 0, 10, 10)   # 分别是年份、月份、日、小时、分钟、秒、微妙(10-6秒)
print (t-datetime.datetime(1970,1,1)).total_seconds()  # 总共多少秒

time.mktime(t.timetuple())
