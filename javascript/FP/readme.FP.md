# 函数式编程学习

## pointfree

Pointfree 的本质就是使用你一些通用的函数，组合出各种复杂运算。上层运算不要直接操作数据，而是通过底层函数去处理。
这就要求，将一些常用的操作封装成函数
定义这些函数的时候，根本不需要提到要处理的值
这就是 `pointfree`

## 首先记住几句话

1. 几乎所有的东西都可以转为一个 Stream
2. 

### 简单的例子

```js
const prop = (p, obj) => obj[p]
const propRole = R.curry(prop)('role)
```
上面的代码中，prop函数封装了读取操作。它需要两个参数p（属性名）和obj（对象）。这时，要把数据obj放在最后一个参数，这是为了方便柯里化。函数propRole则是指定读取role属性

### 