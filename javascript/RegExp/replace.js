/**
 * 这里想要重点讲的是 replace 里面的 第二个参数的使用
 */
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