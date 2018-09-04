/**
 * 手写版的 promise
 * 了解promise的具体实现机理
 * 
 * 1、promise的核心是 then。该方法接收两个参数 【onFulfilled, onRejected】，都是可选的参数
 *      返回值必须是一个 新的 promise 对象❗，这样才支持链式调用
 */
const isFunction = fn => typeof fn === 'function'
const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'
let n = 0

class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    this.signature = `leeing-${++n}`
    this._status = PENDING // 状态
    this._value = undefined // 返回值
    this._fullfilledQueues = [] // 成功回调函数队列
    this._rejectedQueues = [] // 失败回调函数队列
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }
  _resolve (val) {
    const run = () => {
      if (this._status !== PENDING) return
      // 依次执行成功队列中的函数，并清空队列
      const runFullfilled = value => {
        console.log(value, '++++')
        let cb
        while (cb = this._fullfilledQueues.shift()) {
          cb(value)
        }
      }
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = err => {
        let cb
        while (cb = this._rejectedQueues.shift()) {
          cb(err)
        }
      }
      // !如果resolve的参数为Promise对象，则必须等待改Promise对象状态改变后
      // !当前Promise的状态才会改变，且状态取决于参数Promise对象的状态
      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value
          this_status = FULLFILLED
          runFullfilled(value)
        }, err  => {
          this._value = err
          this._status = REJECTED
          runRejected(err)
        })
      } else {
        this._value = val
        this._status = FULLFILLED
        runFullfilled(val)
      }
    }
    // !为了支持同步的promise，这里采用异步调用
    setTimeout(run, 0)
  }
  _reject (err) {
    if (this._status !== PENDING) return
    const run = () => {
      this._status = REJECTED
      this._value = err
      let cb
      while (cb = this._rejectedQueues.shift()) {
        cb(err)
      }
    }
    setTimeout(run, 0)
  }
  then (onFullfilled, onRejected) {
    const {_value, _status} = this
    // !返回一个新的promise对象
    return new MyPromise((onFullfilledNext, onRejectedNext) => {
      let fullfilled = value => {
        try {
          if (!isFunction(onFullfilled)) {
            onFullfilledNext(value)
          } else {
            let res = onFullfilled(value)
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回promise对象，必须等其状态改变后再执行下一个回调
              res.then(onFullfilledNext, onRejectedNext)
            } else {
              // 否则会将返回结果直接作为参数，传入下一个then的回调函数，并理解执行下一个then的回调函数
              onFullfilledNext(res)
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
            let res = onRejected(error)
            if (res instanceof MyPromise) {
              res.then(onFullfilledNext, onRejectedNext)
            } else {
              onFullfilledNext(res)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }
      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fullfilledQueues.push(fullfilled)
          this._rejectedQueues.push(rejected)
          break
        // 当状态已经改变，立即执行对应的回调函数
        case FULLFILLED:
          fullfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  static resolve (value) {
    // !如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
  static reject (value) {
    return new MyPromise((_, reject) => reject(value))
  }
  static all (list) {
    return new MyPromise((resolve, reject) => {
      // !返回值的集合
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // ?所有状态都变成fullfilled时返回的MyPromise状态就变成fullfilled
          if (count === list.length) {
            resolve(values)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }
  static race (list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // ?只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
  static finally (cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => {throw reason})
    )
  }
}

// !参考【https://juejin.im/post/5b83cb5ae51d4538cc3ec354】

// todo test
let p = new MyPromise((resolve, reject) => {
  resolve('well done')
  // setTimeout(() => {
  // }, 2000)
  console.log('hi, darling')
}).then(function foo (res) {
  console.log(res)
  return 89
}).then(function bar (data){
  console.log(data)
})
