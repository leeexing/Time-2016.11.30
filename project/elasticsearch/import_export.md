---
title: es数据库数据导出导入
tag: es
---

## 基本

默认端口是：9200

集群的端口，是master那个上面的端口

## 参考

REFER: [使用文档](https://github.com/taskrabbit/elasticsearch-dump)

## 操作

### export

``` Python
elasticdump --input=http://xx.xx.xx.xx:9400/索引名称 --output=query.json  --searchBody='{"query":{"match":{"source": "QUKU"}}}'

# 测试
elasticdump --input=http://127.0.0.1:9201/索引名称 --output=./query.json --type=data
```

### import

``` Python
elasticdump --input=./query.json --output=http://xx.xx.xx.xx:9200/索引名称   --type=data

# 测试
elasticdump --input=./query.json --output=http://127.0.0.1:9200/topic   --type=data
```



