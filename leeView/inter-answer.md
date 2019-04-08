# inter-answer

> 工作日每天一道前端大厂面试题，祝大家天天进步，一年后会看到不一样的自己。

## 今日答疑

2019-03-29

> 第 44 题：介绍 HTTPS 握手过程

 A:
三次握手

2019-03-28

> 第 43 题：使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果

 A:
还是有点区别

```js
let a =  [3, 15, 8, 29, 102, 22]

a.sort() // [ 102, 15, 22, 29, 3, 8 ]

a.sort((a, b) => a - b) // [ 3, 8, 15, 22, 29, 102 ]
```

 TIP:  -
若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
若 a 等于 b，则返回 0。
若 a 大于 b，则返回一个大于 0 的值

2019-03-27

> 第 42 题：实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现

**解答**
方法多种

```js
function _sleep (wait) {
  return new Promise(resolve => setTimeout(resolve, wait * 1000))
}

async function sleep (wait) {
  await _sleep(wait)
  console.log(1)
}

function* sleepGenerator (time) {
  yield new Promise((resolve, reject) => setTimeout(resolve, time))
}
sleepGenerator(2000).next().value.then(() => {console.log(1)})
// ES5
function sleep(cb, time) {
  if (typeof cb === 'function') {
    setTimeout(cb, time)
  }
}
sleep(() => console.log(1), 2000)
```

 TIP: -
Generator语法糖很有意思

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

 A:
依次输出：undefined -> 10 -> 20

解析：

在立即执行函数中，var a = 20; 语句定义了一个局部变量 a，由于js的变量声明提升机制，局部变量a的声明会被提升至立即执行函数的函数体最上方，且由于这样的提升并不包括赋值，因此第一条打印语句会打印undefined，最后一条语句会打印20。

由于变量声明提升，a = 5; 这条语句执行时，局部的变量a已经声明，因此它产生的效果是对局部的变量a赋值，此时window.a 依旧是最开始赋值的10，

2019-03-25

> 第 40 题：在 Vue 中，子组件为何不可以修改父组件传递的 Prop，如果修改了，Vue 是如何监控到属性的修改并给出警告的。

 A:

1. 子组件为何不可以修改父组件传递的 Prop
  单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置
2. 如果修改了，Vue 是如何监控到属性的修改并给出警告的。

```js
if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
```

在initProps的时候，在defineReactive时通过判断是否在开发环境，如果是开发环境，会在触发set的时候判断是否此key是否处于updatingChildren中被修改，如果不是，说明此修改来自子组件，触发warning提示。
> 需要特别注意的是，当你从子组件修改的prop属于基础类型时会触发提示。 这种情况下，你是无法修改父组件的数据源的， 因为基础类型赋值时是值拷贝。你直接将另一个非基础类型（Object, array）赋值到此key时也会触发提示(但实际上不会影响父组件的数据源)， 当你修改object的属性时不会触发提示，并且会修改父组件数据源的数据。

2019-03-24

> 第 39 题：介绍下 BFC 及其应用。

 A:
BFC 就是块级格式上下文，是页面盒模型布局中的一种 CSS 渲染模式，相当于一个独立的容器，里面的元素和外部的元素相互不影响。创建 BFC 的方式有：

html 根元素
float 浮动
绝对定位
overflow 不为 visiable
display 为表格布局或者弹性布局
行内块元素、网格布局、contain值为layout、content或 strict的元素等。

BFC 主要的作用是：

清除浮动
防止同一 BFC 容器中的相邻元素间的外边距重叠问题

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

2019-03-09

> 第 26 题：介绍模块化发展历程.可从IIFE、AMD、CMD、CommonJS、UMD、webpack(require.ensure)、ES Module、<script type="module"> 这几个角度考虑。

REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/28

2019-03-08

> 第 25 题：说说浏览器和 Node 事件循环的区别

REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/26

**解答**
其中一个主要的区别在于浏览器的event loop 和nodejs的event loop 在处理异步事件的顺序是不同的,nodejs中有micro event;其中Promise属于micro event 该异步事件的处理顺序就和浏览器不同.nodejs V11.0以上 这两者之间的顺序就相同了.

```js
function test () {
   console.log('start')
    setTimeout(() => {
        console.log('children2')
        Promise.resolve().then(() => {console.log('children2-1')})
    }, 0)
    setTimeout(() => {
        console.log('children3')
        Promise.resolve().then(() => {console.log('children3-1')})
    }, 0)
    Promise.resolve().then(() => {console.log('children1')})
    console.log('end')
}

test()

// 以上代码在node11以下版本的执行结果(先执行所有的宏任务，再执行微任务)
// start
// end
// children1
// children2
// children3
// children2-1
// children3-1

// 以上代码在node11及浏览器的执行结果(顺序执行宏任务和微任务)
// start
// end
// children1
// children2
// children2-1
// children3
// children3-1
```

**浏览器**
关于微任务和宏任务在浏览器的执行顺序是这样的：

* 执行一只task（宏任务）
* 执行完micro-task队列 （微任务）

如此循环往复下去

**Node**
大体的task（宏任务）执行顺序是这样的：

timers定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。
pending callbacks待定回调：执行延迟到下一个循环迭代的 I/O 回调。
idle, prepare：仅系统内部使用。
poll 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
check 检测：setImmediate() 回调函数在这里执行。
close callbacks 关闭的回调函数：一些准备关闭的回调函数，如：socket.on('close', ...)。

Node 10以前：

* 执行完一个阶段的所有任务
* 执行完nextTick队列里面的内容
* 然后执行完微任务队列的内容

Node 11以后：
和浏览器的行为统一了，都是每执行一个宏任务就执行完微任务队列。

2019-03-07

> 第 24 题：聊聊 Redux 和 Vuex 的设计思想

2019-03-06

REFER:https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/45

> 第 23 题：介绍下观察者模式和订阅-发布模式的区别，各自适用于什么场景

REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/25

**解答**
观察者模式中主体和观察者是`互相感知`的，发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知
[以图取胜](https://user-gold-cdn.xitu.io/2017/11/22/15fe1b1f174cd376?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**大白话**
发布-订阅模式就好像报社， 邮局和个人的关系，报纸的订阅和分发是由邮局来完成的。报社只负责将报纸发送给邮局。
观察者模式就好像 个体奶农和个人的关系。奶农负责统计有多少人订了产品，所以个人都会有一个相同拿牛奶的方法。奶农有新奶了就负责调用这个方法。

**总结**
在观察者模式中，观察者是知道Subject的，Subject一直保持对观察者进行记录。然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信。

在发布订阅模式中，组件是松散耦合的，正好和观察者模式相反。

观察者模式大多数时候是同步的，比如当事件触发，Subject就会去调用观察者的方法。而发布-订阅模式大多数时候是异步的（使用消息队列）。

观察者 模式需要在单个应用程序地址空间中实现，而发布-订阅更像交叉应用模式。

2019-03-05

> 第 22 题：介绍下重绘和回流（Repaint & Reflow），以及如何进行优化

REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24

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

REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22

**解答**
npm 模块安装机制：

* 发出`npm install`命令
* 查询`node_modules`目录之中是否已经存在指定模块
  * 若存在，不再重新安装
  * 若不存在
    * npm 向 `registry` 查询模块压缩包的网址
    * 下载压缩包，存放在根目录下的`.npm`目录里
    * 解压压缩包到当前项目的node_modules目录

安装模块
这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。

执行工程自身生命周期
当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）

2019-03-02

> 第 19 题：React setState 笔试题，下面的代码输出什么？

```jsx
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }

  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

**解答**
1、第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2、两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3、setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

输出： 0 0 2 3

我理解的是：`isBatchingUpdates` 默认值为 false，当 react 自身的事件处理函数或 react 生命周期触发时，`isBatchingUpdates` 会被赋值为 true，当更新完成时又会被复原为 false。 @code-coder

2019-03-01

> 第 18 题：React 中 setState 什么时候是同步的，什么时候是异步的？

**解答**
在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state。
所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。

*原因：*
在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，
而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，
而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。

-注意-

这里所说的同步异步， 并不是真正的同步异步， 它还是同步执行的。
这里的异步指的是多个state会合成到一起进行批量更新。

2019-02-28

2019-04-02

> 第 1 期：写 React / Vue 项目时为什么要在组件中写 key，其作用是什么

 A:
REFER: https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1

> key是给每一个vnode的唯一id,可以依靠key,更准确, 更快的拿到oldVnode中对应的vnode节点。

1. 更准确
因为带key就不是就地复用了，在sameNode函数 a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
2. 更快
利用key的唯一性生成map对象来获取对应节点，比遍历方式更快。(这个观点，就是我最初的那个观点。从这个角度看，map会比遍历更快。)

vue和react都是采用diff算法来对比新旧虚拟节点，从而更新节点。在vue的diff函数中（建议先了解一下diff算法过程）。
在交叉对比中，当新节点跟旧节点头尾交叉对比没有结果时，`会根据新节点的key去对比旧节点数组中的key`，从而找到相应旧节点（这里对应的是一个key => index 的map映射）。
如果没找到就认为是一个新增节点。而如果没有key，那么就会采用遍历查找的方式去找到对应的旧节点。一种一个map映射，另一种是遍历查找。相比而言。map映射的速度更快。

another (对比)
正是因为带唯一key时每次更新都不能找到可复用的节点，不但要销毁和创建vnode，在DOM里添加移除节点对性能的影响更大。所以才会说“不带key可能性能更好”。
说到底，`key的作用就是更新组件时判断两个节点是否相同`。相同就复用，不相同就删除旧的创建新的。
因为不带key时节点能够复用，省去了销毁/创建组件的开销，同时只需要修改DOM文本内容而不是移除/添加节点，这就是文档中所说的“刻意依赖默认行为以获取性能上的提升”。
既然如此，为什么还要建议带key呢？`因为这种模式只适用于渲染简单的无状态组件`。对于大多数场景来说，列表组件都有自己的状态。

## 手写js

> 第 49 题：为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片？

 A:
作用：工作中，用于前端监控，比如曝光等等，谷歌和百度的都是用的1x1 像素的透明 gif 图片；
why?

1. 没有跨域问题，一般这种上报数据，代码要写通用的；（排除ajax）
2. 不会阻塞页面加载，影响用户的体验，只要new Image对象就好了；（排除JS/CSS文件资源方式上报）
3. 在所有图片中，体积最小；（比较PNG/JPG）

* 能够完成整个 HTTP 请求+响应（尽管不需要响应内容）
* 触发 GET 请求之后不需要获取和处理数据、服务器也不需要发送数据
* 跨域友好
* 执行过程无阻塞
* 相比 XMLHttpRequest 对象发送 GET 请求，性能上更好
* GIF的最低合法体积最小（最小的BMP文件需要74个字节，PNG需要67个字节，而合法的GIF，只需要43个字节）

```html
<script type="text/javascript">
  var thisPage = location.href;
  var referringPage = (document.referrer) ? document.referrer : "none";
  var beacon = new Image();
  beacon.src = "http://www.example.com/logger/beacon.gif?page=" + encodeURI(thisPage)
  + "&ref=" + encodeURI(referringPage);
</script>
```

2019-04-07

> 第 48 题：call 和 apply 的区别是什么，哪个性能更好一些

 A:

* Function.prototype.apply和Function.prototype.call 的作用是一样的，区别在于传入参数的不同；
* 第一个参数都是，指定函数体内this的指向；
* 第二个参数开始不同，apply是传入带下标的集合，数组或者类数组，apply把它传给函数作为参数，call从第二个开始传入的参数是不固定的，都会传给函数作为参数。
* call比apply的性能要好，平常可以多用call, call传入参数的格式正是内部所需要的格式

总结: 在我们平时的开发中其实不必关注call和apply的性能问题，但是可以尽可能的去用call，特别是es6的reset解构的支持，call基本可以代替apply，可以看出`lodash`源码里面并没有直接用Function.prototype.apply，而是在参数较少(1-3)个时采用call的方式调用(因为lodash里面没有超过4个参数的方法，PS如果一个函数的设计超过4个入参，那么这个函数就要考虑重构了)
REFER: https://github.com/noneven/__/issues/6

2019-04-06

> 第 47 题：双向绑定和 vuex 是否冲突

 A:

没有好好看官网：
REFER: https://vuex.vuejs.org/zh/guide/forms.html

```js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在严格模式下，无论何时发生了状态变更且不是由 `mutation` 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到

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

 A:

```js
结果：[,,1,2], length为4
伪数组（ArrayLike）
```

 TIP: -
在`对象`中加入`splice`属性方法，和`length`属性后。这个对象变成一个类数组。

> push方法将值追加到数组中。push 方法有意具有通用性。该方法和 call() 或 apply() 一起使用时，可应用在类似数组的对象上。push 方法根据 length 属性来决定从哪里开始插入给定的值。如果 length 不能被转成一个数值，则插入的元素索引为 0，包括 length 不存在时。当 length 不存在时，将会创建它。
> 对象转数组的方式： Array.from()、splice()、concat()等

```js 不包含splice
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'push': Array.prototype.push
}
obj.push(11)
obj.push(33)
console.log(obj)

// {2: 11, 3: 33, length: 4, push: ƒ}
// 依旧还是一个对象。没有变成一个类数组
```

```js ChromeDevTools
    /**
     * @param {?Object} obj
     * @return {boolean}
     */
    function isArrayLike(obj) {
      if (!obj || typeof obj !== 'object')
        return false;
      try {
        if (typeof obj.splice === 'function') {
          const len = obj.length;
          return typeof len === 'number' && (len >>> 0 === len && (len > 0 || 1 / len > 0));
        }
      } catch (e) {
      }
      return false;
    }
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

REFER: https://juejin.im/post/5c9c3989e51d454e3a3902b6

 A:

```js new
function new (func, ...args) {
  let obj = Object.create(null)
  obj.__proto__ = func.prototype
  let ret = func.apply(obj, args)
  return typeof ret === 'object' ? ret : obj
}

// 牛人是这么写的
function _new (fn, ...args) {
  const obj = Object.create(fn.prototype)
  const ret = fn.apply(obj, args)
  return ret instanceof Object ? ret : obj
}
```

 TIP: -
new 实例化的过程：

1. 生成一个新对象
2. 挂在原型链
3. 执行。绑定this
4. 返回新对象

JSON.stringify

> JSON.stringify(value[, replacer [, space]])

```js JSON.stringify
// Boolean | Number| String 类型会自动转换成对应的原始值。
// undefined、任意函数以及symbol，会被忽略（出现在非数组对象的属性值中时），或者被转换成 null（出现在数组中时）。
// 不可枚举的属性会被忽略
// 如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略。

function jsonStringify (obj) {
  let type = typeof obj
  if (type !== 'object' || type === null) {
    if (/string|undefined|function/.test(type)) {
      obj = '"' + obj + '"'
      return String(obj)
    }
  } else {
    let json = []
    isArr = Array.isArray(obj)
    for (let key in obj) {
      let val = obj[key]
      let typeV = typeof val
      if (/string|undefined|function/.test(typeV)) {
        val = '"' + val + '"'
      } else if (typeV === 'object') {
        val = jsonStringify(val)
      }
      json.push((isArr ? '' : '"' + key + '"') + String(val))
    }
    return (isArr ? '[' : '{') + String(json) + (isArr ? ']' : '}')
  }
}
```

 TIP: -
理清思路也不难

JSON.parse

> 核心：Function与eval有相同的字符串参数特性。

```js JSON.parse
var jsonStr = '{ "age": 20, "name": "jack" }'
var json = (new Function('return ' + jsonStr))();
```

call

核心：

* 将函数设为对象的属性
* 执行&删除这个函数
* 指定this到函数并传入给定参数执行函数
* 如果不传入参数，默认指向为 window

```js call
// Function.prototype._call = (context = window, ...args) => { // 不能使用箭头函数，不然就绑定了 this
Function.prototype._call = function (context = window, ...args) {
  context.fn = this
  let ret = context.fn(...args)
  delete context.fn
  return ret
}
```

```js apply
Function.prototype._apply = (context = window, ...args) => {
  context.fn = this
  let ret
  if (args.length > 1) {
    ret =  = context.fn(...args)
  } else {
    ret = context.fn()
  }
  delete context.fn
  return ret
}
```

bind

> 会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

```js bind
Function.prototype._bind = (cotext, ...args) => {
  if (typeof context !== 'function) {
    throw new Error('not a function)
  }
  let that = this
  let bound = function (...params) {
    return that.apply(this instanceof bound ? this : context, [...args, ...params])
  }
  function F () {}
  F.prototype = this.prototype
  bound.prototype = new F()

  return bound
}
```

debounce
防抖

> 触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间

```js
const debounce = (fn, wait=500, immediate=true) => {
  let timer
  return function (...args) {
    timer && clearTimeout(timer)
    if (immediate) {
      !timer && fn.apply(this, args)
      timer = setTimeout(() => {
        return fn.apply(this, args)
      }, wait)
    } else {
      timer = setTimeout(() => {
        return fn.apply(this, args)
      }, wait)
    }
  }
}
```

throttle
节流

> 如果一个函数持续的，频繁地触发，那么让它在一定的时间间隔后再触发。
> 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率

```js
const throttle = (fn, wait=500) => {
  let timer
  return funciton (..args) {
    if (!timer) {
      timer = setTimeout(() => { // 不用箭头函数的话，需要保存this变量
        return fn.apply(this, atgs)
        timer = null
      }, wait)
    }
  }
}
```

 TIP: -
还是容易忘记

deepClone

```js
function deepClone (obj) {
  let ret
  if (typeof obj === 'object') {
    ret = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
      ret[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  } else {
    ret = obj // 简单数据，直接赋值
  }
  return ret
}

// 简单

function deep_clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

instanceof

```js
function instanceOf (left, right) {
  let proto = left.__proto__
  let prototype = right.prototype
  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true
    proto = proto.__proto__
  }
}
```

 TIP: -
需要切实理解原型链的机制，才会明白这里的写法

promise

```js

```