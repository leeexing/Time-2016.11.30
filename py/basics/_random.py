# -*- coding: utf-8 -*-
"""随机数

random.random       : random.random()用于生成一个0到1的随机符点数: 0 <= n < 1.0

random.uniform      : random.uniform的函数原型为：random.uniform(a, b)，用于生成一个指定范围内的随机符点数，两个参数其中一个是上限，一个是下限。

random.randint      : random.randint()的函数原型为：random.randint(a, b)，用于生成一个指定范围内的整数。

random.randrange    : random.randrange的函数原型为：random.randrange([start], stop[, step])，从指定范围内，按指定基数递增的集合中 获取一个随机数。

random.choice       : random.choice从序列中获取一个随机元素。其函数原型为：random.choice(sequence)。参数sequence表示一个有序类型。

random.shuffle      : random.shuffle(x[, random])，用于将一个列表中的元素打乱

random.sample       : random.sample(sequence, k)，从指定序列中随机获取指定长度的片断。sample函数不会修改原有序列。

"""

import random

print(
    random.random(),
    random.uniform(10, 20),
    random.randint(10, 20),
    random.randrange(10, 100, 2),
    random.choice(range(10, 100, 2)),   # 只要是有序类型就可以
    random.choice(list(range(10, 100, 3))),
    random.shuffle(list(range(10, 50, 3))), # 必须是list
    random.sample(list(range(100)), 5),
    sep='\n',
)
