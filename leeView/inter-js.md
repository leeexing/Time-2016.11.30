# js探寻

## js 原生DOM操作

### NodeList

NodeList 对象是一个节点的集合，一般由 Node.childNodes、document.getElementByName、 document.querySelectorAll 返回

Node.childNodes 、 document.getElementsByName 返回的 NodeList 的结果是实时的，实时更新的，当其所包含的元素发生改变时，它会自动更新

HTMLCollection
HTMLCollection是一个特殊的NodeList，表示包含了若干元素（元素顺序为文档流中的顺序）的通用集合，它是实时更新的，当其所包含的元素发生改变时，它会自动更新。另外，它是一个伪数组，如果想像数组一样操作它们需要像 Array.prototype.slice.call(nodeList, 2) 这样调用。

### 创建元素

1、document.createElement(tagName)
2、document.createTextNode(textString)
3、克隆：node.cloneNode(true/false) 它接收一个bool参数，用来表示是否复制子元素
4、createDocumentFragment 也就是文档碎片，它表示一种轻量级的文档，主要是用来存储临时节点，大量操作DOM时用它可以大大提升性能

### appendChild()

### removeChild()

```js
document.getElementById('app').removeChild(oldNode)
```

### replaceChild()

```js
document.getElementById('app').replaceChild(newNode, oldNode)
```

### 节点关系API

父关系API
parentNode ：每个节点都有一个parentNode属性，它表示元素的父节点。Element的父节点可能是Element，Document或DocumentFragment；
parentElement ：返回元素的父元素节点，与parentNode的区别在于，其父节点必须是一个Element元素，如果不是，则返回null；

子关系API
children ：返回一个实时的 HTMLCollection ，子节点都是Element，IE9以下浏览器不支持；
childNodes ：返回一个实时的 NodeList ，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等；
firstChild ：返回第一个子节点，不存在返回null，与之相对应的还有一个 firstElementChild ；
lastChild ：返回最后一个子节点，不存在返回null，与之相对应的还有一个 lastElementChild ；

兄弟关系型API
previousSibling ：节点的前一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点或注释节点，与预期的不符，要进行处理一下。
nextSibling ：节点的后一个节点，如果不存在则返回null。注意有可能拿到的节点是文本节点，与预期的不符，要进行处理一下。
previousElementSibling ：返回前一个元素节点，前一个节点必须是Element，注意IE9以下浏览器不支持。
nextElementSibling ：返回后一个元素节点，后一个节点必须是Element，注意IE9以下浏览器不支持。

### 元素属性型API

setAttribute
给元素设置属性：
element.setAttribute(name, value);

其中name是特性名，value是特性值。如果元素不包含该特性，则会创建该特性并赋值。
getAttribute
getAttribute返回指定的特性名相应的特性值，如果不存在，则返回null：
var value = element.getAttribute("id");

### 样式相关API

直接修改元素的样式
elem.style.color = 'red';
elem.style.setProperty('font-size', '16px');
elem.style.removeProperty('color');
动态添加样式规则
var style = document.createElement('style');
style.innerHTML = 'body{color:red} #top:hover{background-color: red;color: white;}';
document.head.appendChild(style);
window.getComputedStyle
通过 element.sytle.xxx 只能获取到内联样式，借助 window.getComputedStyle 可以获取应用到元素上的所有样式，IE8或更低版本不支持此方法。
var style = window.getComputedStyle(element[, pseudoElt]);

### getBoundingClientRect

getBoundingClientRect 用来返回元素的大小以及相对于浏览器可视窗口的位置，用法如下：
var clientRect = element.getBoundingClientRect();
clientRect是一个 DOMRect 对象，包含width、height、left、top、right、bottom，它是相对于窗口顶部而不是文档顶部，滚动页面时它们的值是会发生变化的。

## js数据类型转换

### 对象转原始数据类型是根据什么流程运行的

对象转原始类型，会调用内置的 [ToPrimitive] 函数，对于该函数而言，其逻辑如下：

1. 如果 `Symbol.ToPrimitive()` 方法存在，优先调用再返回
2. 调用 `valueOf()`，如果转换为原始类型，则返回
3. 调用 `toString()`, 如果转换为原始类型，则返回
4. 如果都没有返回原始类型，则报错

```js
let obj = {
  value: 3,
  valueOf() {
    return 4
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  }
}
console.log(obj + 1) // 7
```

如何让 if(a == 1 && a == 2) 条件成立？

```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2);//true
```

## 闭包

定义：闭包是指有权访问另外一个函数作用域中的变量的函数

## js 原型链

### 如何继承的

参考：[原始js之问](https://juejin.im/post/5dac5d82e51d45249850cd20)

了解到继承是如何一步步进行优化的

简单摘录一下三种继承的实现和优化

```js
function Parent1() {
  this.name = 'parent1'
  this.play = [1, 2, 3]
}

function Child1() {
  Parent1.call(this)
  this.type = 'child1'
}
Child1.prototype = new Parent1()
// 不足：Parent1 的构造函数多执行了一次
```

```js
function Parent2() {
  this.name = 'Parent2'
  this.play = [1, 2, 3]
}
function Child2() {
  Parent2.call(this)
  this.type = 'Child2'
}
Child2.prototype = Parent2.prototype
// 将父类原型对象直接给到子类，父类构造函数只执行一次，而且父类属性和方法均能访问
// 不足：子类实例的构造函数都是 Parent2，这显然不对
```

```js
function Parent3() {
  this.name = 'Parent3'
  this.play = [1, 2, 3]
}
function Child3() {
  Parent3.call(this)
  this.type = 'child3'
}
Child3.prototype = Object.create(Parent3.prototype)
Child3.prototype.constructor = Child3
// 这是最推荐的一种方式，接近完美的继承，它的名字也叫做**寄生组合继承**
```

当然继承也是有弊端的，有隐患的。典型的就是 `大象和香蕉` 的问题

所以，现在有种趋势是使用组合的设计模式

```js
function drive() {}
function music() {}
function addOil() {}

let car = compose(drive, music, addOil)
let newEnergyCar = compose(drive, music)
// 组合的优势就是不必继承一些我不想用的方法
```

代码干净，复用性也很好。这就是面向组合的设计方式。

## addEventListener第三个参数

```js
el.addEventListender('scroll', hander, {
  capture: false, // 是否捕获型。默认为 false （冒泡）
  once: false, // 是否设置单次监听
  passive: false // 是否让 阻止默认行为 （preventDefault）失效
})
```

## 作用域

> 作用域是指程序源代码中定义变量的区域

js采用词法作用域，也就是静态作用域

* 静态作用域：函数的作用域在函数定义的时候就决定了
* 动态作用域：函数的作用域时在函数调用的时候才决定的

### 执行上下文

js引擎并非一行一行的分析和执行程序，而是一段一段的分析执行。当执行一段代码的时候，会进行一个“准备工作” - 执行上下文

全局代码、函数代码、eval代码

变量对象的创建过程：

* 全局上下文的变量对象初始化是全局对象
* 函数上下文的变量对象初始化只包括 Arguments 对象
* 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
* 在代码执行阶段，会再次修改变量对象的属性值

## undefined 与 null 的区别

null 是一个表示 ‘无’ 的对象, 即该处不应该有值，转为数值时为 0； undefined 是表示‘缺少值’，就是此处应该有一个值，但是没有定义，转为数值时为 NaN

```js
Number(null) // 0
Number(undefined) // NaN
```

null的典型用法
（1） 作为函数的参数，表示该函数的参数不是对象。
（2） 作为对象原型链的终点。

nudefined的典型用法
（1）变量被声明了，但没有赋值时，就等于undefined。
（2) 调用函数时，应该提供的参数没有提供，该参数等于undefined。
（3）对象没有赋值的属性，该属性的值为undefined。
（4）函数没有返回值时，默认返回undefined。

## js事件循环与异步

Call Stack 是调用栈，Event Loop 就是本期的主角 - 事件循环，Web APIs 泛指宿主环境，比如 nodejs 中的 c++，前端中的浏览器。

`任何同步的代码都只存在于 Call Stack 中`，遵循先进后出，后进先出的规则，也就是只有异步的代码（不一定是回调）才会进入 Event Loop 中

```js
setTimeout()
setInterval()
Promise.resolve().then()
fetch().then()
```

所有这些异步代码在执行时，都不会进入 Call Stack，而是进入 Event Loop 队列，此时 JS 主线程执行完毕后，且异步时机到了，就会将异步回调中的代码推入 Call Stack 执行。

**Microtask 与 Macrotask**
Event Loop 处理异步的方式也分两种，分别是 setTimeout 之流的 Macrotask，与 Promise 之流的 Microtask。

异步队列是周而复始循环执行的，可以看作是二维数组：横排是一个队列中的每一个函数，纵排是每一个队列。

Macrotask 的方式是将执行函数添加到新的纵排，而 Microtask 将执行函数添加到当前执行到队列的横排，因此 Microtask 方式的插入是轻量的，最快被执行到的。

## Proxy 相比于 defineProperty 的优势

1. 数组变化也能监听到
2. 不需要深度遍历监听

## let、const、var的区别

> 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

在代码块内，使用let、const命令声明变量之前，该变量都是不可用的（会抛出错误），这在语法上，成为“暂时性死区”

## this绑定的四种规则

> this 的绑定规则有四种：默认绑定，隐式绑定，显式绑定，new 绑定.

* 函数是否在 new 中调用 (new 绑定)，如果是，那么 this 绑定的是新创建的对象。
* 函数是否通过 call,apply 调用，或者使用了 bind (即硬绑定)，如果是，那么 this 绑定的就是指定的对象。
* 函数是否在某个上下文对象中调用 (隐式绑定)，如果是的话，this 绑定的是那个上下文对象。一般是 obj.foo()
* 如果以上都不是，那么使用默认绑定。如果在严格模式下，则绑定到 undefined，否则绑定到全局对象。
* 如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind, 这些值在调用时会被忽略，实际应用的是默认绑定规则。
* 箭头函数没有自己的 this, 它的 this 继承于上一层代码块的 this。

### 词法作用域和 this 的区别

* 词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的
* this 是在调用时被绑定的，this 指向什么，完全取决于函数的调用位置

### JS 执行上下文栈和作用域链

> 执行上下文就是当前 JavaScript 代码`被解析和执行时`所在环境, JS 执行上下文栈可以认为是`一个存储函数调用的栈结构`，遵循先进后出的原则。

* JavaScript 执行在单线程上，所有的代码都是排队执行。
* 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈的顶部。
* 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部。当前函数执行 - 完成后，当前函数的执行上下文出栈，并等待垃圾回收。
* 浏览器的 JS 执行引擎总是访问栈顶的执行上下文。
* 全局上下文只有唯一的一个，它在浏览器关闭时出栈。

作用域链: 无论是 LHS 还是 RHS 查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。

## IIFE

> 立即执行函数

```js
(function foo () {
  var a = 123
  console.log(a) // 123
  console.log(this.a) // undefined
  console.log(window.a) // undefined
})()
```

* 函数名没意义，所以使用匿名函数
* 第一个圆括号：将匿名函数转换为函数表达式。
* 第二个圆括号：立即执行匿名函数

1. **创建块级（私有）作用域，避免了向全局作用域中添加变量和函数**，因此也避免了多人开发中全局变量和函数的命名冲突
2. IIFE中定义的任何变量和函数，都会在执行结束时被销毁。这种做法可以减少闭包占用的内存问题，因为没有指向匿名函数的引用。只要函数执行完毕，就可以立即销毁其作用域链了

补充

在javascript里，括号内部不能包含语句，当解析器对代码进行解释的时候，先碰到了()，然后碰到function关键字就会自动将()里面的代码识别为**函数表达式**而不是**函数声明**

## 解构

> 从数组和对象中提取值，对变量进行赋值，这被称为解构

### 数组的解构

```js
var [a, b, c] = [1, 2, 3]
a // 1
b // 2
c // 3

var [a, ...tail] = [1, 2, 3]
tail // [2, 3]
```

2. 如果解构不成功，变量值就是 undefined

```js
let [foo] = []
or
let [bar, foo] = [1]
foo // undefined
```

3. 对于 Set 结构，也可以使用数组的解构赋值

```js
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

4. 默认值

```js
let [foo = true] = [];
foo // true
```

### 对象的解构

// - 之前忽略的点
1. 对象的解构也可以指定默认值

```js
var {x = 3} = {}
x // 3

var {x: y = 3} = {}
y // 3

var {x: y = 3} = {x: 5}
y // 5

```

2. 默认值生效的条件是，对象的属性值严格等于 undefined

```js
var {x = 3} = {x: undefined}
x // 3

var {x = 3} = {x: null}
x // null
```

3. 如果解构失败，变量的值等于 undefined

```js
var {foo} = {bar: 'baz'}
foo // undefined
```

### 函数参数的解构

1. 函数参数的解构可以使用默认值

```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

// - 两个的结果是不一样的

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

2. undefined就会触发函数参数的默认值。

```js
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]
```

## js函数高级、原型链

![高级函数包含的知识点](https://user-gold-cdn.xitu.io/2019/2/22/1691328a8afdf60b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![一张图搞定原型链](https://user-gold-cdn.xitu.io/2019/2/22/1691328abae3da9c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 高阶函数

一个函数 就可以接受另一个函数作为参数或者返回值为另一个函数，这种函数就称之为 高阶函数

### 实现数组 map 方法

```js
Array.prototype.map = function(callbackFn, thisArg) {
  // 处理数组异常
  if (this === null || this === undefined) {
    throw new TypeEror('Cannot read property "map" of null or undefined')
  }
  // 处理回调函数异常
  if (Object.prototype.toString.call(callbackFn) === '[object object]') {
    throw new TypeEror(callbackfn + ' si not a function')
  }
  // 草案中提到要先转换为对象
  let arr = Object(this)
  let T = thisArg

  let len = arr.length >>> 0 // 字面意思是 右移 0 位，但是实际上是把前面的空位用 0 填充
  let result = new Array(len)

  for (let i = 0; i < len; i++) {
    if (i in arr) {
      let kValue = arr[i]
      let mappedValue = callbackFn.call(T, kValue, i, arr)
      result[i] = mappedValue
    }
  }
  return A
}

// V8 源码
function ArrayMap(f, receiver) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.map");

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  if (!IS_CALLABLE(f)) throw %make_type_error(kCalledNonCallable, f);
  var result = ArraySpeciesCreate(array, length);
  for (var i = 0; i < length; i++) {
    if (i in array) {
      var element = array[i];
      %CreateDataProperty(result, i, %_Call(f, receiver, element, i, array));
    }
  }
  return result;
}
```

### 实现数组 reduce 方法

```js
Array.prototype.reduce = function(callbackFn, initialValue) {
  // 异常处理，和上面的map一样
  let obj = Object(this)
  let len = obj.lentgh >>> 0
  let accumulator = initialValue
  let i = 0
  if (accumulator === undefined) {
    for (; i < len; i++) {
      // 查找原型链
      if (i in obj) {
        accumulator = obj[i]
        i++
        break
      }
    }
  }
  if (i === len && accumulator === undefined) {
    throw new Error('Each element of the array is empty)
  }
  for (; i < len; i++) {
    // 通过原型链查找跳过空项
    if (i in obj) {
      accumulator = callbackFn.call(undefined, accumulator, obj[i], obj)
    }
  }
  return accumulator
}

// 注意，数组中的空项是没有键名的
let arr = [1, 2, 3, /* empty*3 */, 7]
for (key in arr) {
  console.log(key)
}
// 1, 2, 3, 7
```

```js V8 源码
function ArrayReduce(callback, current) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.reduce");

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArrayReduce(callback, current, array, length,
                          arguments.length);
}

function InnerArrayReduce(callback, current, array, length, argumentsLength) {
  if (!IS_CALLABLE(callback)) {
    throw %make_type_error(kCalledNonCallable, callback);
  }

  var i = 0;
  find_initial: if (argumentsLength < 2) {
    for (; i < length; i++) {
      if (i in array) {
        current = array[i++];
        break find_initial;
      }
    }
    throw %make_type_error(kReduceNoInitial);
  }

  for (; i < length; i++) {
    if (i in array) {
      var element = array[i];
      current = callback(current, element, i, array);
    }
  }
  return current;
}
```

### 实现数组 push、pop 方法

```js
Array.prototyp.push = function(...items) {
  let arr = Object(this)
  let len = arr.length >>> 0
  let argCount = item.length >>> 0
  if (len + argCount > z ** 53 - 1) {
    throw new Error('the number of array is over the max value restricted!')
  }
  for (let i = 0; i < argCount; i++) {
    obj[len + 1] = items[i]
  }
  let newLength = len + argCount
  obj.length = newLength
  return newLength
}
```

```js
Array.prototype.pop = function() {
  let arr = Object(this)
  let len = arr.length >>> 0
  if (len === 0) {
    arr.length = 0
    return undefined
  }
  len--
  let value = arr[len] // 最后一个值就是 len - 1
  delete arr[len]
  arr.length = len
  return value
}
```

### 现数组 filter 方法

```js
Array.prototyp.map = function(callbackFn, thisArg) {
  // 处理数组异常
  if (this === null || this === undefined) {
    throw new TypeEror('Cannot read property "map" of null or undefined')
  }
  // 处理回调函数异常
  if (Object.prototype.toString.call(callbackFn) === '[object object]') {
    throw new TypeEror(callbackfn + ' si not a function')
  }
  // 草案中提到要先转换为对象
  let arr = Object(this)
  let T = thisArg

  let len = arr.length >>> 0 // 字面意思是 右移 0 位，但是实际上是把前面的空位用 0 填充
  let result = new Array(len)

  for (let i = 0; i < len; i++) {
    if (i in arr) {
      let kValue = arr[i]
      let mappedValue = callbackFn.call(T, kValue, i, arr)
      if (mappedValue) { // 就这么一点差别
        result[i] = kValue
      }
    }
  }
  return A
}
```

### 模拟实现一个 bind 的效果

```js
Function.prototype.bind = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('fuction.prototype.bind is trying to be bound is not callable')
  }
  let self = this
  let fNOP = function() {}

  let fBound = function() {
    self.apply(
      this instanceof self ? this : context,
      args.concat(Array.prototype.slice.call(arguments))
    )
  }

  fNOP.prototype = this.prototyp
  fBound.prototyp = new fNOP()

  return fBound
}

// 通过上面的学习，可以使用 Object.create 来处理原型链

Function.prototyp.bind = function(context, ...args) {
  // ...

  let self = this

  let fBound = function(...params) {
    self.apply(
      this instanceof self ? this : context,
      [...args, ...params]
    )
  }

  fBound.prototyp = Object.create(self.prototyp)

  return fBound
}
```

### 实现一个 call/apply 函数

```js
Function.prototype.call = function(context) {
  let context = context || window
  let fn = Symbol('fn')
  context.fn = this

  let args = Object.prototyp.slice.call(arguments)

  let result = eval('context.fn(' + args + ')')

  delete context.fn
  return result
}
```

```js
Function.prototyp.apply = function(context, args) {
  let context = context || window
  context.fn = this

  let result = eval('context.fn(...args)')

  delete context.fn
  return result
}
```

## 探索js引擎工作

[cankao](http://www.cnblogs.com/onepixel/p/5090799.html)

几个相关的概念：执行环境，全局对象，执行环境，变量对象，活动对象，作用域，作用域链

🎈首先我们要明白一点，只有函数在执行的时候，函数的执行环境才会生成

```js
var x = 1;  //定义一个全局变量 x
function A(y){
   var x = 2;  //定义一个局部变量 x
   function B(z){ //定义一个内部函数 B
       console.log(x+y+z);
   }
   return B; //返回函数B的引用
}
var C = A(1); //执行A,返回B
C(1); //执行函数B，输出 4
```

1. 全局初始化
  * 创建一个全局对象（Global Object）
  * 构建一个执行环境栈（Execution COntext Stack），一个全局执行环境（Execution Context，EC）；将 `EC` 压入执行环境栈中。每个函数都有自己的执行环境，当执行一个函数时，该函数的执行环境就会被推入执行环境栈的顶部并获取执行权。当这个函数执行完毕，他的执行环境又从这个栈的顶部被删除，并把执行权还给之前的执行环境
  * 创建一个于`EC` 关联的全局变量对象（Variable Object）`VO`, 并把 `VO` 指向全局对象。

```js
ECStack = [   //执行环境栈
    EC(G) = {   //全局执行环境
        VO(G):{ //定义全局变量对象
            ... //包含全局对象原有的属性
            x = 1; //定义变量x
            A = function(){...}; //定义函数A
            A[[scope]] = this; //定义A的scope，并赋值为VO本身
        }
    }
];
```

2. 执行函数A
  * JS引擎会船舰函数A的执行环境`EC`，然后EC推入执行环境栈的顶部并获取执行权。
  * 创建函数A的作用域链`Scope Chain`，当执行环境被创建时，它的作用域链就初始化为 当前运行函数的 scope 多包涵的对象
  * js引擎会创建一个当前函数的活动对象（Activable Object，`AO`），AO 中包含了函数的 `形参，arguments对象，this对象，局部变量，内部函数的定义`，然后 AO 会被推入作用域链的顶端。
  * 在定义函数B的时候，JS引擎同样也会为B添加了一个scope属性,并将scope指向了定义函数B时所在的环境，定义函数B的环境就是A的活动对象AO， 而AO位于链表的前端，由于链表具有首尾相连的特点，因此函数B的scope指向了A的整个作用域链

```js 【A 图】
ECStack = [   //执行环境栈
    EC(A) = {   //A的执行环境
        [scope]:VO(G), // ❗VO是全局变量对象
        AO(A) : { //创建函数A的活动对象
            y:1,
            x:2,  //定义局部变量x
            B:function(){...}, //定义函数B
            B[[scope]] = this; //this指代AO本身，而AO位于scopeChain的顶端，因此B[[scope]]指向整个作用域链
            arguments:[],//平时我们在函数中访问的arguments就是AO中的arguments
            this:window  //函数中的this指向调用者window对象
        },
        scopeChain:<AO(A),A[[scope]]>  //链表初始化为A[[scope]],然后再把AO加入该作用域链的顶端,此时A的作用域链：AO(A)->VO(G)
    },
    EC(G) = {   //全局执行环境
        VO(G):{ // ❗创建全局变量对象
            ... //包含全局对象原有的属性
            x = 1; //定义变量x
            A = function(){...}; //定义函数A
            A[[scope]] = this; //定义A的scope，A[[scope]] == VO(G)
        }
    }
];
```

3. 执行函数B
  * 创建函数B的执行环境 EC，然后 EC 推入执行环境栈的顶部并获取执行权。此时执行环境栈中有两个执行环境，分别是全局执行环境和函数B的执行环境
  * 创建函数B的作用域链，并初始化函数B的 Scope 所包含的对象，即包含了A的作用域链
  * 创建函数B的活动对象，并将B的形参 z，arguments对象，this对象 作为 AO 的属性

```js 【B 图】
ECStack = [   //执行环境栈
    EC(B) = {   //创建B的执行环境,并处于作用域链的顶端
        [scope]:AO(A), //指向函数A的作用域链,AO(A)->VO(G); 🎈[scope] 属性，我们可以理解为指针
        var AO(B) = { //创建函数B的活动对象
            z:1,
            arguments:[],
            this:window
        }
        scopeChain:<AO(B),B[[scope]]>  //链表初始化为B[[scope]],再将AO(B)加入链表表头，此时B的作用域链：AO(B)->AO(A)-VO(G)
    },                        ⬆  这里是两个中括号
    EC(A), //A的执行环境已经从栈顶被删除,
    EC(G) = {   //全局执行环境
        VO:{ //定义全局变量对象
            ... //包含全局对象原有的属性
            x = 1; //定义变量x
            A = function(){...}; //定义函数A
            A[[scope]] = this; //定义A的scope，A[[scope]] == VO(G)
        }
    }
]
```

当函数B执行“x+y+z”时，需要对x、y、z 三个标识符进行一一解析，解析过程遵守变量查找规则：先查找自己的活动对象中是否存在该属性，如果存在，则停止查找并返回；如果不存在，继续沿着其作用域链从顶端依次查找，直到找到为止，如果整个作用域链上都未找到该变量，则返回“undefined”。从上面的分析可以看出函数B的作用域链是这样的：

```js
AO(B)->AO(A)->VO(G)
```

4. 局部变量是如何被保存起来的

[如何编写高质量的代码](https://juejin.im/post/5c6bbf0f6fb9a049ba4224fd)

5. this

* this 为什么在运行时才能确定
  执行 A 函数时，只有 A 函数有 this 属性，执行 B 函数时，只有 B 函数有 this 属性，这也就证实了 this 只有在运行时才会存在。

* this 的指向真相
  A 函数调用的时候，属性 this 的属性是 window ，而 通过 var C = A(1) 调用 A 函数后，A 函数的执行环境已经 pop 出栈了。此时执行 C() 就是在执行 B 函数，EC(B) 已经在栈顶了，this 属性值是 window 全局变量

6. 作用域的本质

* 作用域的本质是链表中的一个节点
  - 看 A 图，执行 A 函数时，B 函数的作用域是创建 A 函数的活动对象 AO(A) 。作用域就是一个属性，一个属于 A函数的执行环境中的属性，它的名字叫做 [scope]
  - [scope] 指向的是一个函数活动对象，其实这里最核心的一点，就是大家要把这个函数对象当成一个作用域，但最好理解成一个链表节点

> PS: B 执行 B 函数时，只有 B 函数有 this 属性，这也就交叉证实了 this 只有在运行时才会存在。

7. 作用域链的本质

> 比较 A 图和 B 图的 scopeChain

* 作用域链的本质就是链表
  - 执行哪个函数，那链表就初始化为哪个函数的作用域，然后将该函数的 [scope] 放在表头，形成闭环链表，作用域链的查找，就是通过链表查找的，如果走了一圈还没找到，那就返回 undefined 。

8. 举一个例子

```js
function kun() {
  var result = []
  for (var i = 0; i < 10; i++) {
    result[i] = function() {
      return i
    }
  }
  return result
}

let r = kun()
r.forEach(fn => {
  console.log('fn',fn())
})
```

只有函数在执行的时候，函数的执行环境才会生成。那依据这个规则，我们可以知道在完成 r = kun() 的时候，kun 函数只执行了一次，生成了对应的 AO(kun)

```js
[scope]:VO(G)
AO(kun):{
  i = 10;
  kun = function(){...};
  kun[[scope]] = this;
}
```
这时，在执行 kun() 之后，i 的值已经是 10 了。OK ，下面最关键的一点要来了，请注意，kun 函数只执行了一次，也就意味着:
**在 kun 函数的 AO(kun) 中的 i 属性是 10 。**
kun 函数的作用域链如下：
```js
AO(kun) --> VO(G)
```
而且 kun 函数已经从栈顶被删除了，之只留下了 AO(kun).
这里的 AO(kun) 表示一个节点，这个节点有指针和数据，其中指针指向了 VO(G) ，数据就是 kun 函数的活动对象。
`result` 数组中的每一个函数其作用域都已经确定了，上面也提到过，`JS` 是静态作用域语言，其在程序声明阶段，所有的作用域都将确定。
那么 result 数组中每一个函数其作用域链都是如下：
```js
AO(result[i]) --> AO(kun) --> VO(G)
```
result 数组中的 10 个函数在声明后，总共拥有了 10 个链表(作用域链)，都是 AO(result[i]) --> AO(kun) --> VO(G) 这种形式，但是 10 个作用域链中的 AO(kun) 都是一样的

9. 另一个例子

```js
function kun() {
  var result = []
  for (var i = 0; i < 10; i++) {
    result[i] = (function(n) {
      return function() {
        return n
      }
    })(i)
  }
  return result
}

let r = kun()
r.forEach(fn => {
  console.log('fn', fn())
})
```

```js
ECSack = [
  EC(kun) = {
    [scope]: VO(G)
    AO(kun) = {
      i: 0,
      result[0] = function() {...// return i},
      arguments:[],
      this: window
    },
    scopeChain:<AO(kun), kun[[scope]]>
  },
  // .....
  EC(kun) = [
    [scope]: VO(G)
    AO(kun) = {
      i: 9,
      result[9] = function() {...// return i},
      arguments:[],
      this: window
    },
    scopeChain:<AO(kun), kun[[scope]]>
  ]
]
```

执行 result 数组中的 10 个函数时，走了 10 个不同的链表，同时每个链表的 AO(kun) 节点是不一样的。每个 AO(kun) 节点中的 i 值也是不一样的。
