/**
 * main.js 入口文件/主模块
 * 首先通过config（）指定🔺各模块🔻路径和 `引用名`
 */
require.config({
  baseUrl: './lib',
  paths: {
    jquery: 'jquery.min',
    M: 'math'
  }
})

require(['math'], function(math) {
  console.log(math)
  console.log(math.add(12,45))
})

require(['test'], function(test) {
  console.log(test)
  console.log(test.find('.main'))
  console.log(test.add2(5))
})