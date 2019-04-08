# mongodb

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

## 精通mongoDB

### 索引与查询优化

> 索引非常重要

虽然索引对于查询性能非常重要，但每个新的索引都需要额外的维护成本

## 复制

> 可复制集群、主从复制

强烈推荐在生产环境下启用复制和日志功能

可复制集依赖两个基本的机制：

1. oplog      -- 盖子集合
2. heartbeat

## 分片集群
