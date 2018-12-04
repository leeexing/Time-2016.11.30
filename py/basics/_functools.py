# -*- coding: utf-8 -*-
"""高阶函数模块

cmp_to_key:         将一个比较函数转换关键字函数；

partial:            针对函数起作用，并且是部分的；

reduce:             与python内置的reduce函数功能一样；

total_ordering:     在类装饰器中按照缺失顺序，填充方法；

update_wrapper:     更新一个包裹（wrapper）函数，使其看起来更像被包裹（wrapped）的函数；

wraps:              可用作一个装饰器，简化调用update_wrapper的过程；
"""

from functools import (
    cmp_to_key,
    partial,
    reduce,
    total_ordering,
    update_wrapper,
    wraps
)


# -cmp_to_key
def compare(a, b):
    return a - b

l = [6,4,8,1,5,9]
print(sorted(l, key=cmp_to_key(compare)))


# -partial
def add(a, b):
    return a + b

add3 = partial(add, 3)
add23 = partial(add, 23)
print(add3(4), add23(-11))


# -reduce
print(
    reduce(lambda x, y: x+y, l)
)


# -wraps

def my_decorator(f):
    @wraps(f)
    def wrapper(*args, **kw):
        print('calling decorated function')
        return f(*args, **kw)
    return wrapper

@my_decorator
def example():
    print('called example function')

example()
