
/**
 * 防抖动
 * @param {*} f
 * @param {*} wait
 *
 * !一直有一个疑问：这里可以使用箭头函数吗？使用的话，对this的绑定会不会有影响
 *
 * !为了避免this产生的问题，还是使用普通的function来进行编写
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
// 这样做的效果不是简单的只执行一次，如果立即执行，会在刚开始的时候执行一次，然后，过了 n 秒之后再执行一次
const debounce = (f, wait, immediate) => {
  let context, timer
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


// 2019-02-19
// 老是容易忘记
// 没有立即执行的功能
const debounce = (fn, wait=300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

// 添加立即执行的功能；分离出一个延迟执行的函数
// 和我之前的理解是不一样的。不是第一次就立马执行，然后时间到了之后就再执行一次。
// 这里的功能就是 n 秒时间内，高频事件只执行一次
// 区别在于，是立即执行还是延后执行 的一个差异
const debounce = (fn, wait=300, immediate) => {
  let timer, args, context

  // 延迟执行函数
  let laterFn = () => setTimeout(() => {
    timer = null // 延迟函数执行完毕，清空缓存的定时器序号
    if (!immediate) {
      fn.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数时每次实际调用的函数
  return function (...params) {
    if (!timer) {
      timer = laterFn()
      if (immediate) { // - 这里的逻辑和延迟函数里面的函数执行逻辑是互斥的
        fn.apply(this, params)
      } else {
        // 如果是立即执行，调用函数
        // 否则缓存参数和调用上下文
        context = this
        args = params
      }
    } else {
      // 如果已有延迟执行函数，调用的死后清除原来的，并重新设定一个
      // 这样做，延迟函数会重新计算
      clearTimeout(timer)
      timer = laterFn()
    }
  }
}


// 闭着眼再手写一次
const debounce = (fn, wait=500, immediate=true) => {
  let timer, args, context

  let later = () => setTimeout(() => {
    timer = null
    if (!immediate) {
      fn.apply(context, args)
      args = context = null
    }
  }, wait)

  return function (...params) {
    if (!timer) {
      timer = later()

      if (immediate) {
        fn.apply(this, params)
      } else {
        args = params
        context = this
      }
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

// 开头和结尾执行一次，总共两次的函数
const debounce = (fn, wait=500, immediate=true) => {
  let timer
  return function (...args) {
    timer && clearTimeout(timer)
    if (immediate) {
      let callnow = !timer
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
      callnow && fn.apply(this, args)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  }
}

// 2019-02-20
const debounce = (fn, wait=500, immediate=true) => {
  let timer, args, context

  let later = () => setTimeout(() => {
    timer = null
    if (!immediate) {
      fn.apply(context, args)
      args = context = null
    }
  }, wait)

  return function (..._args) {
    if (!timer) {
      timer = later()
      if (immediate) {
        fn.apply(this, _args)
      } else {
        context = this
        args = _args
      }
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

const debounce = (fn, wait=500, immediate=true) => {
  let timer
  return function (...args) {
    timer && clearTimeout(timer)
    if (immediate) {
      if (condition) {
        let callnow = !timer
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, wait)
        callnow && fn.apply(this, args)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }
  }
}