# inter-answer

> 工作日每天一道前端大厂面试题，祝大家天天进步，一年后会看到不一样的自己。

## 今日答疑

2019-03-21

```js
var a = {
  _a: 0,
  toString () {
    return ++this._a
  }
}
// or
let a = {
  m: 0,
  valueOf () {
    return ++this.n
  }
}
```

2019-03-20

> 第 37 题：为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

* 首先要明白一点，`mutation`还是`reducer`都是处理同步事务。同步的意义在于这样每一个`mutation`执行完后都可以对应到一个新的状态
* 其次，在`mutation`中混合异步调用会导致程序很难调试。当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢

```js
store.commit('increment')
// 任何由 "increment" 导致的状态变更都应该在此刻完成。
```

2019-03-19

> 第 36 题：使用迭代的方式实现 flatten 函数。

```js
const flatten = arr =>
  arr.reduce((pre, cur) => Array.isArray(cur) ? pre.concat(flatten(cur)) : pre.concat(cur), [])
// or
const flatten = arr =>
  arr.reduce((pre, cur) => Array.isArray(cur) ? [...pre, ...flaten(cur)] : [...pre, cur], [])
// genereate
function* flat (arr) {
  for (let item of arr) {
    if (Array.isArray(item)) {
      yield* flat(item) // Generator 委托。必须要有 *
    } else {
      yield item
    }
  }
}
function flatten (arr) {
  let result = []
  for (let val of flat(arr)) {
    result.push(val)
  }
  return result
}
```

// TIP:  善用`ES6`语法

2019-03-18

> 第 35 题：浏览器缓存可以分成 Service Worker、Memory Cache、Disk Cache 和 Push Cache，那请求的时候 from memory cache 和 from disk cache 的依据是什么，哪些数据什么时候存放在 Memory Cache 和 Disk Cache中？

[这篇文章很详细](https://www.jianshu.com/p/54cc04190252)
and

* from memory cache：字面理解是从内存中，其实也是字面的含义，这个资源是直接从内存中拿到的，不会请求服务器一般已经加载过该资源且缓存在了内存当中，当关闭该页面时，此资源就被内存释放掉了，再次重新打开相同页面时不会出现from memory cache的情况
* from disk cache：同上类似，此资源是从磁盘当中取出的，也是在已经在之前的某个时间加载过该资源，不会请求服务器但是此资源不会随着该页面的关闭而释放掉，因为是存在硬盘当中的，下次打开仍会from disk cache
* form memory cache：不请求网络资源，资源在内存当中，一般`脚本、字体、图片`会存在内存当中
* form disk ceche：不请求网络资源，在磁盘当中，一般非脚本会存在内存当中，如`css`等

// TIP:  这题是真的不知道。有点难

> 第 34 题：简单改造下面的代码，使之分别打印 10 和 20。

```js
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
```

2019-03-16

> 第 33 题：下面的代码打印什么内容，为什么？

```js
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
```

// TELL:  网友的回答
1打印结果内容如下：
ƒ b() {
b = 20;
console.log(b)
}
2原因：
作用域：执行上下文中包含作用于链：
在理解作用域链之前，先介绍一下作用域，作用域可以理解为执行上下文中申明的变量和作用的范围；包括块级作用域/函数作用域；
特性：声明提前：一个声明在函数体内都是可见的，函数声明优先于变量声明；
在非匿名自执行函数中，函数变量为只读状态无法修改；

// 另一个更好的例子

```js
var b = 10;
(function b() {
   // 内部作用域，会先去查找是有已有变量b的声明，有就直接赋值20，确实有了呀。发现了具名函数 function b(){}，拿此b做赋值；
   // NOTE: IIFE的函数无法进行赋值（内部机制，类似const定义的常量），所以无效。
  // （这里说的“内部机制”，想搞清楚，需要去查阅一些资料，弄明白IIFE在JS引擎的工作方式，堆栈存储IIFE的方式等）
    b = 20;
    console.log(b); // [Function b]
    console.log(window.b); // 10，不是20
})();

var b = 10;
(function b() {
  'use strict' // 注意
  b = 20;
  console.log(b)
})() // "Uncaught TypeError: Assignment to constant variable."

var b = 10;
(function b() {
    window.b = 20; // NOTE:  有window
    console.log(b); // [Function b]
    console.log(window.b); // 20是必然的
})();

var b = 10;
(function b() {
    var b = 20; // IIFE内部变量
    console.log(b); // 20
   console.log(window.b); // 10
})();
```

IIFE会创建一个块级作用域，
根据作用域链的知识，当出现同名的变量的时候，会优先访问更"近"的变量
在题目中的IIFE里面b=20其实访问的是window下的b变量，
所以IIFE中其实没有b变量，
那么最近的b变量就是这个函数。

// TIP: 重点是：非匿名自执行函数，函数名只读。