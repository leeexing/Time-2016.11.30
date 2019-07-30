/**
 * !Vue 源码学习
 */

function observe(value, cb) {
  Object.keys(value).forEach(key => defineReactive(value, key, value[key], cb))
}

function defineReactive(obj, key, val, cb) {
  console.log(obj)
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 依赖收集等。。。
      return val
    },
    set(newVal) {
      val = newVal
      cb() // 订阅者收到消息的回调
    }
  })
}


class Vue {
  constructor(options) {
    this._data = options.data
    observe(this._data, options.render)
  }
}

let vm = new Vue({
  data: {
    name: 'leeing',
    like: 'basketball'
  },
  render() {
    console.log('render')
    console.log(vm._data)
  }
})

vm._data.name = 'seeking'
console.log(vm._data.name)


// 代理：在构造函数中执行一个代理，这样就可以把data上面的属性代理到 vm 实例上
// 作用：访问的时候，直接使用 `vm.name` 代替 `vm._data.name`
_proxy.call(this, options.data) // 构造函数中

function _proxy(data) {
  const that = this
  Object.keys(data).forEach(key => {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return that._data[key]
      },
      set: function proxySetter(newVal) {
        that._data[key] = newVal
      }
    })
  })
}


// TIP: 上面的 observe 没有实现对`data`的属性进行一个深层遍历赋值 set。需要这样操作

class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)
  }
  walk(value) {
    Object.keys(value).forEach(key => this.convert(key, value[key]))
  }
  conver(key, val) {
    defineReactive(this.value, key, val)
  }
}

function defineReactive(obj, key, val) {
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newVal) {
      childOb = observe(newVal)
    }
  })
}

function observe(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}

// ----------------- 分割线 --------------------------------

// ^ 知识补充

/**
 * @obj 需要 `添加` 或 `修改` 属性的对象，可以是任意的js对象
 * @prop 属性的名称，可以是新添加的属性名，也可以是需要修改的属性名
 * @descriptor 属性描述符
 * 属性描述符有两种形式：数据描述符和访问描述符
*/
Object.defineProperty(obj, prop, descriptor)

Object.defineProperty(obj, 'a', {
  value: 34,
  writable: true,
  enumerable: true,
  configurable: true
})

let value = 34

Object.defineProperty(obj, 'b', {
  get() {
    return val
  },
  set(newVal) {
    val = newVal
  },
  enumerable: true,
  configurable: true
})


/**
 * 方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
 * @obj 需要查找的目标对象
 * @prop：目标对象内属性名称
 * @return 如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回 undefined
*/
Object.getOwnPropertyDescriptor(obj, prop)
