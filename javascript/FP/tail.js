/**
 * 尾调用和尾递归
 * 
 * 当一个函数执行时的最后一个步骤是返回另一个函数的调用，这就叫做尾调用
 * 函数在调用的时候会在调用栈（call stack）中存有记录，每一条记录叫做一个调用帧（call frame），
 * 每调用一个函数，就向栈中push一条记录，函数执行结束后依次向外弹出，直到清空调用栈；【尾调用优化只在严格模式下有效】
 * 
 * 递归
 * 当一个函数调用自身，就叫做递归
 * 当一个函数尾调用自身，就叫做尾递归
 */

 // !1、尾调用
function foo() {
  console.log(log)
}
function bar() {
  foo()
}
function baz() {
  bar()
}
// 这种没有尾调用。会形成一个调用栈
// 只要函数后面增加一个 return 就可以了

// !2、尾递归
function factorial(n) {
  if (n === 1) {
    return 1
  }
  return n * factorial(n-1)
}

function tailFactorial(num, total=1) {
  if (num === 1) {
    return total
  }
  return tailFactorial(num - 1, num * total) // 🎈很巧妙的将计算放在第二个参数这里。
}

// 有点柯里化的概念在里面
function factorialTrue(n) {
  return tailFactorial(n, 1)
}