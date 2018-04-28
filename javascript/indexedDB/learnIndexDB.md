# [IndexedDB](https://juejin.im/post/5a9d65916fb9a028e46e257a?utm_source=gold_browser_extension#heading-19)

IndexedDB是HTML5规范里新出现的浏览器里内置的数据库.

存储在IndexedDB里的数据是永久保存。IndexedDB很适合存储大量数据，它的API是异步调用的

IndexedDB里数据以对象的形式存储，每个对象都有一个key值索引。IndexedDB里的操作都是事务性的。一种对象存储在一个objectStore里，objectStore就相当于关系数据库里的表。IndexedDB可以有很多objectStore，objectStore里可以有很多对象。每个对象可以用key值获取。

## 很重要的一点

IndexedDB 是`异步操作`。尤其是获取 db （e.target.result）这个变量的时候
如果初始化后不急着立即调用接口获取数据，那还是可以的
如果在初始化后立即就想调用相关api 那么就会报一个
`Cannot read property 'transaction' of undefined`的错

所以
要么提前做好初始化，要么，别那么急着获取数据

## keyPath

设置了这个，add 的时候必须要输入第二个字段

## put

put 的时候，同样需要添加第二个参数

## 先初始化

能确保初始化后再调用db的时候没有问题

## 相关概念

### 数据存储的不同类型

在 Firefox 中，当你使用 open() 创建 IndexedDB 实例时，你可以通过设置专有选项 storage 来选择使用哪种存储类型，例如：

```js
var request = indexedDB.open("myDatabase", { version: 1, storage: "persistent" })

var request = indexedDB.open("myDatabase", { version: 1, storage: "temporary" });
```

第二个参数这样传递只能是在 fireFox 中。 chrome 中只能是 具体的一个数字，表示 version

### 事务的操作都是原子性的。

> 原子性（atomicity）:一个事务是一个不可分割的最小工作单位,要么都成功要么都失败。

原子操作是指你的一个业务逻辑必须是不可拆分的.比如你给别人转钱,你的账号扣钱,别人的账号
增加钱,这个业务逻辑就是原子性的,这个操作就是原子操作,要么都成功要么都失败。

## 对比

### IndexedDB vs Web SQL

WebSQL也是一种在浏览器里存储数据的技术，跟IndexedDB不同的是，IndexedDB更像是一个NoSQL数据库，而WebSQL更像是关系型数据库，使用SQL查询数据。

Tips：W3C已经不再支持这种技术。

### IndexedDB vs Cookies

Cookies(小甜点)听起来很好吃，但实际上并不是。每次HTTP接受和发送都会传递Cookies数据，它会占用额外的流量。例如，如果你有一个10KB的Cookies数据，发送10次请求，那么，总计就会有100KB的数据在网络上传输。Cookies只能是字符串。浏览器里存储Cookies的空间有限，很多用户禁止浏览器使用Cookies。所以，Cookies只能用来存储小量的非关键的数据。