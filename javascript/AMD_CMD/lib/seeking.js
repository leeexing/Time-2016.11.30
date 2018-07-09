/**
 * 定义CMD的模块 math.js
 */
define(function(require, exports, module){
  const $ = require('./jquery.min.js')
  console.log($)
  const F = require('./foo')
  console.log(F)
  const min = function(x, y) {
    return x - y
  }
  const find = function(className) {
    // return $(className)
    // console.log($)
  }
  // exports.min = min // 这样处理后，得到的是一个对象 {min: f}
  // module.exports = min // 这样处理后，得到的就是一个函数 f
  module.exports = {
    min,
    find
  }
})