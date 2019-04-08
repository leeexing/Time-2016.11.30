/**
 * Compose 组合函数
 *
 * 这个也有点头晕呢
 */

// !看起来还是有点别扭
const compose = (...fns) => fns.reduce((f,g) => (...args) => f(g(...args)))
// 点评：f跟g都是函数，...args是在他们之间通过管道(pipe)传输的值

// !了解一下pointfree风格 -- 永远不要说出你的数据
let snakeCase = word => word.toUpperCase().replace(/\s+/ig, '-') // 反面
let snakeCase = compose(replace(/\s+/ig, '-'), toUpperCase) // 当然里面的两个函数需要单独编写

// !redux 版本的compose
export default function compose (...fns) {
  if (fns.length === 0) {
    return arg => arg
  }
  if (fns.length === 1) {
    return fns[0]
  }
  return fns.reduce((f, g) => (...args) => f(g(...args)))
}
// 点评：做了一些容错处理，还是很不错的

// !underscore版本
function compose(...fns) {
  var start = fns.length - 1
  return function (args) {
    var i = start
    var result = fn[start].apply(this, args)
    while(i--) result = fn[i].call(this, result)
    return result
  }
}
