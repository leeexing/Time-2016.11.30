# inter-promise-await

> 对promise 和 async/await 进一步深入了解

1 代码写的好与不好还是取决于写代码的人的
2 还有一个小细节async/await打包后的代码其实会比 promise 复杂很多， 当然这个是一个忽略不计得问题

## 对比

REFER: https://zhuanlan.zhihu.com/p/26260061

### 为何使用async/await编写出来的代码更好呢？

1

## promise

REFER: https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/#note-4
REFER: https://juejin.im/post/5b32f552f265da59991155f0#heading-2

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
let pID = 0

class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.pID = ++pID

    this.onResolvedCallbacks = [] // 成功回调。处理异步的promise
    this.onRejectedCallbacks = [] // 失败回调

    let resolve = data => {
      if (this.status === 'pending') {
        this.status = 'resolve'
        this.value = data
        this.onResolvedCallbacks.forEach(f => f())
      }
    }

    let reject = err => {
      if (this.status === 'pending') {
        this.status = 'reject'
        this.reason = err
        this.onRejectedCallbacks.forEach(f => f())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    console.log(this.pID, '现在的状态：', this.status)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}

    let promise2

    if (this.status === 'resolve') {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            //因为有的时候需要判断then中的方法是否返回一个promise对象，所以需要判断
            //如果返回值为promise对象，则需要取出结果当作promise2的resolve结果
            //如果不是，直接作为promise2的resolve结果
            let data = onFulfilled(this.value)
            resolePromise(promise2, data, resolve, reject) //抽离出一个公共方法来判断他们是否为promise对象
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    }

    if (this.status === 'reject') {
      promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let data = onRejected(this.reason)
            resolePromise(promise2, data, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      })
    }

    // 当promise中是异步操作时，添加对应的回调函数
    if (this.status === 'pending') {
      promise2 = new MyPromise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let data = onFulfilled(this.value)
              resolePromise(promise2, data, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let data = onRejected(this.value)
              resolePromise(promise2, data, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })

      })
    }

    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  static resolve(val) {
    return new MyPromise((resolve, reject) => {
      resolve(val)
    })
  }

  static reject(val) {
    return new MyPromise((resolve, reject) => {
      reject(val)
    })
  }

  static all(promises) {
    let arr = []
    let i = 0
    function processData(index, data) {
      arr[index] = data
      i++
      if (i === promises.length) {
        resolve(arr)
      }
      return new MyPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
          promises[i].then(data => {
            processData(i, data)
          }, reject)
        }
      })
    }
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject) // 如果有一个`promise`执行成功就resolve
      }
    })
  }

}


function resolePromise(promise2, data, resolve, reject) {
  if (data === promise2) {
    return reject(new TypeError('循环引用'))
  }
  // console.log('执行了码', data)
  if (data !== null && (typeof data === 'object' || typeof data === 'function')) {
    let called
    try {
      let then = data.then
      if (typeof then === 'function') {
        try {
          then.call(data, val => {
            if (called) return
            called = true
            // 因为可能promise中还有promise，所以需要递归
            resolePromise(promise2, val, resolve, reject)
          })
        } catch (err) {
          if (called) return
          called = true
          reject(err)
        }
      } else {
        // 如果是个普通对象就直接返回resolve作为结果
        resolve(data)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    // 这里返回的是非函数，非对象的值，就直接放在promise2的resolve中作为结果
    resolve(data)
  }
}
```

## async/await

REFER: https://juejin.im/post/596e142d5188254b532ce2da

### 一道题

REFER: https://juejin.im/post/5c0397186fb9a049b5068e54

思考一下会输出什么？

```js
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2');
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')
```

```js answer
script start
async1 start
async2
promise1
script end
promise2      // 这是理解的偏差点
async1 end    // 这是理解的偏差点
setTimeout
```

* 回到`async1`的函数体，`async2`函数`没有返回Promise`，所以把要等`async2`的值`resolve`，把promise压进队列
* 执行new Promise后面的 .then，打印
* 回到`async1`的函数体，`await`返回 `Promise.resolve()`，然后打印后面的 `async1 end`

知识遗漏点

0 实际上 await 是会先执行后面的表达式，然后返回一个Promise，接着就跳出整个 async 函数来执行后面的代码，也就是说执行到 await 的时候，会有一个 `让出线程` 的操作。等后面的同步站执行完了之后，又会回到 async 函数中等待 await 表达式的返回值，如果不是一个 Promise 对象，则会有一个期待它 resolve 成为一个 Promise对象的过程，然后继续执行 async 函数后面的代码，直到是一个 Promise 对象，则把这个 Promise 对象放入 Promise 队列里

1. 当调用一个 async 函数时，会返回一个 promise 对象，当这个 async 函数返回一个值时，Promise 的 resolve 方法会负责传递这个值；当 async 函数抛出异常时，Promise 的 reject 方法也会传递这个异常值
2. async 函数中可能会有 await 表达式，这会使 async 函数暂停执行。等待 Promise 的结果出来。然后恢复 async 函数的执行并返回解析值
3. `await 操作符用于等待一个 promise 对象`，他只能在异步函数 async function 中使用
4. await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理，其回调的 resolve 函数参数作为 await 表达式的值，继续执行 async function
5. 如果 await 操作符后的表达式的值不是一个 promise。则返回该值本身

正常情况下， await 命令后面跟着的时 Promise，如果不是的话，也会被转成一个 立即 resolve 的 Promise

```js 对比一下
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
function async2(){ // 去掉了 async 关键字
    console.log('async2');
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')
```

```js 二次对比
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  await 1
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```

```js 三次对比
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  await async3()
  console.log('async2')
}
async function async3() {}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1')
  resolve();
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```

### 简单实现

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里

```js
function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF()

    function step(nextF) {
      let next
      try {
        next = nextF()
      } catch(e) {
        return reject(e)
      }
      if (next.done) {
        return resolve(next.value)
      }
      let rej
      Promise.resolve(next.value).then(
        (val) => {
          step(() => gen.next(val))
        },
        (e) => step(() => gen.throw(e))
      )
    }

    step(() => gen.next(undefined))
  })
}
```

### todo
