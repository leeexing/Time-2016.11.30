---
title: 导出数据
tag: mongo
description: 从测试环境导出数据
---

## 基本使用

```js
mongoexport -d mongotest -c users -o /home/python/Desktop/mongoDB/users.json --type json -f  "_id,user_id,user_name,age,status" -h IP --port 27018 -u root -p Train!ok. --authenticationDatabase=admin [--upsert]
```

参数说明：
            -d ：数据库名
            -c ：collection名
            -q : 查询条件。ISODate需要使用Date(毫秒数)进行查询。复合查询需要导入一个查询文件
            -o ：输出的文件名
            --type ： 输出的格式，默认为json
            -f ：输出的字段，如果-type为csv，则需要加上-f "字段名"

英文：
            -h,--host ：代表远程连接的数据库地址，默认连接本地Mongo数据库；
            --port：代表远程连接的数据库的端口，默认连接的远程端口27017；
            -u,--username：代表连接远程数据库的账号，如果设置数据库的认证，需要指定用户账号；
            -p,--password：代表连接数据库的账号对应的密码；
            -d,--db：代表连接的数据库；
            -c,--collection：代表连接数据库中的集合；
            -f, --fields：代表集合中的字段，可以根据设置选择导出的字段；
            --type：代表导出输出的文件类型，包括csv和json文件；
            -o, --out：代表导出的文件名；
            -q, --query：代表查询条件；
            --skip：跳过指定数量的数据；
            --limit：读取指定数量的数据记录；
            --sort：对数据进行排序，可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而-1是用于降序排列,如sort({KEY:1})。

注意：
0、查询时同时使用sort,skip,limit，无论位置先后，最先执行顺序 sort再skip再limit。
1、密码不需要引号引起来 -p Train!ok.
2、--authenticationDatabase=admin  是等号，而不是空格

### 示例

> 注意 -f

```py
#导出类型为json，数据库：mapdb,集合：bike 字段：bikeId,lat,lng,current_time,source ，条件为source字段为ofo第一条数据
mongoexport --port 27030 -u sa -p Expressin@0618 -d mapdb -c bike -f bikeId,lat,lng,current_time,source --type=json -o bike.csv --query='{"source":"ofo"}' --limit=1
```

**符合查询**：
--queryFile D:\mongoDataJson\query.txt

```js
mongoexport -h xx --port xx -u xx -p  xx -d xx -c xx --type=json  --queryFile D:\mongoDataJson\query.txt -o D:\mongoDataJson\run.json
```

``` JS
{
  "type": 2,
  "exportNum": {
    "$gt": 1
  }
}
```

## 实际使用

### 连接远程数据库

```js
mongo 10.15.225.23:27017/admin -u root -p root123

mongo 52.80.171.106:27017/admin -u root -p root123
```

### 测试环境 23

导出数据《全部》

```js

mongoexport -d sourceData -c sieve_image -o "D:/sourcedata/mongoData/20191218_sieve_image_all.json" --type json -h "10.15.225.23" --port 27017 -u root -p root123 --authenticationDatabase=admin

```

导出数据《带查询条件》

```js

mongoexport -d sourceData -c sieve_image -q "{ batch: '20191125' }" -o "D:/sourcedata/mongoData/20191218_sieve_image_all.json" --type json -h "10.15.225.23" --port 27017 -u root -p root123 --authenticationDatabase=admin
```

### 本地环境 local

导出具体某个批次的 AI图像筛选数据

```js

mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_1' }" -o "D:/sourcedata/mongoData/20191218_sieve_image_nuctech_1.json" --type json
mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_2' }" -o "D:/sourcedata/mongoData/20191225_sieve_image_nuctech_2.json" --type json
mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_9' }" -o "D:/sourcedata/mongoData/20191231_sieve_image_nuctech_9.json" --type json
mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_10' }" -o "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_10.json" --type json
mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_11' }" -o "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_11.json" --type json
mongoexport -d sourceData -c sieve_image -q "{ batch: 'nuctech_12' }" -o "D:/sourcedata/mongoData/20200227_sieve_image_nuctech_12.json" --type json

```

## 导出空包和危险包

### 导出空包

``` Python
# 导出json数据
mongoexport -d sourceData -c sieve_image -q "{ type: 2 }" -f "url" --limit 100 -o "D:/sourcedata/mongoData/20200323_sieve_image_danger_10000.json" --type json

mongoexport -d sourceData -c sieve_image --queryFile E:\Leeing\node\besame\py\sourcedata\exportQuery.json -f "url" --limit 100 -o "D:/sourcedata/mongoData/20200323_sieve_image_safe_10000.json" --type json
```

``` JS
// 修改数据库中的值
function exportDanger() {
  // conn = new Mongo("127.0.0.1:27017")
  // conn = new Mongo("mongodb://root:root123@10.15.225.23:27017/admin")
  conn = new Mongo("mongodb://root:root123@52.80.171.106:27017/admin")
  db = conn.getDB("sourceData")

  // -更新危险图像导出次数
  db.sieve_image.find({type: 1}).limit(10000).forEach(function(item) {
    db.sieve_image.update({'_id': item._id}, {'$set': {'exportNum': NumberInt(1)}})
    // 记录导出事件
    db.export_events.save({
      imgId: item._id.str,
      type: 2,
      createTime: new Date()
    })
  })
}
```

### 导出危险包

``` Python
# 23370
mongoexport -d sourceData -c sieve_image -q "{ type: 2 }" -f "url" --limit 100 -o "D:/sourcedata/mongoData/20200323_sieve_image_danger_10000.json" --type json

mongoexport -d sourceData -c sieve_image --queryFile E:\Leeing\node\besame\py\sourcedata\exportQuery.json -f "url" --limit 100 -o "D:/sourcedata/mongoData/20200323_sieve_image_danger_23370.json" --type json
```

``` JS
// 修改数据库中的值
function exportDanger() {
  // conn = new Mongo("127.0.0.1:27017")
  // conn = new Mongo("mongodb://root:root123@10.15.225.23:27017/admin")
  conn = new Mongo("mongodb://root:root123@52.80.171.106:27017/admin")
  db = conn.getDB("sourceData")

  // -更新危险图像导出次数
  db.sieve_image.find({type: 2}).forEach(function(item) {
    db.sieve_image.update({'_id': item._id}, {'$set': {'exportNum': NumberInt(1)}})
    // 记录导出事件
    db.export_events.save({
      imgId: item._id.str, // 😜将ObjectID转换成str类型的方法。不是 String（）
      type: 2,
      createTime: new Date()
    })
  })
}
```