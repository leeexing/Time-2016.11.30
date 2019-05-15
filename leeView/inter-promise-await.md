# inter-promise-await

> 对promise 和 async/await 进一步深入了解

1 代码写的好与不好还是取决于写代码的人的
2 还有一个小细节async/await打包后的代码其实会比 promise 复杂很多， 当然这个是一个忽略不计得问题

## 对比

REFER: https://zhuanlan.zhihu.com/p/26260061

### 为何使用async/await编写出来的代码更好呢？

1

## promise

### Promise.resolve()

```js
var p1 = Promise.resolve( 1 );
var p2 = Promise.resolve( p1 );
var p3 = new Promise(function(resolve, reject){
  resolve(1);
});
var p4 = new Promise(function(resolve, reject){
  resolve(p1);
});

console.log(p1 === p2);
console.log(p1 === p3);
console.log(p1 === p4);
console.log(p3 === p4);

p4.then(function(value){
  console.log('p4=' + value);
});

p2.then(function(value){
  console.log('p2=' + value);
})

p1.then(function(value){
  console.log('p1=' + value);
})

```

Promise.resolve(...)**可以接收一个值或者是一个Promise对象作为参数**。
当`参数是普通值`时，它返回一个resolved状态的Promise对象，`对象的值就是这个参数`；
当`参数是一个Promise对象`时，它`直接返回这个Promise参数`。因此，p1 === p2。
但通过new的方式创建的Promise对象都是一个新的对象，因此后面的三个比较结果都是false。
另外，为什么p4的then最先调用，但在控制台上是最后输出结果的呢？因为p4的`resolve中接收的参数是一个Promise对象`p1，resolve会对`p1”拆箱“`，获取p1的状态和值，但这个**过程是异步**的，可参考下一节。

resovle 参数是 Promise 对象时，会对这个对象进行拆箱操作。拆箱的过程是异步的

### resolve vs reject

```js
var p1 = new Promise(function(resolve, reject){
  resolve(Promise.resolve('resolve'));
});

var p2 = new Promise(function(resolve, reject){
  resolve(Promise.reject('reject'));
});

var p3 = new Promise(function(resolve, reject){
  reject(Promise.resolve('resolve'));
});

p1.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  },
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p2.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  },
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p3.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  },
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

```

Promise回调函数中的第一个参数resolve，会对Promise执行"拆箱"动作。👍**即当resolve的参数是一个Promise对象时，resolve会"拆箱"获取这个Promise对象的状态和值，但这个过程是异步的**。p1"拆箱"后，获取到Promise对象的状态是resolved，因此fulfilled回调被执行；p2"拆箱"后，获取到Promise对象的状态是rejected，因此rejected回调被执行。但Promise回调函数中的第二个参数reject不具备”拆箱“的能力，reject的参数会直接传递给then方法中的rejected回调。因此，即使p3 reject接收了一个resolved状态的Promise，then方法中被调用的依然是rejected，并且参数就是reject接收到的Promise对象。

### 手写Promise-版本一

```js

```

## async/await