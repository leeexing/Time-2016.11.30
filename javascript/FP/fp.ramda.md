# 函数式编程学习

## pointfree

Pointfree 的本质就是使用你一些通用的函数，组合出各种复杂运算。上层运算不要直接操作数据，而是通过底层函数去处理。
这就要求，将一些常用的操作封装成函数
定义这些函数的时候，根本不需要提到要处理的值
这就是 `pointfree`

## 首先记住几句话

1. 数据一律放在最后一个参数，function first， data last
2. 所有的函数都经过curry（柯里化）处理

Ramda 成为 JavaScript 函数式编程最理想的工具库

## 简单的API

一、比较运算
二、数学运算
三、逻辑运算
四、字符串
五、函数
  * 函数的合成
  * 柯里化
  * 函数的执行
六、数组
  * 数组的特征判断
  * 数组的截取和添加
  * 数组的过滤
  * 单数组运算
  * 双数组运算
  * 复合数组
七、对象
  * 对象的特征判断
  * 对象的过滤
  * 对象的截取
  * 对象的运算
  * 复合对象

[参考](http://www.ruanyifeng.com/blog/2017/03/ramda.html)  

### 简单的例子

```js
const prop = (p, obj) => obj[p]
const propRole = R.curry(prop)('role)
```
上面的代码中，prop函数封装了读取操作。它需要两个参数p（属性名）和obj（对象）。这时，要把数据obj放在最后一个参数，这是为了方便柯里化。函数propRole则是指定读取role属性

### 

and
还没有
both
好用
```js
const numbers = [4,10,0,27,42,17,15,-6,58]

console.log(
  R.pipe(
    R.filter(
      R.both(
        R.gt(R.__, 10),
        R.lt(R.__, 20)
      )
    )
  )(numbers)
)

之前一直使用and
结果始终没能得到预期中的效果
```