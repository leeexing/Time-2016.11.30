---
title: Christmas
date: 2018-08-09 7:38:35
tags: young
categories: 前端
image: https://cn.bing.com/az/hprichbg/rb/PortAntonio_ZH-CN10325538004_1920x1080.jpg
description: css 书写也能做得那么优秀
password: 123456
---

## 双位运算符 ~~

可以使用双位操作符来替代 Math.floor( )。双否定位操作符的优势在于它执行相同的操作运行速度更快。

```js
Math.floor(4.9) === 4      //true
// 简写为：
~~4.9 === 4      //true

~~4.5            // 4
Math.floor(4.5)        // 4
~~-4.5        // -4
Math.floor(-4.5)        // -5
```

## 取整 | 0

> 对一个数字| 0可以取整，负数也同样适用，num | 0

```js
1.3 | 0         // 1
-1.9 | 0        // -1
```

## 判断奇偶数 & 1

> 对一个数字& 1可以判断奇偶数，负数也同样适用，num & 1

```js
const num=3;
!!(num & 1)					// true
!!(num % 2)					// true
```

## 强制参数

> 要执行参数分配，可以使用if语句抛出未定义的错误，或者可以利用强制参数。

```js
mandatory = ( ) => {
  throw new Error('Missing parameter!');
}
foo = (bar = mandatory( )) => {            // 这里如果不传入参数，就会执行manadatory函数报出错误
  return bar;
}

```