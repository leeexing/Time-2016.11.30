/**
 * 定义一个依赖jquery的模块
 */
define(['jquery', 'M'], function($, M) {
  const find = function(className) {
    return $(className)
  }
  const add2 = function(num) {
    return M.add(num, 2)
  }
  return {
    find,
    add2
  }
})