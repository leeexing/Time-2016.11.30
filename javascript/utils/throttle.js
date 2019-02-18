/**
 * 防抖动函数
 *
 * 节流函数
 */
// !节流 -- 时间戳
const throttle = function(f, wait) {
  let context, previous = 0
  return function(...args) {
    let now = +Date.now()
    context = this
    if (now - previous > wait) {
      f.apply(context, args)
      previous = now
    }
  }
}

// !节流 -- 定时器
const throttle = function (f, wait) {
  let context, timer
  return function(...args) {
    context = this
    if (!timer) {
      timer = setTimeout(() => {
        f.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

// !节流 -- 结合 -- 有头有尾 -- 可配置（是否立即执行,最后执行一次。两个不能同时设置为false）
// ?这里是否可以使用 箭头函数。不知道这里的this会不会有差别
const throttle = (f, wait, options) => {
  let context, timer, args, result
  let previous = 0
  if (!options) {
    options = {}
  }
  const later = () => {
    previous = +Date.now()
    timer = null
    result = f.apply(context, args)
    if (!timer) context = args  = null
  }
  const throttled = (...arg) => {
    context = this
    args = arg
    let now = +Date.now()
    if (!previous && options.isImmediate === false) { // 不是立即执行。将初始时间设为当前时间
      previous = now
    }
    let remaining = wait - (now - previous)
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      console.log(context)
      previous = now
      result = f.apply(context, args)
      if (!timer) context = args  = null // ?不是很理解这里的用意
    } else if (!timer && options.needTailCall !== false) {
      timer = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = () => {
    clearTimeout(timer)
    previous = 0
    context = args = timer = mull
  }

  return throttled
}

// 为了不忘记，只能多练习

// 2019-02-20
const throttle = (fn, wait=500) => {
  let timer
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
}

const throttle = (fn, wait, options={}) => {
  let timer, args, context,result
  let previous = 0

  let later = () => {
    previous = options.leading === false ? 0 : Date.now()
    timer = null
    result = fn.apply(context, args)
    if (!timer) {
      args = context = null
    }
  }

  return function (...params) {
    let now = Date.now()
    if (!previous && options.leading === false) {
      previous = now
    }
    let remaining = wait - (now - previous)
    context = this
    args = params
    if (remaining < 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = now
      result = fn.apply(this, args)
      if (!timer) args = context = null
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(later, remaining)
    }
    return result
  }
}