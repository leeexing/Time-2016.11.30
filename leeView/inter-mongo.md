# mongodb

REFER: 常见的mongodb配置 https://www.jianshu.com/p/f9f1454f251f

TOC

* mongdb时区问题

## 命名规范

文档

【强制】文档中的key禁止使用_以外的特殊字符
【强制】key全部小写，多个单词可以下划线分割
【强制】禁止使用数字打头的key
【强制】禁止自定义_id（_id一般自增，使用无序id极有可能降低写入性能）
【建议】相似类型文档放在一个集合中，能大幅提高索引利用率
【建议】若业务上对于存放数据大小写不敏感，则使用全部大写/小写存放（或者增加一个统一了大小写写的辅助字段）。使用忽略大小写的查询极其耗费性能
【建议】不要存放太长的字符串

集合

不在集合中包含字符 “$”
使用 “.” 来分隔不同命名空间的子集合，如一个博客可能包含两个子集合，blog.posts和blog.authors，而blog本身可以不存在

【强制】禁止使用_以外的特殊字符
【强制】集合名称不超过64字符
【强制】集合名称全部小写
【强制】禁止使用数字打头的集合名，禁止使用system打头的集合名（system为系统集合前缀）
【建议】为了避免库级锁带来的问题，应尽量对写入较大的集合使用“单库单集合”的结构，所以对于新增业务应尽量创建新库，而不是在现有库中创建新集合

数据库

全部使用小写。（支持大写，不建议使用）
不超过64字节
存在保留数据库如：admin、local、config

【强制】数据库名称全部小写
【强制】数据库名称不超过64字符
【强制】禁止使用_以外的特殊字符
【强制】禁止使用数字打头的数据库名
【强制】禁止与保留的数据库重名，如：admin，local，config等

索引

【强制】索引名称长度不超过128字节
【强制】禁止在数组字段上创建索引
【强制】创建组合索引时，尽量将数据基数大（唯一值多的数据）的字段放在组合索引前面

查询

【建议】先做等值查询，再做排序，再做范围查询
【建议】查询中的某些 $ 操作符可能会导致性能低下，尽量避免

ne，not，exists， exists，exists，nin，$or，尽量在业务中不要使用
$exist：因为松散的文档结构导致查询必须遍历每一个文档
$ne：如果当取反的值为大多数，则会扫描整个索引
$not：可能会导致查询优化器不知道应当使用哪个索引，所以会经常退化为全表扫描
$nin：全表扫描
$or：有多少个条件就会查询多少次，最后合并结果集，所以尽可能的使用 $in

## 创建数据库权限用户

```js
// 创建管理员
> show dbs

> use admin

> db.createUser({user: 'root', pwd: 'root#123', roles: [{role: 'root', db: 'admin'}]}) // 这个角色基本上是最高的权限了.一般情况下使用这个就可以了！！！

> db.createUser({user: 'admin', pwd: 'admin#123', roles: [{role: 'readWriteAnyDatabase', db: 'admin'}]})


// 创建指定数据库 testdb 的用户，并分配权限

> use testdb

> db.createuser({user: 'test', pwd: 'test!ok.', roles:[{role: 'readwrite', db: 'testdb'}]})

> db.auth('test1', 'test!ok.') // 返回 1
```

```js 修改密码
// 这是添加用户的方法，但是如果用户名相同，密码不同的话，就会更新密码

> db.addUser('user', 'new password')

// or

> db.changeUserPassword('user', 'new password')
```

```js 删除用户
> db.dropUser('admin')
```

常用的 role 值

1. 数据库用户角色：read、readWrite;
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
6. 超级用户角色：root
7. 内部角色：__system

相应的功能

* Read：允许用户读取指定数据库
* readWrite：允许用户读写指定数据库
* dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
* userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
* clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
* readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
* readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
* userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
* dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
* root：只在admin数据库中可用。超级账号，超级权限

REFER: [linux下mongodb设置用户权限](https://blog.csdn.net/qq_35087256/article/details/85124694)

## mongdb时区问题

使用 flask + mongodb 进行查询时

```py

from bson.codec_options import CodecOptions
from pytz import timezone

list(db.images.with_options(codec_options=CodecOptions(tz_aware=True, tzinfo=timezone('Asia/Shanghai'))).find())

# 查询的结果中，时间相关的字段就自动转为上海时区的时间了

# 或者

shc_tz = timezome('Asia/Shanghai')
client = pymongo.MongoClient(host, port, tz_aware=True, tzinfo=shc_tz)

# 再或者

list(db.images.find({'rcTime': {'$gte': datetime(2019, 6, 27, 12, 9, 0, tzinfo=shc_tz)}))
```

### 开启mongodb.service 启动

### 启动时报错

 Q: `To see additional information in this output, start without the "--fork" option.`

 A:
一个原因就可能是 log 日志文件夹中没有事先创建 `mongodb.log` 这个文件

### shell 下执行 js 文件

```js
//  在OS命令行下，运行一个js文件

mongo 127.0.0.1:27017/test userfindone.js

userfindone.js 的内容：
printjson(db.users.findOne());

```

```js
function testFn() {
  conn = new Mongo("127.0.0.1:27017");
  db = conn.getDB("sourceData");
  db.test_image.save({
    "userName" : "totot",
    "brand" : "苹果8",
    "version" : "1213",
    "question" : "士大夫十分"
  })
}


mongo
load("E:/Leeing/node/besame/test.js")
testFn()
```

## mongo查询NumberLong数据类型

> 需要添加双引号

```js
// Robot
db.getCollection('topic').find({_id:  NumberLong("3666137634075447629")})

// pymongo
db_topic.find_one({'_id': Int64(item)})
```

## 数据导入导出

REFER: https://www.cnblogs.com/qingtianyu2015/p/5968400.html

### 导出

> mongoexport

```conf
mongoexport -d dbname -c collectionname -q -o file --type json/csv -f field
```

参数说明：
            -d ：数据库名
            -c ：collection名
            -q : 查询条件。ISODate需要使用Date(毫秒数)进行查询
            -o ：输出的文件名
            --type ： 输出的格式，默认为json
            -f ：输出的字段，如果-type为csv，则需要加上-f "字段名"

```js
sudo mongoexport -d mongotest -c users -o /home/python/Desktop/mongoDB/users.json --type json -f  "_id,user_id,user_name,age,status"
```

### 导入

> mongoimport

```js
mongoimport -d dbname -c collectionname --file filename --headerline --type json/csv -f field
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

```js
sudo mongoimport -d mongotest -c users --file /home/mongodump/articles.json --type json -h IP --port 27018 -u root -p Train!ok. --authenticationDatabase=admin --upsert
```

## 备份与恢复

### 备份

> mongodump

```conf
mongodump -h dbhost -d dbname -o dbdirectory
```

参数说明：
            -h： MongDB所在服务器地址，例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017
            -d： 需要备份的数据库实例，例如：test
            -o： 备份的数据存放位置，例如：/home/mongodump/，当然该目录需要提前建立，这个目录里面存放该数据库实例的备份数据。

```shell
sudo rm -rf /home/momgodump/
sudo mkdir -p /home/momgodump
sudo mongodump -h 192.168.17.129:27017 -d itcast -o /home/mongodump/
```

### 恢复

> mongorestore

mongorestore恢复数据默认是追加. 如打算先删除后导入，可以加上--drop参数，不过添加--drop参数后，会将数据库数据清空后再导入

```conf
mongorestore -h dbhost -d dbname --dir dbdirectory
```

参数或名：
            -h： MongoDB所在服务器地址
            -d： 需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2
            --dir： 备份数据所在位置，例如：/home/mongodump/itcast/
            --drop： 恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用

```shell
mongorestore -h 192.168.17.129:27017 -d itcast_restore --dir /home/mongodump/itcast/
```

## 固定集合

``` JS
// 创建固定集合
db.createCollection("cappedLogCollection",{capped:true,size:10000})

// 还可以指定文档个数,加上max:1000属性：
db.createCollection("cappedLogCollection",{capped:true,size:10000,max:1000})


// 判断集合是否为固定集合:
db.cappedLogCollection.isCapped()

// 如果需要将已存在的集合转换为固定集合可以使用以下命令：反之不行
db.runCommand({"convertToCapped":"posts",size:10000})
```

### 固定集合查询

固定集合文档按照插入顺序储存的,默认情况下查询就是按照插入顺序返回的,也可以使用$natural调整返回顺序。

``` JS
db.cappedLogCollection.find().sort({$natural:-1})
```

### 固定集合的功能特点

可以插入及更新,但更新不能超出collection的大小,否则更新失败,不允许删除,但是可以调用drop()删除集合中的所有行,但是drop后需要显式地重建集合。

在32位机子上一个cappped collection的最大值约为482.5M,64位上只受系统文件大小的限制。

属性1:对固定集合进行插入速度极快
属性2:按照插入顺序的查询输出速度极快
属性3:能够在插入最新数据时,淘汰最早的数据

用法1:储存日志信息
用法2:缓存一些少量的文档

``` JS
db.createCollection("cappedLogCollection",{capped:true,size:10000,max:1000})
```

size 是整个集合空间大小，单位为【KB】

max 是集合文档个数上线，单位是【个】

如果空间大小到达上限，则插入下一个文档时，会覆盖第一个文档；如果文档个数到达上限，同样插入下一个文档时，会覆盖第一个文档。两个参数上限判断取的是【与】的逻辑。

## 聚合 - aggregate

聚合框架就是要定义一系列 聚合管道（aggregation pipeline）

包含下面几个常用的

* $project -- 允许我们过滤可以传递给管道下一个阶段的字段。
* $match   -- 与 find 类似
* $limit
* skip
* $unwind  -- 允许我们扩展数组，可以将数组中的每一个值拆分为单独的文档。简单理解就是：将一个文档中数组分解成 文档 + 数组[n] 这样的 n 条文档
* $group   -- 根据key来分组文档
* $sort
* $out     -- 可以自动把聚合管道的输出结果保存到集合中。如果集合不存在，则创建，如果存在则完全取代现有的集合

一般的格式如下

```js
db.products.aggregate([ {$match: ...}, {$group: ...}, {$sort: ...} ])
```

$group 就有点想 SQL 里面的 GROUP BY

$group 函数

* $addToSet -- 为组里唯一的值创建一个数组
* $first
* $last
* $max
* $min
* $avg
* $push    -- 返回组内所有值的数组，不去除重复值
* $sum

### 重塑文档

$project

在里面重新添加新的字段名称，或者将不需要展示的字段名设置为0就可以了

```js
// 对字段重命名，产生新的字段

引用符$，格式是："$field"，表示引用doc中 field 的值，如果要引用内嵌 doc中的字段，使用 "$field1.filed2"，表示引用内嵌文档field1中的字段：field2的值。

示例，新建一个field：preIdx，其值和idx 字段的值是相同的。

db.foo.aggregate({
  $match: {
    age: {
      $lte: 25
    }
  }
}, {
  $project: {
    age: 1,
    "preIdx": "$idx",
    idx: 1,
    "_id": 0
  }
})

2.3 派生字段

在$project中，对字段进行计算，根据doc中的字段值和表达式，派生一个新的字段。

示例，preIdx是根据当前doc的idx 减1 得到的
复制代码

db.foo.aggregate({
  $match: {
    age: {
      $lte: 25
    }
  }
}, {
  $project: {
    age: 1,
    "preIdx": {
      $subtract: ["$idx", 1]
    },
    idx: 1,
    "_id": 0
  }
})

```

在$project 执行算术运算的操作符：+($add)，*（$multiply），/（$divide），%（$mod），-（$subtract）

### 主要影响聚合管道性能的关键点

* 尽早在管道里尝试减少文档的数量和大小
* 索引只能用于 $match, $sort操作，而且可以大大加速查询
* 在管道使用 $match和 $sort之外的操作符后不能使用索引

### demo

REFER: [MongoDB 一条数据输出一个字段不同的值的count值](https://blog.csdn.net/hwhaocool/article/details/81741919)

``` JS
db.getCollection('question').aggregate([
//     {$group: {_id: '$uid', count: {$sum: 1}}, ''},
    {$project: {
        _id: 1,
        uid: 1,
        status: 1,
        Accept: {
                $cond: {
                        if: {$eq: [1, '$status']},
                        then: 1,
                        else: 0
                    }
            },
         Unaccept: {
                $cond: {
                        if: {$eq: [0, '$status']},
                        then: 1,
                        else: 0
                    }
             }
     }},
     {$group: {_id: '$uid', total: {$sum: 1}, accept: {$sum: '$Accept'}, unaccpt: {$sum: '$Unaccept'}}},
     {$project: {uid: '$_id', _id: 0, total: 1, accept: 1, unaccept: 1}}
])
```

``` JS mongo数据结构
/* 5 */
{
    "_id" : ObjectId("5ecf937b5fa0df026bcc41f8"),
    "uid" : "3666506507647852544",
    "content" : "golang中的select用法",
    "pictures" : [
        "https://user-gold-cdn.xitu.io/2020/5/22/1723b76a3b7ace16?imageView2/2/w/800/q/85"
    ],
    "topics" : [
        4
    ],
    "reward" : 2,
    "create_at" : ISODate("2020-05-28T18:33:31.086Z"),
    "answer_count" : 2,
    "status" : 0.0
}

/* 6 */
{
    "_id" : ObjectId("5ecf93945fa0df026bcc41f9"),
    "uid" : "3666506507647852544",
    "content" : "go for循环",
    "pictures" : [
        "https://user-gold-cdn.xitu.io/2020/5/22/1723b76a3b7ace16?imageView2/2/w/800/q/85"
    ],
    "topics" : [],
    "reward" : 3,
    "create_at" : ISODate("2020-05-28T18:33:56.241Z"),
    "answer_count" : 3,
    "status" : 0.0
}
```

``` JS 聚合结果
/* 1 */
{
    "_id" : "3666506561536270336",
    "total" : 1.0,
    "accept" : 0.0,
    "unaccpt" : 1.0
}

/* 2 */
{
    "_id" : "3666506507647852544",
    "total" : 6.0,
    "accept" : 1.0,
    "unaccpt" : 5.0
}
```

``` JS
db.getCollection('answer').aggregate([
    {$group: {_id: '$uid', count: {$sum: '$like_count'}}},
    {$group: {_id: '$uid', total: {$sum: 1}, accept: {$sum: '$Accept'}, unaccpt: {$sum: '$Unaccept'}}},
    {$project: {uid: '$_id', _id: 0, total: 1, accept: 1, unaccept: 1}}
])
```


## 原子操作

常用命令

* $update
* $set
* $unset
* $inc
* $push
* $pushALl
* $addToSet
* $pop
* $rename
* $bit

**update**
db.COLLECTION_NAME.update({},{},true|false,true|false);

第一个参数是查询选择器，与findOne的参数一样，相当于sql的where子句

第二个参数是更新操作文件，由各种更新操作符和更新值构成，

第三个参数是upsert。如果是true，表示如果没有符合查询选择器的文档，mongo将会综合第一第二个参数向集合插入一个新的文档。

第四个参数是multi。true:更新匹配到的所有文档，false：更新匹配到的第一个文档，默认值

```js
db.COLLECTION_NAME.update({}, {}, {
  multi: true | false,
  upsert: true | false
});
```

```js
// 一个很值得学习的操作
// 要确保只有没有投过票的用户才能投票
query_selector = {
  _id: ObjectId('4c4b'),
  voter_ids: {
    $ne: ObjectId('2255') // 👍即使是数组也可以使用 $ne 操作符
  }
}
db.reviews.update(query_selector, {
  $push: {
    voter_ids: ObjectId('2255')     // 这个操作很棒。之前不知道是这么用的
  },
  $inc: {
    helpful_votes: 1
  }
})
```

Mongodb中有着强大的更新机制
更新是原子性的，因为查询和修改都在单个操作里面完成
原子性确保 ，即使在高并发环境里，他都可以确保每个用户不会投票超过一次

### findAndModify

https://www.cnblogs.com/wangjing666/p/6844204.html

拥有类似事务特性的更新与查询操作——findAndModify.

findAndModify: `它是原子性的`。允许我们在同一个往返过程中原子更新文档并返回它

原子性更新就是要给不会被其他更新终端或者与其他操作交互的操作
如果用户在我们找到这个文档之后，修改之前，尝试修改此文档呢？
这个查找不会成功。
原子更新会阻止这个情况，所有其他操作必须等待原子更新完成才行

每一个Mongodb更新都是原子性的

一次最多只更新一个文档，也就是条件query条件，且执行sort后的第一个文档。

```js
db.COLLECTION_NAME.findAndModify({
  query: {},

  update: {},

  remove: true | false,

  new: true | false,

  sort: {},

  fields: {},

  upsert: true | false
});
```

query是查询选择器，与findOne的查询选择器相同

update是要更新的值，不能与remove同时出现

remove表示删除符合query条件的文档，不能与update同时出现

new为true：返回个性后的文档，false：返回个性前的，默认是false

sort：排序条件，与sort函数的参数一致。

fields:投影操作，与find*的第二个参数一致。

upsert:与update的upsert参数一样。

```js
// 我们已经嵌入客户买该产品的信息在 product_bought_by 字段中。
// 现在，每当新客户购买的产品，我们会先检查该产品是否仍然可以使用 product_available 字段。
// 如果是的话，我们将减少 product_available 字段的值，并在 product_bought_by 字段插入新客户的嵌入文档
db.products.findAndModify({
  query: {
    _id: 2,
    product_available: {
      $gt: 0
    }
  },
  update: {
    $inc: {
      product_available: -1
    },
    $push: {
      product_bought_by: {
        customer: "rob",
        date: "9-Jan-2014"
      }
    }
  }
})

// 嵌入式文档并使用 findAndModify 查询的方法可以确保只有当它是提供产品的购买信息时被更新。 而整个此事务在同一个查询中的，所以是一个原子的。
```

与此相反，考虑我们可能已经保存了产品的可用性和已经购买的产品，独立的信息情形。
在这种情况下，我们会先检查该产品先查询是否可用。第二个查询，我们将更新采购信息。
然而，这是可能的，这两个查询的执行之间，其他一些用户已经购买的产品，它没有更多可用。如果不知道这一点，我们的第二个查询将更新基于第一个查询结果的购买信息。
这将使数据库不一致，因为我们销售的产品是不具备(产品可能没有了)的。

### setOnInsert

> 如果update的更新参数upsert:true，也就是如果要更新的文档不存在的话会插入一条新的记录，$setOnInsert操作符会将指定的值赋值给指定的字段，如果要更新的文档存在那么$setOnInsert操作符不做任何处理

在 upsert 中，有时候要注意，不能重写某些数据，这时，若只想新增的数据就会非常有用，而不会修改数据

```js
db.collection.update(
   <query>,
   { $setOnInsert: { <field1>: <value1>, ... } },
   { upsert: true }
)
```

```js 使用
db.products.update(
  { _id: 1 },
  {
    $set: { item: "apple" },
    $setOnInsert: { defaultQty: 100 }
  },
  { upsert: true }
)

// 如果指定的集合文档不存在将会创建一个_slug: 'hanmmer'，其它的值为$set操作符和$setOnInsert操作符指定的字段和值

// 新的集合文档是
{ "_id" : 1, "item" : "apple", "defaultQty" : 100 }

```

如果是用 db.collection.update()和upsert:true能够查找到指定的集合文档，Mongodb将会更新$set操作符指定的值，忽略掉$setOnInsert指定的值

### 数组更新

> $push
> $each
> $pusuhAll

$each 在之前的学习中很少使用到

```js
// 一个
db.products.update({slug: 'shoval'}, { $push: { tags: 'tools'} })

// 多个
db.products.update({slug: 'shoval'}, {
  $push: {tags: {$each: ['tools', 'dirt', 'garden']}}
})
// or
db.products.update({slug: 'shoval'}, {
  $pushAll: {tags: ['tools', 'dirt', 'garden']}
})
```

**$slice**
截取某段结果

```js
{
  id: 326,
  temps: [92, 93, 94]
}

db.temps.update({id: 326}, {
  $push: {
    temps: {
      $each: [95, 96]
      $slice: -4
    }
  }
})

// 结果
{
  id: 326,
  temps: [93, 94, 95, 96]
}
```

 TIP:  - 这个很有用啊

**addToSet**
追加的值，只有在不存在的情况下才生效

```js
db.products.update({slug: 'shovel'}, {
  $addToSet: {tags: 'tools'}
})

db.products.update({slug: 'shovel'}, {
  $addToSet: {tags: {$each: ['tools', 'dirt', 'steel']}}
})

db.products.aggregate([
  {$group: {_id: null, uids: {$addToSet: '$UiD'}}},
  {$project: {count: {$size: '$uids'}}}
])

// - 👍 查询一个字段的重复数据
db.getCollection('topic').aggregate(
    {'$group':{
        '_id': {'id': '$number'},
        'uniqueIds': {'$addToSet': '$_id'},
        'count' : {'$sum': 1}
    }},
    {'$match': {
        'count': {'$gt': 1}
    }}
)

 NOTE:  这样就可以可以不使用 `distinct` 这个操作符来获取绝对唯一的字段数量了。

只有在添加的值不存在于 tags 中才进行添加
```

*注意*
$each 只能和 $addToSet、$push 操作符一起使用

**$pop**
从数组中删除元素
`{$pop: {'elementToRemove': 1}}`
1: 最后一个
-1： 第一个

**$pull**
$pull 是 $pop 的复杂形势。
使用 $pull 可以通过值精确指定要删除的元素

```js
db.products.update({slug: 'shovel'}, {
  $pull: {tags: 'dirt'}
})
// 精确删除 dirt 标签

db.products.update({slug: 'shovel'}, {
  $pullAll: {tags: ['dirt', 'garden']}
})
// 同时删除 dirt 和 garden 标签
```

## 复制

REFER: https://www.cnblogs.com/clsn/p/8214345.html

一组Mongodb复制集，就是一组mongod进程，这些进程维护同一个数据集合。复制集提供了数据冗余和高等级的可靠性，这是生产部署的基础。

> 可复制集群、主从复制

强烈推荐在生产环境下启用复制和日志功能

可复制集依赖两个基本的机制：

1. oplog      -- 盖子集合
2. heartbeat

### 复制的基本架构

* 三个存储数据的复制集
具有三个存储数据的成员的复制集有：

    一个主库；

    两个从库组成，主库宕机时，这两个从库都可以被选为主库。

当主库宕机后,两个从库都会进行竞选，其中一个变为主库，当原主库恢复后，作为`从库`加入当前的复制集群即可。

* 当存在arbiter节点
在三个成员的复制集中，有两个正常的主从，及一台arbiter节点：
    一个主库

    一个从库，可以在选举中成为主库

    一个aribiter节点，在选举中，只进行投票，不能成为主库

由于`arbiter节点没有复制数据`，因此这个架构中仅提供一个完整的数据副本。arbiter节点只需要更少的资源，代价是更有限的冗余和容错。

当主库宕机时，将会选择从库成为主，主库修复后，将其加入到现有的复制集群中即可。

### 创建所需目录

```shell

for  i in 28017 28018 28019 28020
    do
      mkdir -p ./$i/conf
      mkdir -p ./$i/data
      mkdir -p ./$i/log
done
```

### 配置多实例环境

```shell

cat >>/mongodb/28017/conf/mongod.conf<<'EOF'
systemLog:
  destination: file
  path: /mongodb/28017/log/mongodb.log
  logAppend: true
storage:
  journal:
    enabled: true
  dbPath: /mongodb/28017/data
  directoryPerDB: true
  #engine: wiredTiger
  wiredTiger:
    engineConfig:
      # cacheSizeGB: 1
      directoryForIndexes: true
    collectionConfig:
      blockCompressor: zlib
    indexConfig:
      prefixCompression: true
net:
  port: 28017
replication:
  oplogSizeMB: 2048
  replSetName: my_repl

# 如果是widows，下面这个启用后台进程的设置无效还报错。只适用于 linux。
processManagement:
  fork: true
EOF

# 复制配置文件


for i in 28018 28019 28020
  do
   \cp  ./28017/conf/mongod.conf  ./$i/conf/
done

# 修改配置文件


for i in 28018 28019 28020
  do
    sed  -i  "s#28017#$i#g" ./$i/conf/mongod.conf
done

# 启动服务


for i in 28017 28018 28019 28020
  do
    ../bin/mongod -f ./$i/conf/mongod.conf
done

# 关闭服务的方法


for i in 28017 28018 28019 28020
   do
     ../bin/mongod --shutdown  -f ./$i/conf/mongod.conf
done


```

 NOTE: -
正常情况下都是在 linux 服务器（生产环境下进行配置的），如果是在 windows 服务下设置的。情况会有所不同
REFER: https://blog.csdn.net/qq_33774822/article/details/83899102

```conf windows

../bin/mongo.exe -f ./28017/conf/mongod.conf
../bin/mongo.exe -f ./28018/conf/mongod.conf
../bin/mongo.exe -f ./28019/conf/mongod.conf

; 注意。使用window进行设置的时候


I face this issue when i tried to run two mongod instance in same machine. It throws error when i provide like

   rs.add("localhost:27027")
   (or)
   rs.add("127.0.0.1:27027")

where 27027 is the port number of secondary.

Solution:

Pass the hostname instead of ip address

  rs.add("myhostname:27027")

shareimprove this answer


rs.add('192.168.120.1:28018') -- 这样才是对的😂
```

 NOTE: -
一定要设置一个 arbert 复制集节点

`rs.addArb('192.168.120.1:28019')`
(or) || 如果有两个 SECONDARY
`rs.addArb('192.168.120.1:28020')`

### 配置复制集

```shell

shell> mongo --port 28017

config = {_id: 'my_repl', members: [
                          {_id: 0, host: '192.168.120.1:28017'},
                          {_id: 1, host: '192.168.120.1:28018'},
                          {_id: 2, host: '192.168.120.1:28019'}]
          }

# 初始化这个配置
> rs.initiate(config)

```

### 测试主从复制

```shell
# 在主节点插入数据
my_repl:PRIMARY> db.movies.insert([ { "title" : "Jaws", "year" : 1975, "imdb_rating" : 8.1 },
   { "title" : "Batman", "year" : 1989, "imdb_rating" : 7.6 },
  ] );

# 在主节点查看数据
my_repl:PRIMARY> db.movies.find().pretty()
{
    "_id" : ObjectId("5a4d9ec184b9b2076686b0ac"),
    "title" : "Jaws",
    "year" : 1975,
    "imdb_rating" : 8.1
}
{
    "_id" : ObjectId("5a4d9ec184b9b2076686b0ad"),
    "title" : "Batman",
    "year" : 1989,
    "imdb_rating" : 7.6
}
```

注：在mongodb复制集当中，默认从库不允许读写。

在从库打开配置（危险）

   　　　注意：严禁在从库做任何修改操作

```shell
my_repl:SECONDARY> rs.slaveOk()
my_repl:SECONDARY> show tables;
movies
my_repl:SECONDARY> db.movies.find().pretty()
{
    "_id" : ObjectId("5a4d9ec184b9b2076686b0ac"),
    "title" : "Jaws",
    "year" : 1975,
    "imdb_rating" : 8.1
}
{
    "_id" : ObjectId("5a4d9ec184b9b2076686b0ad"),
    "title" : "Batman",
    "year" : 1989,
    "imdb_rating" : 7.6
}

# 在从库查看完成在登陆到主库
```

### 复制集管理操作(很有用👍👍👍)

REFER: https://www.cnblogs.com/zhaowenzhong/p/5667312.html
可以更好的管理复制集。

1. 可以修改成员的优先级：priority: 1，2
2. 修改成员的隐藏属性 hidden: true

1）查看复制集状态：

```shell
rs.status();     # 查看整体复制集状态
rs.isMaster();   #  查看当前是否是主节点
```

2）添加删除节点

```shell
rs.add("ip:port");     #  新增从节点
rs.addArb("ip:port"); #  新增仲裁节点
rs.remove("ip:port"); #  删除一个节点
```

ps:
    添加特殊节点时，

    　　1>可以在搭建过程中设置特殊节点

    　　2>可以通过修改配置的方式将普通从节点设置为特殊节点

    　　/*找到需要改为延迟性同步的数组号*/;

3）配置延时节点（一般延时节点也配置成hidden）

```conf
cfg=rs.conf()
cfg.members[2].priority=0
cfg.members[2].slaveDelay=120
cfg.members[2].hidden=true
; 注：这里的2是rs.conf()显示的顺序（除主库之外），非ID
```

重写复制集配置

> rs.reconfig(cfg)

也可将延时节点配置为arbiter节点

> cfg.members[2].arbiterOnly=true

### 强制修改副本集成员

```conf
var config=rs.config()
config.member[n].host=...
config.member[n].priority=...
.....
rs.reconfig(config,{"force":true})
```

## 主从集

1. ./mongod --port 27018
2. use admin
3. db.auth('root', 'xxx!ok.')
4. rs.slaveOk() // 从库验证
5. show dbs

## 分片(集群)

REFER: https://www.cnblogs.com/clsn/p/8214345.html

分片（sharding）是MongoDB用来将大型集合分割到不同服务器（或者说一个集群）上所采用的方法。尽管分片起源于关系型数据库分区，但MongoDB分片完全又是另一回事。
和MySQL分区方案相比，MongoDB的最大区别在于它几乎能自动完成所有事情，只要告诉MongoDB要分配数据，它就能自动维护数据在不同服务器之间的均衡。

### 分片的目的

高数据量和吞吐量的数据库应用会对单机的性能造成较大压力,大的查询量会将单机的CPU耗尽,大的数据量对单机的存储压力较大,最终会耗尽系统的内存而将压力转移到磁盘IO上。

* 垂直扩展：增加更多的CPU和存储资源来扩展容量。

* 水平扩展：将数据集分布在多个服务器上。水平扩展即分片。

### 分片中各个角色的作用

* 配置服务器。是一个独立的mongod进程，保存集群和分片的元数据，即各分片包含了哪些数据的信息。最先开始建立，启用日志功能。像启动普通的mongod一样启动配置服务器，指定configsvr选项。不需要太多的空间和资源，配置服务器的1KB空间相当于真实数据的200MB。保存的只是数据的分布表。当服务不可用，则变成只读，无法分块、迁移数据。
* 路由服务器。即mongos，起到一个路由的功能，供程序连接。本身不保存数据，在启动时从配置服务器加载集群信息，开启mongos进程需要知道配置服务器的地址，指定configdb选项。
* 分片服务器。是一个独立普通的mongod进程，保存数据信息。可以是一个副本集也可以是单独的一台服务器。

### 创建程序所需的目录

```shell
for  i in 17 18 19 20 21 22 23 24 25 26
  do
  mkdir -p /mongodb/280$i/conf
  mkdir -p /mongodb/280$i/data
  mkdir -p /mongodb/280$i/log
done
```

### 编辑shard集群配置文件

```conf
# 系统日志
systemLog:
  destination: file
  path: E:\Mongodb\dbshard\28021\log\mongodb.log
  logAppend: true
# 存储
storage:
  dbPath: E:\Mongodb\dbshard\28021\data
  journal:
    enabled: true
  directoryPerDB: true
  #engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
      directoryForIndexes: true
    collectionConfig:
      blockCompressor: zlib
    indexConfig:
      prefixCompression: true
# 网络
net:
  bindIp: 192.168.120.1
  port: 28021
# 主从复制
replication:
  oplogSizeMB: 2048
  replSetName: sh1
# 分片
sharding:
  clusterRole: shardsvr
# 进程管理
# processManagement:
#   fork: true
```

复制shard集群配置文件

```shell
for  i in  22 23 24 25 26
  do
   \cp  ./28021/conf/mongod.conf  ./280$i/conf/
done
```

修改配置文件端口

```shell
for i in 22 23 24 25 26
  do
    sed  -i  "s#28021#280$i#g" ./280$i/conf/mongod.conf
done
```

修改配置文件复制集名称（replSetName）

```shell
for i in 24 25 26
  do
    sed -i "s#sh1#sh2#g" ./280$i/conf/mongod.conf
done
```

启动shard集群

```shell
for i in 21 22 23 24 25 26
  do
    ../bin/mongod -f ./280$i/conf/mongod.conf
done
```

配置复制集1

```shell
mongo --host 10.0.0.152 --port 28021  admin

# 配置复制集
config = {_id: 'sh1', members: [
                          {_id: 0, host: '10.0.0.152:28021'},
                          {_id: 1, host: '10.0.0.152:28022'},
                          {_id: 2, host: '10.0.0.152:28023',"arbiterOnly":true}]
           }

# 初始化配置
rs.initiate(config)
```

 配置复制集2

 ```shell
mongo --host 10.0.0.152 --port 28024  admin

# 配置复制集
config = {_id: 'sh2', members: [
                          {_id: 0, host: '10.0.0.152:28024'},
                          {_id: 1, host: '10.0.0.152:28025'},
                          {_id: 2, host: '10.0.0.152:28026',"arbiterOnly":true}]
           }

# 初始化配置
rs.initiate(config)
```

### config集群配置

创建主节点配置文件

```conf
systemLog:
  destination: file
  path: /mongodb/28018/log/mongodb.conf
  logAppend: true
storage:
  journal:
    enabled: true
  dbPath: /mongodb/28018/data
  directoryPerDB: true
  #engine: wiredTiger
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1
      directoryForIndexes: true
    collectionConfig:
      blockCompressor: zlib
    indexConfig:
      prefixCompression: true
net:
  bindIp: 10.0.0.152
  port: 28018
replication:
  oplogSizeMB: 2048
  replSetName: configReplSet
sharding:
  clusterRole: configsvr
; processManagement:
;   fork: true
```

将配置文件分发到从节点

```shell
for i in 19 20
  do
   \cp  ./28018/conf/mongod.conf  ./280$i/conf/
done
```

修改配置文件端口信息

```shell
for i in 19 20
  do
    sed  -i  "s#28018#280$i#g" ./280$i/conf/mongod.conf
done
```

启动config server集群

```shell
for i in 18 19 20
  do
    mongod -f ./280$i/conf/mongod.conf
done
```

配置config server复制集

```shell
mongo --host 10.0.0.152 --port 28018  admin

# 配置复制集信息
config = {_id: 'configReplSet', members: [
                          {_id: 0, host: '192.168.120.1:28018'},
                          {_id: 1, host: '192.168.120.1:28019'},
                          {_id: 2, host: '192.168.120.1:28020'}]
           }

# 初始化配置
rs.initiate(config)

# 注：config server 使用复制集不用有arbiter节点。3.4版本以后config必须为复制集
```

### mongos节点配置

```conf mongos.conf
systemLog:
  destination: file
  path: E:\Mongodb\dbshard\28017\log\mongos.log
  logAppend: true
net:
  bindIp: 192.168.120.1
  port: 28017
sharding:
  configDB: configReplSet/192.168.120.1:28108,192.168.120.1:28019,192.168.120.1:28020
; processManagement:
;   fork: true
```

启动mongos

`mongos -f ./28017/conf/mongos.conf`

登陆到mongos

`mongo 192.168.120.1:28017/admin`

 NOTE: - 这里是 `mongos`

添加分片节点

```shell
db.runCommand( { addshard : "sh1/192.168.120.1:28021,192.168.120.1:28022,192.168.120.1:28023",name:"shard1"} )
db.runCommand( { addshard : "sh2/192.168.120.1:28024,192.168.120.1:28025,192.168.120.1:28026",name:"shard2"} )
```

列出分片

```shell
mongos> db.runCommand( { listshards : 1 } )
{
    "shards" : [
        {
            "_id" : "shard2",
            "host" : "sh2/192.168.120.1:28024,192.168.120.1:28025"
        },
        {
            "_id" : "shard1",
            "host" : "sh1/192.168.120.1:28021,192.168.120.1:28022"
        }
    ],
    "ok" : 1
}
```

整体状态查看

`mongos> sh.status();`

### 数据库分片配置

激活数据库分片功能

`mongos> db.runCommand( { enablesharding : "test" } )`

指定分片建对集合分片，范围片键--创建索引

```js
mongos> use test
mongos> db.vast.ensureIndex( { id: 1 } )
mongos> use admin
mongos> db.runCommand( { shardcollection : "test.vast",key : {id: 1} } )
```

集合分片验证

```js
mongos> use test
mongos> for(i=0;i<20000;i++){ db.vast.insert({"id":i,"name":"clsn","age":70,"date":new Date()}); }
mongos> db.vast.stats()
```

### 片键的设置

* 要对一个集合分片，首先你要对这个集合的数据库启用分片，执行如下命令：sh.enableSharding("test")
* 片键是集合的一个键，mongoDB根据这个键拆分数据，例如 username，在启用分片之前，现在希望作为片键的键上创建索引。db.users.ensureIndex({"username":1})
* 对集合分片：sh.shardCollection("test.users",{"username":1})
* 集合被拆分为多个数据块，每个数据块都是集合的一个数据子集。这是按照片键的范围排列的({"username":minValue}-->>{"username":maxValue}指出了每个数据块的范围)
* 包含片键的查询能够直接被发送到目标分片或者是集群分片的一个子集。这样的查询叫做定向查询(targetd query)。有些查询必须被发送到所有分片，这样的查询叫做分散-聚合查询(

      scatter-gather query);mongos将查询分散到所有的分片上，然后经各个分片的查询结果聚集起来。

范围片键

admin> sh.shardCollection("数据库名称.集合名称",key : {分片键: 1}  )

## 项目中使用的`mongod`处理脚本

### 将数据库中的时间进行转化

```js
db.getCollection('EventTracking').find({}).skip(5000).limit(5000).forEach(function(item) {
  item.rcDatetime = new Date(item.rcDate + ' ' + item.rcTime)
  db.getCollection('EventTracking').save(item)
})

```

### 将数据库恢复到原有数据库中

```conf
./mongorestore -h 127.0.0.1:27017 -d brushingdata --dir ./mongodump/brushingdata/
```

### 聚合语句

待补充

## 基本使用

### $elelMatch

当我们需要匹配多个或者更多属性的子文档才使用 `$elemMatch`

```js
db.users.find({
  'address': {
    name: 'home',
    state: 'NY'
  }
})
```

### $size

通过大小查询数组

```js
db.users.find({address: {$size: 3}})
```

### js查询运算符

可以使用特定的`$where`运算符传递js表达式应对任何查询

```js
db.users.find({
  $where: 'function(){ return this.helpful_votes > 3; }'
})

// or 简单表达式的缩写形式

db.users.find({
  $where: 'this.helpful_votes > 3'
})
```

### 正则表达式。需要区分大小写的时候

```js
db.reviews.find({
  user_id: '4546'
  text: {
    $regex: 'best|worst',
    $options: 'i'
  } // 相当于 /best|worst/i
})
```

### 查找数组里面对象的字段

> 使用 $elemMatch

``` JS
找出数组中, 具有 qid=1并且reorderFlag=0的记录

查询数组内同一条记录同时满足2个条件的语句:

{ "qList": { $elemMatch: { "qid": 1, "reorderFlag": 0} } }

// or

{ "qList.qid": 1, "qList.reorderFlag": 0}

// -直接使用对象连接符号 点
```
