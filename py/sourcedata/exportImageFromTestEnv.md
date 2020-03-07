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
            -q : 查询条件。ISODate需要使用Date(毫秒数)进行查询
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

## 实际使用

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
