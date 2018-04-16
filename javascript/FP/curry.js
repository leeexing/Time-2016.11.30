/**
 * 函数式编程的基础 柯里化函数
 * 
 * 柯里化是把一个有n个参数的函数变成n个只有1个参数的函数
 * 
 * Add = (x, y, z) => x + y + z           | Add(a, b, c)
 * CurryAdd = x => y => z => x + y + z    | CurryAdd(a)(b)(c)
 */

/*==================== 正文开始 ==============================*/

/**
 * return 包装器curried
 * 
 * 可以包装一次，两次，或者更多次。取决于函数的 fn.length
 */
function Curry(fn) {

  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }

}

/**
 * 偏函数
 * 
 * 固定函数的某一个或几个参数，返回一个新的函数，接收剩下的参数
 * 
 * 一般只能绑定一次
 * @param {*} fn 
 */
function Partial(fn, ...argsBound) {

  return function(...args) {
    return fn.apply(this, ...argsBound, ...args)
  }

}

/**
 * 总结：
 * 1、当把已知函数的一些参数固定，结果函数被称为【偏函数】。可以通过 bind 或者其他方式实现
 *    当我们不像一次一次重复相同的参数时，偏函数是很便捷的一种方式。
 * 
 * 2、柯里化是转换函数调用从 f(a, b, c) ☞至 f(a)(b)(c)。还可以实现 参数数量不足时的 偏函数方式调用
 */

 /*==================== 栗子🍊 ==============================*/
function log(date, important, message) {
  console.log(`[${date.getHours()}: ${date.getMinutes()}] [${important}] ${message}`)
}
log = Curry(log)
// 是时候展现真正的技术了
let todayLog = log(new Date())
todayLog('INFO', 'message') // [HH;mm] INFO message

let todayDebug = todayLog('DEBUG')
todayDebug('message') // [HH:mm] DEBUG message



const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))


