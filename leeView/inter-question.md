# inter-question

> [Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)

工作日每天一道前端大厂面试题，祝大家天天进步，一年后会看到不一样的自己。

## 今日面试题

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