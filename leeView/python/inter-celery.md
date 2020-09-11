---
title: celery
tag: python
---

REFER:

[强大的异步组件celery](https://www.bilibili.com/video/BV1Pa4y1Y7QN?p=5)

## 基本使用

### 启动worker消费者

```shell
celery worker -l info -A celery_task -P eventlet -c 2
```

### 启动beat定时任务.相当于是一个生产者

```shell
celery beat -A celery_tasks -P eventlet -c 2
```
