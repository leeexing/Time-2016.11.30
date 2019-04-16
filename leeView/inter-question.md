# inter-question

> [Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)

工作日每天一道前端大厂面试题，祝大家天天进步，一年后会看到不一样的自己。

## 今日面试题

2019-04-16

> 第 55 题：某公司 1 到 12 月份的销售额存在一个对象里面，如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]。

2019-04-15

> 第 54 题：冒泡排序如何实现，时间复杂度是多少， 还可以如何改进？

2019-04-14

> 第 53 题：输出以下代码的执行结果并解释为什么

```js
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x)
console.log(b.x)
```

2019-04-11

> 第 52 题：怎么让一个 div 水平垂直居中

2019-04-10

> 第 51 题：Vue 的响应式原理中 Object.defineProperty 有什么缺陷？为什么在 Vue3.0 采用了 Proxy，抛弃了 Object.defineProperty？

2019-04-09

> 第 50 题：实现 (5).add(3).minus(2) 功能

2019-04-09 PM

> 下午茶：输出结果是什么

```js
var z = 10;

function foo(){
    console.log(z);
}

(function(funArg){
    var z = 20;
    funArg();
})(foo);
```

2019-04-08

> 第 49 题：为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片？

2019-04-07

> 第 48 题：call 和 apply 的区别是什么，哪个性能更好一些

2019-04-06

> 第 47 题：双向绑定和 vuex 是否冲突

2019-04-05

> 第 46 题：输出以下代码执行的结果并解释为什么

```js
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```

2019-03-30

> 第 45 题
实现一个new操作符
实现一个JSON.stringify
实现一个JSON.parse
实现一个call或 apply
实现一个Function.bind
实现一个继承
实现一个JS函数柯里化
手写一个Promise(中高级必考)
手写防抖(Debouncing)和节流(Throttling)
手写一个JS深拷贝
实现一个instanceOf

2019-03-29

> 第 44 题：介绍 HTTPS 握手过程

2019-03-28

> 第 43 题：使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

2019-03-27

> 第 42 题：实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现

2019-03-26

> 第 41 题：下面代码输出什么

```js
var a = 10;
(function () {
    console.log(a)
    a = 5
    console.log(window.a)
    var a = 20;
    console.log(a)
})()
```

2019-03-25

> 第 40 题：在 Vue 中，子组件为何不可以修改父组件传递的 Prop，如果修改了，Vue 是如何监控到属性的修改并给出警告的。

2019-03-24

> 第 39 题：介绍下 BFC 及其应用。

2019-03-21

> 第 38 题：下面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
  conso.log(1);
}
```

2019-03-20

> 第 37 题：为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作？

2019-03-19

> 第 36 题：使用迭代的方式实现 flatten 函数。

2019-03-18

> 第 35 题：浏览器缓存可以分成 Service Worker、Memory Cache、Disk Cache 和 Push Cache，那请求的时候 from memory cache 和 from disk cache 的依据是什么，哪些数据什么时候存放在 Memory Cache 和 Disk Cache中？

2019-03-17

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

涉及到了作用域、遍历的提升

2019-03-15

> 第 32 题：Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

2019-03-14

> 第 31 题：改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。

```js
for (var i = 0; i< 10; i++){
  setTimeout(() => {
    console.log(i);
  }, 1000)
}
```

2019-03-13

> 第 30 题：两个数组合并成一个数组

```js
请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。
```

2019-03-12

> 第 29 题：聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的

2019-03-11

> 第 28 题：cookie 和 token 都存放在 header 中，为什么不会劫持 token？

2019-03-10

> 第 27 题：全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？

2019-03-09

> 第 26 题：介绍模块化发展历程.可从IIFE、AMD、CMD、CommonJS、UMD、webpack(require.ensure)、ES Module、<script type="module"> 这几个角度考虑。

2019-03-08

> 第 25 题：说说浏览器和 Node 事件循环的区别

2019-03-07

> 第 24 题：聊聊 Redux 和 Vuex 的设计思想

2019-03-06

> 第 23 题：介绍下观察者模式和订阅-发布模式的区别，各自适用于什么场景

2019-03-05

> 第 22 题：介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

2019-03-04

> 第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

```js
Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
```

2019-03-03

> 第 20 题：介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？

2019-03-02

> 第 19 题：React setState 笔试题，下面的代码输出什么？

2019-03-01

> 第 18 题：React 中 setState 什么时候是同步的，什么时候是异步的？

2019-04-02

> 第 1 期：写 React / Vue 项目时为什么要在组件中写 key，其作用是什么