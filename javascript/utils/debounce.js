
/**
 * 防抖动
 * @param {*} f 
 * @param {*} wait 
 * 
 * !一直有一个疑问：这里可以使用箭头函数吗？使用的话，对this的绑定会不会有影响
 */
// ! 第一版
const _debounce = (f, wait) => {
  let context, timer
  return function (...args) {
    context = this
    clearTimeout(timer)
    timer = setTimeout(() => {
      f.apply(context, args)
    }, wait)
  }
}

// !第二版
const debounce = (f, wait, immediate) => {
  let timer
  return function (...args) {
    context = this
    timer && clearTimeout(timer)
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        f.apply(context, args)
      }, wait)
      callNow && f.apply(context, args)
    } else {
      timer = setTimeout(() => {
        f.apply(context, args)
      }, wait)
    }
  }
}