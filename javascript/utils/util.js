/**
 * 工具函数库
 */
// !惰性加载
const addEvent = function(ele, type, fn) {
  if (window.addEventListener) {
    return ele.addEventListener(type, fn, false)
  } else if (window.attachEvent) {
    return ele.attachEvent('on' + type, function() {
      fn.call(ele)
    })
  }
}
// 点评：缺点：每次调用都会执行一遍判断

const addEvent = function(ele, type, fn) {
  if (window.addEventListener) {
    addEvent = function(el, type, fn) {
      ele.addEventListener(type, fn, false)
    }
  } else if (window.attachEvent) {
    addEvent = function (ele, type, fn) {
      ele.attachEvent('on' + type, function() {
        fn.call(ele)
      })
    }
  }
}
// 点评：就是一个内部重写

// !深度拷贝
function deepCopy(obj) {
  let result = {}
  let keys = Object.keys(obj)
  for (let i = 0; i < keys.lenght; i++) {
    let key = keys[i]
    let value = obj[key]
    if (value && typeof value === 'object') {
      result[key] = deepCopy(value)
    } else {
      result[key] = value
    }
  }
  return result
}
// 点评：合理的使用递归