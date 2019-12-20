# inter-redis

> redis 数据库

## 基本使用

### bitmap

> 可用于统计账号在线人数等相关

[REDIS实践之在线人数统计几种方案分析](https://blog.csdn.net/hao508506/article/details/52496656/)

### list

* blpop | BLPOP key1 [key2 ] timeout

移出并获取列表的第一个元素， 如果列表没有元素会`阻塞列表`直到等待超时或发现可弹出元素为止。

* BRPOP key1 [key2 ] timeout

移出并获取列表的最后一个元素， 如果列表没有元素会`阻塞列表`直到等待超时或发现可弹出元素为止。

**这个很重要**
可以阻塞列表，这在python中做消息队列的时候，可以方便的做线程任务，而不占用执行

* LLEN key
获取列表长度

## redis 队列

Redis提供了两种方式来作消息队列。一个是使用生产者消费模式模式，另外一个方法就是发布订阅者模式。
前者会让一个或者多个客户端监听消息队列，一旦消息到达，消费者马上消费，谁先抢到算谁的，如果队列里没有消息，则消费者继续监听。
后者也是一个或多个客户端订阅消息频道，只要发布者发布消息，所有订阅者都能收到消息，订阅者都是ping的。

### 生产消费模式

> 要使用了redis提供的 `blpop` 获取队列数据，如果队列没有数据则阻塞等待，也就是监听

```py
import redis

class Task(object):
    def __init__(self):
        self.rcon = redis.StrictRedis(host='localhost', db=5)
        self.queue = 'task:prodcons:queue'

    def listen_task(self):
        while True:
            task = self.rcon.blpop(self.queue, 0)[1]
            print "Task get", task

if __name__ == '__main__':
    print 'listen task queue'
    Task().listen_task()
```

### 订阅发布模式

> 使用redis的 `pubsub` 功能，订阅者订阅频道，发布者发布消息到频道了，频道就是一个消息队列。

```py
import redis

class Task(object):

    def __init__(self):
        self.rcon = redis.StrictRedis(host='localhost', db=5)
        self.ps = self.rcon.pubsub()
        self.ps.subscribe('task:pubsub:channel')

    def listen_task(self):
        for i in self.ps.listen():
            if i['type'] == 'message':
                print "Task get", i['data']

if __name__ == '__main__':
    print 'listen task channel'
    Task().listen_task()
```

### 小结

使用第一种方式，可以基本上保证消息队在处理失败的时候不丢失（重新push回去即可）
使用第二种方式，不能保证这个消息被完整的消费掉