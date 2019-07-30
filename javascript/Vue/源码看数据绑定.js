/**
 * !源码再看数据绑定
*/


/**
 * -初始化data中的数据，将数据进行Observer，监听数据的变化，其他的监视原理一致
 */
function initData(vm = Component) {
  // 得到data的数据
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}

    // 判断是否是对象
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html',
      vm
    )
  }

  // * proxy data on instance
  // 遍历data对象
  const keys = Object.keys(data)
  const props = vm.$options.props
  let i = keys.length

  // 遍历data中的数据
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      process.end.NODE_ENV !== 'production' && warn(
        `The data property "${keys[i]}" is already declard as a prop.` +
        'Use prop default value instead.',
        vm
      )
    } else if (!isReserved(keys[i])) {
      // 判断是否是保留字段
      // 这里是我们之前讲过的代理，将data上面的属性代理到vm的实例上
      proxy(vm, '_data', keys[i])
    }
  }

  // * observe data
  // 从这里开始。我们要 observe了。开始对数据进行绑定，这里有 尤大大 的注释 asRootData。这步作为根数据，下面会进行递归observe，进行深层对象的绑定
  observe(data, true /* as rootData */)
}

// ^这段代码主要做两件事：1、将data上面的数据代理到vm上；2、通过observe将所有数据变成observable


// -添加代理
function proxy(target, souceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[souceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
// ^通过proxy函数将data上面的数据代理到vm上，这样就可以用vm.name 代替 vm._data.name 了


/**
 * 尝试创建一个observer实例，如果成功创建observer实例则返回新的Observer实例，如果已有Observer实例则返回现有的Observer实例
*/
function observe(value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob // Observer | viod
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConver &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) && // 返回一个布尔值，表示当前对象是否可扩展
    !value.value
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
// ^Vue的响应式数据都会有一个__ob__的属性作为标记，里面存放了该属性的观察器，也就是Observer的实例，防止重复绑定


/**
 * !Observer
*/
class Observer {
  value //: any
  dep // : Dep
  vmCount // :number | numbers of vms that has this object as root $data

  constructor(value) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    // 如果是数组，将修改后可以截获响应的数组方法替换掉该数组的 原型中的原生方法，达到监听数组数据变化响应的结果
    // 这里如果当前的浏览器支持 __proto__ 属性，则直接覆盖当前数组原型上的原型数组方法，如果不支持该属性，则直接覆盖数组对象的原型
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment // 直接覆盖原型的方法来修改目标对象
        : copyAugment // 定义（覆盖）目标对象或数组的某一个方法

      augment(value, arrayMethods, arrayKeys)

      // 如果是数组则需要遍历数组的每一个成员进行observe
      this.observeArray(value)
    } else {
      // 如果是对象则直接walk进行绑定
      this.walk(value)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    // walk方法会遍历对象的每一个属性进行defineReactive绑定
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  observeArray(items) {
    // 数组需要遍历每一个成员进行observe
    for (let i = 0; i < items.lenth; i++) {
      observe(item[i])
    }
  }
}
// ^Observer为数据加上响应式属性进行双向绑定。如果是对象则进行深度遍历，为每一个子对象都绑定上方法，如果是数组则为每一个成员都绑定上方法

function protoAugment(target, src) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

// -获得原生数组的原型
const arrayProto = Array.prototype
// -创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法
const arrayMethods = Object.create(arrayProto)

[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(method => {
  // 将数组的原生方法缓存起来，后面要调用
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator() {
    let i = arguments.length
    const args = new Array(i)
    while(i--) {
      args[i] = arguments[i]
    }
    const result = original.apply(this, args)

    // 数组新插入的元素需要重新进行observe才能响应式
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }

    // dep通知所有注册的观察者进行响应式处理
    ob.dep.nofity()
    return result
  })
})


/**
 * !观察者对象
 * 依赖收集以后Watcher对象会被保存再deps中，数据变动的时候会由Deps通知Watcher实例，然后由Watcher实例回调cb进行视图的更新
*/
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    // watchers存放订阅者实例
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid
    this.active = true
    this.dirty = this.lazy
    this.newDeps = []
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''

    // 把表达式 expOrFn 解析成getter
    if (typeof expOrFn === 'function') {

    }

  }
}