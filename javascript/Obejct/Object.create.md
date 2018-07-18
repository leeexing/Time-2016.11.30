Object.create

## Create

> Object.create()方法是ECMAScript5中新增的，用来规范化原型式继承的

Object.create 创建对象是创建一个拥有 **指定原型** 和若干个制定属性的对象，也就是说可以任意指定原型，甚至是null，而 new Object 只是创建一个以 Object.prototype 为原型的对象

```js
var obj = {a: 1}

var o = Object.create(obj, {
  name: {
    configurable: false,
    value: 'leeing'
  }
})

console.log(o.name)
```

```js
Object.create = function(o) {
  function F () {}
  F.prototype = o
  return new F()
}
```


**注意**

* `Object.create(null)` 是没有原型链的。就是连基本的 `toString` 和 `hasOwnProperty` 这类的方法都没有
* 

## 和 new Object 的区别

```js
function Foo() {
  this.name = 'foo'
}

var foo = new Foo()

// 实际的操作

var o = new Object()
// o.prototype = Foo.prototype ❌
o.__proto__ = Foo.prototype
var result = Foo.apply(o, arguments)
return typeof result === 'object' ? result : o
```