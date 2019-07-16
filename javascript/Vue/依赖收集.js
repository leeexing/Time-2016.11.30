/**
 * !依赖收集
 */

class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub = Watcher) {
    this.subs.push(sub)
  }
  removeSub() {
    remove(this.subs, sub)
  }
  notify() {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * 订阅者
 * 当依赖收集的时候会addSub到sub中，在修改data中数据的时候，会触发dep对象的notify，通知所有Watcher对象去修改对应的视图
 */
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.cb = cb
    this.vm = vm

    // 在这里将观察者本身赋值给全局的 target，只有被 target 标记过的才会进行依赖收集
    Dep.target = this

    // 出发渲染操作进行依赖收集
    this.cb.call(this.vm)
  }
  update() {
    this.cb.call(this.vm)
  }
}

// 开始依赖收集
class Vue {
  constructor(options) {
    this._data = options.data
    observe(this._data, options.render)
    let watcher = new Watcher(this, ) // 只要new 过 Watcher， Dep.target就不是null
  }
}

function observe(value, cb) {
  Object.keys(value).forEach(key => defineReactive(value, key, value[key], cb))
}

function defineReactive(obj, key, val, cb) {
  // 在闭包内存储一个Dep对象
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        // Watcher对象存在全局的 Dep.target 中
        dep.addSub(Dep.target)
      }
    },
    set(newVal) {
      // 只有之前addSub中的函数才会触发
      dep.notify()
    }
  })
}

Dep.target = null

// 将观察者Watcher实例赋值给全局的Dep.target,然后出发render操作只有被Dep.target标记过的才会进行依赖收集
// 有Dep.target的对象会将Watcher的实例push到subs中，在对象被修改出发setter操作的时候，dep会调用subs中的Watcher实例的update方法进行渲染