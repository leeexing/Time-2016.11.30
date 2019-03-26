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

2019-03-15

> 第 32 题：Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法。

// TODO: 有点难

2019-03-14

> 第 31 题：改造下面的代码，使之输出0 - 9，写出你能想到的所有解法。

```js Q
for (var i = 0; i< 10; i++){
  setTimeout(() => {
    console.log(i);
  }, 1000)
}
```

```js A
// 1. 使用let

// 2. 使用闭包
for (var i = 0; i < 10; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000)
  })(i)
}

for (var i = 0; i < 10; i++) {
  setTimeout(((j) => console.log(j))(i), 1000)
}
```

2019-03-13

> 第 30 题：两个数组合并成一个数组

```js Q
请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。
```

```js A
let a = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let b =  ['A', 'B', 'C', 'D']

let c = b.map(item => item + 3)
console.log(c)

console.log(
  [...a, ...c].sort().map(item => {
    if (item.includes('3')) {
      return item.split('')[0]
    }
    return item
  })
)
```

// TIP: 思路真新奇啊

```js 棒
let a = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let b =  ['A', 'B', 'C', 'D']

console.log(
  b.forEach((item, index) => {
    a.splice((index + 1) * 2 + index, 0, item)
  }),
  a
)
```

// TIP:  后面的那个 `+ index` 真的意想不到

```js 都是大牛啊
let arr1 = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];
let arr2 = ["A", "B", "C", "D"];
console.log(
  [...arr1, ...arr2]
    .sort(
      (v2, v1) => (
        v2.codePointAt(0) - v1.codePointAt(0) ||
        v1.length - v2.length ||
        v2.codePointAt(1) - v1.codePointAt(1)
      )
    )
);
```

```js me
let a = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let b =  ['A', 'B', 'C', 'D']

let ret = []
b.forEach((item, index) => {
  ret = ret.concat(a.slice(index * 2, (index + 1) * 2))
  ret.push(item)
})

b.reduce((pre, cur, index) => [...pre, ...a.slice(index * 2, (index + 1) * 2), cur]
, [])
```

```js 这个也很优秀，可以解决一类的问题
b.reduce((pre, cur) => [...pre, ...a.filter(item => item.startsWith(cur)), cur], [])
```

// TIP: 巧妙的使用了 `filter` 和 `startsWith`。很棒

2019-03-12

> 第 29 题：聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的

2019-03-11

> 第 28 题：cookie 和 token 都存放在 header 中，为什么不会劫持 token？

**解答**
cookie
举例：服务员看你的身份证，给你一个编号，以后，进行任何操作，都出示编号后服务员去看查你是谁。

token
举例：直接给服务员看自己身份证

```js
1 攻击者通过xss拿到用户的cookie然后就可以伪造cookie了。
2 或者通过csrf在同个浏览器下面通过浏览器会自动带上cookie的特性
  在通过 用户网站-攻击者网站-攻击者请求用户网站的方式 浏览器会自动带上cookie

但是token
1 不会被浏览器带上 问题2 解决
2 token是放在jwt里面下发给客户端的 而且不一定存储在哪里 不能通过document.cookie直接拿到，通过jwt+ip的方式 可以防止 被劫持 即使被劫持 也是无效的jwt
```

XSS: 即为（Cross Site Scripting）, 中文名为跨站脚本, 是发生在目标用户的浏览器层面上的，当渲染DOM树的过程成发生了不在预期内执行的JS代码时，就发生了XSS攻击。
跨站脚本的重点不在‘跨站’上，而在于‘脚本’上。大多数XSS攻击的主要方式是嵌入一段远程或者第三方域上的JS代码。实际上是在目标网站的作用域下执行了这段js代码。

CSRF（Cross Site Request Forgery），中文是跨站点请求伪造。CSRF攻击者在用户已经登录目标网站之后，诱使用户访问一个攻击页面，利用目标网站对用户的信任，以用户身份在攻击页面对目标网站发起伪造用户操作的请求，达到攻击目的。

**CSRF攻击的本质原因**
CSRF攻击是源于`Web的隐式身份验证机制`！Web的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却无法保证该请求是用户批准发送的。CSRF攻击的一般是由服务端解决。

**CSRF工具的防御手段**
尽量使用POST，限制GET
2. 浏览器Cookie策略
3. 加验证码
4. Referer Check
5. Anti CSRF Token
现在业界对CSRF的防御，一致的做法是使用一个Token（Anti CSRF Token

1. 用户访问某个表单页面。
2. 服务端生成一个Token，放在用户的Session中，或者浏览器的Cookie中。
3. 在页面表单附带上Token参数。
4. 用户提交请求后， 服务端验证表单中的Token是否与用户Session（或Cookies）中的Token一致，一致为合法请求，不是则非法请求。
`CSRF的Token仅仅用于对抗CSRF攻击`。当网站同时存在XSS漏洞时候，那这个方案也是空谈。所以XSS带来的问题，应该使用XSS的防御方案予以解决。

---

1、首先token不是防止XSS的，而是为了防止CSRF的；
2、CSRF攻击的原因是浏览器会自动带上cookie，而浏览器不会自动带上token

--该题终结--

2019-03-10

> 第 27 题：全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？

**解答**
在ES5中，顶层对象的属性和全局变量是等价的，var 命令和 function 命令声明的全局变量，自然也是顶层对象。
但ES6规定，var 命令和 function 命令声明的全局变量，依旧是顶层对象的属性，但 let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。
通过在设置断点，看看浏览器是怎么处理的：
通过上图也可以看到，在全局作用域中，用 let 和 const 声明的全局变量并没有在全局对象中，只是一个块级作用域（Script）中
怎么获取？`在定义变量的块级作用域中就能获取啊`，既然不属于顶层对象，那就不加 window（global）呗。

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

// REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24

**解答**
回流必定会发生重绘，重绘不一定会引发回流。

现代浏览器大多都是通过队列机制来批量更新布局，浏览器会把修改操作放在队列中，至少一个浏览器刷新（即16.6ms）才会清空队列，
但当`你获取布局信息的时候，队列中可能有会影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流与重绘来确保返回正确的值。`

* offsetTop、offsetLeft、offsetWidth、offsetHeight
* scrollTop、scrollLeft、scrollWidth、scrollHeight
* clientTop、clientLeft、clientWidth、clientHeight
* width、height
* getComputedStyle()
* getBoundingClientRect()

__所以，__
我们应该避免频繁的使用上述的属性，他们都会强制渲染刷新队列。

JavaScript

避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

2019-03-04

> 第 21 题：有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣

```js
Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
```

**解答**
Object.prototype.toString.call()
每一个继承 Object 的对象都有 toString 方法，如果 toString 方法没有重写的话，会返回 [Object type]，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用 toString 方法时，会直接返回都是内容的字符串，所以我们需要使用call或者apply方法来改变toString方法的执行上下文。

```js
const an = ['Hello','An'];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
```

这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined 。
Object.prototype.toString.call() 常用于判断浏览器内置对象时。

instanceof
`instanceof`  的内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。
使用 instanceof判断一个对象是否为数组，instanceof 会判断这个对象的原型链上是否会找到对应的 Array 的原型，找到返回 true，否则返回 false。

```js
[]  instanceof Array; // true
```

但 instanceof 只能用来判断对象类型，原始类型不可以。并且所有对象类型 instanceof Object 都是 true。

```js
[]  instanceof Object; // true
```

Array.isArray()
用来判断对象是否为数组

instanceof 与 isArray
当检测Array实例时，Array.isArray 优于 instanceof ，因为 Array.isArray 可以检测出 iframes

Array.isArray() 与 Object.prototype.toString.call()
`Array.isArray()`是ES5新增的方法，当不存在 `Array.isArray()`，可以用 `Object.prototype.toString.call()` 实现。

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```

2019-03-03

> 第 20 题：介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？

2019-03-02

> 第 19 题：React setState 笔试题，下面的代码输出什么？

2019-03-01

> 第 18 题：React 中 setState 什么时候是同步的，什么时候是异步的？

