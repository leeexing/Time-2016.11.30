/**
 * 这里想要重点讲的是 replace 里面的 第二个参数的使用
 * 
 * ECMAScript规定，replace（）方法的参数replacement可以是函数而不是字符串。
 * 在这种情况下，每个匹配都调用该函数，它返回的字符串将替换文本使用。
 * 第一个参数表示匹配到的字符，第二个参数表示匹配到的字符最小索引位置（RegExp.index），第三个参数表示被匹配的字符串（RegExp.input）
 */

// 1、第一个栗子
let str = 'DR Mobile 实验室@ - {{ msg }} - {{zoom}}'
let reg = /\{\{(.*?)\}\}/g

reg.test(str)
// 这个特性也需要好好学习
RegExp.$1 // msg

str.replace(reg, (matched, placeholder) => {
  console.log(matched) // {{ msg }}  和 {{zoom}}
  console.log(placeholder) // msg  和 zoom
  // 这里必须返回一个具体的替代的数值，否者默认就是用 undefined 去替代
  // 这里可以根据自己的需求进行个性替换
  return '#' + placeholder + '$'
})

/* 具体输出 */

// {{ msg }}
// msg 
// {{zoom}}
// zoom
// "DR Mobile 实验室@ - # msg $ - #zoom$"

/**
 * 如果是这样
 * 少了一个问号 ？
 * ？ 是非贪婪模式，就是尽可能少的匹配字符
 */
str.replace(/\{\{(.*)\}\}/g, (matched, placeholder) => {
  console.log(matched) // {{ msg }}  和 {{zoom}}
  console.log(placeholder) // msg  和 zoom
  return '#' + placeholder + '$'
})
// {{ msg }} - {{zoom}} 这是 完整的字符匹配到的字符
// msg }} - {{zoom  这是 p （括号里面的正则匹配到的字符）


// 第二个栗子
let template = '(xxx) xxx-xxxx'
template.replace(/x/g, (m, p) => {
  console.log(m, p)
})
// x 1
// x 2
// ...
// x 10
// x 11
// x 12

/**
 * 正则表达式里面 有没有括号是不一样的。
 * 带有 括号（） 第二个参数就是 括号里面匹配到的字符
 */
template.replace(/(x)/g, (m, p) => {
  console.log(m, p)
  return '#'
})
// x x
// x x

/**
 * 总结一下：
 * 需要好好理解 三个参数
 * 1、匹配到的字符
 * 2、匹配到的字符的索引位置  （第二个例子就是输出了 索引）
 * 3、被匹配的字符串  （第一个栗子就是输出了 匹配到的字符串）
 */

let arr = [1,2,3,4,5,6,7,8,9,0]
template.replace(/x/g, m => arr.shift())
// "(123) 456-7890"

