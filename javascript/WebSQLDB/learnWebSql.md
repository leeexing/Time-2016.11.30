# openDatebase

> html 5 本地数据库（Web Sql Database）核心方法openDatabase、transaction、executeSql 详解

## 三个核心方法

1、openDatabase：这个方法使用现有数据库或创建新数据库创建数据库对象。

2、transaction：这个方法允许我们根据情况控制事务提交或回滚。

3、executeSql：这个方法用于执行真实的SQL查询。

## 打开连接并创建数据库

```js
var dataBase = openDatabase("student", "1.0", "学生表", 1024 * 1024, function () {
	if (!dataBase) {
		alert("数据库创建失败！")
	} else {
		alert("数据库创建成功！")
	}
})
```

几个参数意义分别是：
1，数据库名称。
2，版本号 目前为1.0,不管他，写死就OK。
3，对数据库的描述。
4，设置数据的大小。
5，回调函数(可省略)。

初次调用时创建数据库，以后就是建立连接了。

## 创建数据表

```js
this.createTable=function() {
	dataBase.transaction( function(tx) { 
		tx.executeSql(
			"create table if not exists stu (id REAL UNIQUE, name TEXT)", 
			[], 
			function(tx,result){ alert('创建stu表成功') }, 
			function(tx, error){ alert('创建stu表失败:' + error.message) 
		})
	})
}
```

executeSql函数有四个参数，其意义分别是：
1）表示查询的字符串，使用的SQL语言是SQLite 3.6.19。（必选）
2）插入到查询中问号所在处的字符串数据。（可选）
3）成功时执行的回调函数。返回两个参数：`tx` 和执行的结果。（可选）
4）一个失败时执行的回调函数。返回两个参数：tx和失败的错误信息。（可选）


## 执行增删改查

### 1）添加数据

```js
this.insert = function () {
	dataBase.transaction(function (tx) {
		tx.executeSql(
			"insert into stu (id, name) values(?, ?)",
			[id, '徐明祥'],
			function () { alert('添加数据成功') },
			function (tx, error) { alert('添加数据失败: ' + error.message); 
	})
})
```


### 2）查询数据

```js
this.query = function () {
	dataBase.transaction(function (tx) {
		tx.executeSql(
			"select * from stu", 
			[],
			function (tx, result) { //执行成功的回调函数
				//在这里对result 做你想要做的事情吧...........
			},
			function (tx, error) {
				alert('查询失败: ' + error.message);
			} );
	});
}
```

### 3）更新数据

```js
this.update = function (id, name) {
	dataBase.transaction(function (tx) {
		tx.executeSql(
			"update stu set name = ? where id= ?",
			[name, id],
			function (tx, result) {
				//
			},
			function (tx, error) {
				alert('更新失败: ' + error.message);
			})
	})
}
```

### 4）删除数据

```js
this.del = function (id) {
	dataBase.transaction(function (tx) {
		tx.executeSql(
			"delete from stu where id= ?",
			[id],
			function (tx, result) {
				//
			},
			function (tx, error) {
				alert('删除失败: ' + error.message)
			}
		)
	})
}
```

### 5）删除数据表

```js
this.dropTable = function () {
	dataBase.transaction(function (tx) {
		tx.executeSql('drop table stu')
	})
}
```