/**
 * 深拷贝
*/

// 浅拷贝
Array.concat()
Array.slice()
Object.assign()

const clone = function(obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};

// 深拷贝

JSON.parse && JSON.stringify

// JSON.parse()和JSON.stringify()是完全的深拷贝。
// 问题是 1. 函数不能拷贝； 2. 数据为null的不识别

function deepClone(obj) {
  if (!obj && typeof obj !== 'object') {
    return obj
  }
  let targetObj = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) { // 只复制对象的自有属性
      if (obj[key] && typeof obj[key] === 'object') {
        targetObj[key] = deepClone(obj[key])
      } else {
        targetObj[key] = obj[key]
      }
    }
  }
  return targetObj
}