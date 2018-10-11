# -*- coding: utf-8 -*-
"""
一、
threading模块提供的类：
　　Thread, Lock, Rlock, Condition, [Bounded]Semaphore, Event, Timer, local。

threading 模块提供的常用方法：
　　threading.currentThread(): 返回当前的线程变量。
　　threading.enumerate(): 返回一个包含正在运行的线程的list。正在运行指线程启动后、结束前，不包括启动前和终止后的线程。
　　threading.activeCount(): 返回正在运行的线程数量，与len(threading.enumerate())有相同的结果。

threading 模块提供的常量：

　　threading.TIMEOUT_MAX 设置threading全局超时时间。

二、
1 t.join()           　　　　　　等待线程结束；
2 t.isAlive()        　　　　　　返回线程是否活动；
3 t.getName()          　　　　 返回线程名。
4 t.setName()          　　　　 设置线程名。
5 threading.currentThread()    返回当前线程变量；
6 threading.enumerate()        返回一个包含正在运行线程的列表；
7 threading.activeCount()      返回正在运行的线程数量；
8 threading.Semaphore(5)       限制最大连接数为5，semaphore是一个acquire,release的计数器；

三、
多线程用于IO密集型，如socket，爬虫，web

多进程用于计算密集型，如金融分析

四、
同步锁

用于对共享资源同步访问的限制，只有当一个线程访问完毕后另一个线程才能访问。

五、
死锁

使用RLock()代替Lock()可解决，因为RLock()使资源可以被多次acquire,但只有直到一个线程所有的acquire都被release之后其他线程才能获得资源。

而使用Semaphore(n)则可限制资源的同时最大可访问线程数；

六、
Event对象

用于多线程之间的通信和同步，初始情况下event对象中信号标志为False;

1 isSet()          返回event的状态值；
2 wait()           如果event.isSet() == False 将阻塞线程，即等待；
3 set()       　　 设置event的状态值；
4 clear()          恢复event的状态值为False;

七、

实例queue.Queue()    先进先出；

实例queue.LifoQueue()      后进先出；

实例queue.PriorityQueeu() 接受一个优先级参数，根据优先级大小决定顺序；
"""
import time
from threading import Thread, currentThread, activeCount, enumerate

def test(args):
    """test"""
    print('indent', currentThread().ident)
    print('name', currentThread().getName())
    print('count', activeCount())
    print('enum', enumerate())
    print('args', args)
    time.sleep(2)


t = Thread(target=test, args=('leeing',), name='leeing')
t.start()
t.join()
t1 = Thread(target=test, args=('helllo1',))
t1.start()