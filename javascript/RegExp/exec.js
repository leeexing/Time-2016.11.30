/**
 * RegExp.prototype.exec(str)
 * 这一个API 一直没有完全掌握，一直处于半知半解的状态
 * 一般情况下都不会使用这个API
 * 
 * reg 没有g 全局匹配的时候，功能和match一样，返回的结果只有一个数组
 * 
 * 当由g的时候，会动态变化(只要匹配内容不返回null) RegExp.lastIndex 
 * 
 */
let str = "The best things in life are free"
let reg = /e/
let reg_g = /e/g

// 1、很重要的一点，使用 exec 的时候，最好将正则匹配表达式赋值给一个变量
// 通过这个变量去执行 exec，否则都是一个全新的 exec 匹配，lastIndex 都是第一次匹配的结果值

reg.exec(str)
// ["e", index: 2, input: "The best things in life are free", groups: undefined]

reg_g.exec(str)
// ["e", index: 2, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// ["e", index: 5, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// ["e", index: 22, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// ["e", index: 26, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// ["e", index: 30, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// ["e", index: 31, input: "The best things in life are free", groups: undefined]
reg_g.exec(str)
// null

// 2、如果都是使用 /e/g.exec(str) 去执行正则，返回的结果永远是一样

/e/g.exec(str)
// ["e", index: 2, input: "The best things in life are free", groups: undefined]
/e/g.exec(str)
// ["e", index: 2, input: "The best things in life are free", groups: undefined]

// 所以简单的遍历应该是这样的
let ret
while((ret = reg_g.exec(str)) !== null) {
  console.log(ret)
  console.log(reg_g.lastIndex)
}