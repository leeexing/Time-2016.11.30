/**
 * String.prototype.match
 */

 // 重点说明的式。如果match函数加了／g标志位，返回的数组里只包含整段字符串的匹配。

'./actions.js'.match(/\.\/(\w*)\.js$/)
// ["./actions.js", "actions", index: 0, input: "./actions.js", groups: undefined]

'./actions.js'.match(/\.\/(\w*)\.js$/g)
// ["./actions.js"]

// 解决办法就是使用 exec
/\.\/(\w*)\.js$/g.exec('./actions.js')
//["./actions.js", "actions", index: 0, input: "./actions.js", groups: undefined]
