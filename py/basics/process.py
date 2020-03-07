# -*- coding: utf-8 -*-
"""
学习使用 多进程
Process 进程
Pool 进程池
"""
import time
import multiprocessing
from threading import Thread
from multiprocessing import Process, Pool


def foo(name):
    """"""
    time.sleep(2)
    print('hello ', name)


def main2():
    """ no """
    p = Process(target=foo, args=('jack', ))
    p.start()
    p.join()


def main3():
    """ no """
    with Pool(5) as p:
        p.map(foo, ['1', 2, 3, 4, 5])


def main():
    """ no """
    for item in range(10):
        t = Thread(target=foo, args=(item, ))
        t.start()
        # t.join()


if __name__ == '__main__':
    main()
