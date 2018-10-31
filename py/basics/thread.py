# -*- coding: utf-8 -*-
"""
零、
    https://www.cnblogs.com/tkqasn/p/5700281.html [这一篇文章将得还是挺仔细的]

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
1 t.join()           　　　　　 等待线程结束；调用Thread.join将会使主调线程堵塞，直到被调用线程运行结束或超时。
2 t.isAlive()        　　　　　 返回线程是否活动；
3 t.getName()          　　　　 返回线程名。
4 t.setName()          　　　　 设置线程名。
5 threading.currentThread()    返回当前线程变量；
6 threading.enumerate()        返回一个包含正在运行线程的列表；
7 threading.activeCount()      返回正在运行的线程数量；
8 threading.Semaphore(5)       限制最大连接数为5，semaphore是一个acquire,release的计数器；
9 t.setDaemon(True)            将线程声明为守护线程，必须在start() 方法调用之前设置，如果不设置为守护线程程序会被无限挂起。子线程启动后，
                                父线程也继续执行下去，当父线程执行完最后一条语句print "all over %s" %ctime()后，没有等待子线程，直接就退出了，同时子线程也一同结束。

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

八、

如果多个线程共同对某个数据修改，则可能出现不可预料的结果，为了保证数据的正确性，需要对多个线程进行同步。
使用Lock或Rlock 可以实现简单的线程同步。对于那些需要每次只允许一个线程操作的数据，剋将其操作放到acquire和release方法之间

多线程的优势在于可以同时运行多个任务，但是当线程需要共享数据时，可能存在数据不同步的问题

如果 join 使用不当，使得多线程变成顺序执行。（例如， start() 之后就是 join() ），每个线程都被上一个线程的join阻塞，使得“多线程”失去了多线程的意义
"""
from time import sleep, ctime
from threading import Thread, currentThread, activeCount, Lock
import requests

def test(args):
    """test"""
    print('indent', currentThread().ident)
    print('name', currentThread().getName())
    print('count', activeCount())
    print('enum', enumerate())
    print('args', args)
    sleep(2)


t = Thread(target=test, args=('leeing',), name='leeing')
t.start()
t.join()
t1 = Thread(target=test, args=('helllo1',))
t1.start()


def demo2():
    def doWaiting(timeout):
        print('start waiting ...', ctime())
        sleep(timeout)
        print('stop waiting !!!', ctime())

    t = Thread(target=doWaiting, name='leeing', args=(3,))
    # tt = Thread(target=doWaiting, name='leecin', args=(2,))
    t.setDaemon(True)
    t.start()
    # tt.start()
    print(t.getName())
    # print(tt.getName())
    # tt.join()
    t.join()
    print('ending ....')
    print(t.isAlive())

def demo3():
    """增加同步功能 -- lock
    """
    lock = Lock()
    threads = []

    def doWaiting(timeout, counter):
        lock.acquire()
        while counter:
            print('start waiting ...', ctime(), '   ---   ', currentThread().getName())
            sleep(timeout)
            print('stop waiting !!!', ctime(), '   ===   ', currentThread().getName())
            counter -= 1
        lock.release()

    t1 = Thread(target=doWaiting, name='leeing', args=(1, 3))
    t2 = Thread(target=doWaiting, name='SEEKING', args=(2, 3))

    t1.start()
    t2.start()

    threads.append(t1)
    threads.append(t2)

    for t in threads:
        print(t)
        t.join()

    print('退出线程')

# !另外一种写法。通过类的继承
class myThread(Thread):
    def __init__(self, threadID, name, counter):
        Thread.__init__(self)
        self.ID = threadID
        self.name = name
        self.counter = counter

    def run(self):
        print('开启线程：', self.name)
        process_data(self.name, self.counter, 3)
        print('退出线程：', self.name)


def process_data(threadName, delay, counter):
    while counter:
        print(threadName, ctime())
        sleep(delay)
        counter -= 1

# !多线程的一个应用。并发请求
urls = ['douban', 'wangyi', 'zhihu']
def worker():
    while True:
        try:
            url = urls.pop()
        except IndexError:
            break # Done
        requests.get(url)

for _ in range(10):
    t = Thread(target=worker)
    t.start()