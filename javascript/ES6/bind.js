/** 
 * bind模仿
 * 这里的 bindContext 和 this 是不一样的
*/
Function.prototype.bind = Function.prototype.bind || function bind(bindContext, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError(this, 'must be a function')
  }
  let self = this
  let bound = function(...restArgs) {
    if (this instanceof bound) {
      if (self.prototype) {
        let Fn = function(){}
        Fn.prototype = self.prototype
        bound.prototype = new Fn()
      }      
      let ret = self.apply(this, [...args, ...restArgs])
      let isObject = typeof ret === 'object' && ret !== null
      let isFunction = typeof ret === 'function'
      if (isObject || isFunction) {
        return ret
      }
      return this
    } else {
      return self.apply(bindContext, [...args, restArgs]) // 最简单的版本，不考虑 new
    }
  }
  return bound
}

/** 
 * 另外一种写法
 * 简洁一些
*/
Function.prototype.Bind = function(context, ...args) {
  let self = this
  function F (){}
  function bound (...restArgs) {
    return self.apply(
      this instanceof F ? this : context,
      [...args, ...restArgs]
    )
  }
  F.prototype = self.prototype
  bound.prototype = new F()
  return bound
}