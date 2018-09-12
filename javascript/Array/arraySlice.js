/**
 * 重点理解 Array.prototype.slice(obj, 0)
 */

 // ?一直不理解的是，这个方法怎么就可以处理 Array-like 呢？
 const arr = []
 
const obj ={a: [{name: 'leeing'}], age:12, length: 2}
arr.slice.call(obj, 0) // [empty × 2]

const objLike = {0: 'ling', 1: [12,45,78], 2: {name: 'jaxk'}, length: 3}
arr.slice.call(objLike, 0, 2) // ["ling", Array(3)]

// ! 要想弄懂这里面的深层原理，还是得看人家的源码是怎么实现的
// ! 在MDN上面看到一个 proxy 的实现。照抄下来以供学习之用

(function() {
  const _slice = Array.prototype.slice
  try {
    _slice.call(document.documentElement)
  } catch (e) {
    Array.prototype.slice = function(begin, end) { // -这里可不能使用箭头函数。【箭头函数可不是万能的】
      end = (typeof end !== 'undefined') ? end : this.length

      if (Object.prototype.toString.call(this) === '[object Array]') {
        return _slice.call(this, begin, end)
      }

      let i = 0, cloned = [],
        size, len = this.length

      let start = begin || 0
      start = start >= 0 ? start : Math.max(0, len + start) // 处理begin为负值的情况

      let upTo = (typeof end === 'number') ? Math.min(end, len) : len // 处理end为负值的情况
      if (upTo < 0) {
        upTo = len + end
      }

      size = upTo - start // * 实际需要的截断数量

      if (size > 0) {
        cloned = new Array(size)
        if (this.charAt) {
          for (; i < size; i++) {
            cloned[i] = this.charAt(start + i) // 宿主对象是字符串
          }
        } else {
          for (; i < size; i++) {
            cloned[i] = this[start + i] // 宿主对象是类数组对象
          }
        }
      }

      return cloned
    }
  }
})()
// 点评：第一个为什么返回返回两个空值的数组就可以理解了
