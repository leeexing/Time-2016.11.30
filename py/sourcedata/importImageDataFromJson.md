---
title: 导入数据
tag: mongo
description: 从本地文件导入数据到 某个环境的数据库
refer: https://www.cnblogs.com/mengyu/p/7718311.html
---

## 基本使用

```js
mongoimport -d dbname -c collectionname --file filename --headerline --type json/csv -f field -h IP --port 27018 -u root -p Train!ok. --authenticationDatabase=admin [--upsert]
```

参数说明：
            h,--host ：代表远程连接的数据库地址，默认连接本地Mongo数据库；
            --port：代表远程连接的数据库的端口，默认连接的远程端口27017；
            -u,--username：代表连接远程数据库的账号，如果设置数据库的认证，需要指定用户账号；
            -p,--password：代表连接数据库的账号对应的密码；
            -d,--db：代表连接的数据库；
            -c,--collection：代表连接数据库中的集合；
            -f, --fields：代表导入集合中的字段；
            --type：代表导入的文件类型，包括csv和json,tsv文件，默认json格式；
            --file：导入的文件名称
            --headerline：导入csv文件时，指明第一行是列名，不需要导入；

ingest options:
            --drop                     drop collection before inserting documents
            --ignoreBlanks             ignore fields with empty values in CSV and TSV
            --maintainInsertionOrder   insert documents in the order of their appearance in the input source
        -j, --numInsertionWorkers=     number of insert operations to run concurrently (defaults to 1)
            --stopOnError              stop importing at first insert/upsert error
            --upsert                   insert or update objects that already exist
            --upsertFields=            comma-separated fields for the query part of the upsert
            --writeConcern=            write concern options e.g. --writeConcern majority, --writeConcern '{w: 3, wtimeout: 500, fsync: true, j: true}' (defaults to 'majority')

注意：
1、密码不需要引号引起来 -p Train!ok.
2、--authenticationDatabase=admin  是等号，而不是空格

## 实际使用

### 连接远程数据库

```js
mongo 10.15.225.23:27017/admin -u root -p root123

mongo 52.80.171.106:27017/admin -u root -p root123
```

### 从测试环境的数据库中导出 AI 图像筛选的数据

导入数据 《全部》

```js

mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20191218_sieve_image_all.json" --type json --upsert -h "10.15.225.23" --port 27017 -u root -p root123 --authenticationDatabase=admin

```

```js
// test
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20191218_sieve_image_nuctech_1.json" --type json --upsert -h "10.15.225.23" --port 27017 -u root -p root123 --authenticationDatabase=admin

// prod
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20191218_sieve_image_nuctech_1.json" --type json --upsert -h "52.80.171.106" --port 27017 -u root -p root123 --authenticationDatabase=admin

// 2019-12-25
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20191225_sieve_image_nuctech_2.json" --type json --upsert -h "52.80.171.106" --port 27017 -u root -p root123 --authenticationDatabase=admin

// 2019-12-31
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20191231_sieve_image_nuctech_9.json" --type json --upsert -h "52.80.171.106" --port 27017 -u root -p root123 --authenticationDatabase=admin

// 2020-01-16 过年前给重庆分配十个账号，每个账号1W副图像，总共两个批次，10W副图像
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_10.json" --type json --upsert -h "52.80.171.106" --port 27017 -u root -p root123 --authenticationDatabase=admin
mongoimport -d sourceData -c sieve_image --file "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_11.json" --type json --upsert -h "52.80.171.106" --port 27017 -u root -p root123 --authenticationDatabase=admin

// local
mongoimport -d sourceData -c sieve_image_nuctech --file "D:/sourcedata/mongoData/20191218_sieve_image_nuctech_1.json"
mongoimport -d sourceData -c sieve_image_nuctech --file "D:/sourcedata/mongoData/20191225_sieve_image_nuctech_2.json"
mongoimport -d sourceData -c sieve_image_nuctech --file "D:/sourcedata/mongoData/20191231_sieve_image_nuctech_9.json"
mongoimport -d sourceData -c sieve_image_nuctech --file "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_10.json"
mongoimport -d sourceData -c sieve_image_nuctech --file "D:/sourcedata/mongoData/20200116_sieve_image_nuctech_11.json"
```

## 给这一批图像设定一个用户ID

```js

function addUserID(userID, batchName) {
  if (!userID) {
    return
  }
  // conn = new Mongo("127.0.0.1:27017")
  // conn = new Mongo("mongodb://root:root123@10.15.225.23:27017/admin")
  conn = new Mongo("mongodb://root:root123@52.80.171.106:27017/admin")
  db = conn.getDB("sourceData")
  batchName = batchName || 'nuctech_1'
  db.sieve_image.find({"batch" : batchName, 'userID': null}).limit(5000).forEach(function(item) {
    db.sieve_image.update({'_id': item._id}, {'$set': {'userID': userID}})
  })
}

// db.sieve_image_nuctech.update({'_id': item._id}, {'$unset': {'userID': 0}}) // 删除字段
```

```js
load('E:/Leeing/node/besame/test.js')
```

或者直接这么执行js脚本

```js
mongo 10.15.225.23:27017/admin -u root -p root123 **.js

mongo 52.80.171.106:27017/admin -u root -p root123 **.js
```
