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

class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    this._status = PENDING // 状态
    this._value = undefined // 返回值
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }
  _resolve (val) {
    if (this._status !== PENDING) return
    this._status = FULLFILLED
    this._value = val
  }
  _reject (err) {
    if (this._status !== PENDING) return
    this._status = REJECTED
    this._value = err
  }

}

// !参考【https://juejin.im/post/5b83cb5ae51d4538cc3ec354】