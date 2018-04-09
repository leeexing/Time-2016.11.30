/**
 * 数据双向绑定就是通过 Object.defineProperty实现的
 * 
 * 简单表述就是 数据劫持 + 发布订阅
 */
function Mvvm(options={}) {
  this.$options = options
  let data = this._data = this.$options.data

  // 数据劫持
  observe(data)
}


/**
 * 数据劫持的作用：
 * 观察对象，给对象增加 Object.defineProperty
 * 深度响应。每次赋予一个新对象时会给这个对象增加 defineProperty(数据劫持)
 * 
 * 🎨所谓的数据劫持，就是给对象增加 get 和 set
 * 
 * @param {any} data 
 */
function Observe(data) {
  for (let key in data) {
    let val = data[key] // ⏰，这里还必须是 let 形成一个独立的作用域，使用var的话会将前面的值覆盖掉
    observe(val) // 递归。继续向下找，实现深度的数据劫持
    Object.defineProperty(data, key, {
      configurable: true,
      get () {
        return val
      },
      set (newVal) {
        if (newVal == val) {
          return
        }
        val = newVal
        observe(newVal) // 🔔当设置新值的时候，也需要吧新值再去定义成响应式
      }
    })
  }
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  return new Observe(data)
}

/**
 * 数据代理的作用：
 * 
 * 每次去拿data里面的数据的时候，不用再带上 _data。可以直接通过 this.a 这样进行获取
 * 
 * @param {any} [options={}] 
 * @returns 
 */
function Mvvm2(options={}) {
  // 数据劫持
  observe(data)
  // 这里，this 代理了 this._data
  for (let key in data) {
    Object.defineProperty(this, key, {
      configurable: true,
      get () {
        return this._data[key]
      },
      set (newVal) {
        this._data[key] = newVal
      }
    })
  }

  // 编译
  new Compile(options.el, this) // 🎃注意这里的 options.el。就是根元素 #app
}


/**
 * 数据编译
 * 
 * @param {any} el 
 * @param {any} vm 
 */
function Compile(el, vm) {
  // 将el挂载到实例上方便调用
  vm.$el = document.querySelector(el)
  let fragment = document.createDocumentFragment()
  // 将el 里面的内容全部拿到
  while(child = vm.$el.firstChild) {
    fragment.appendChild(child) // 此时将el中的内容放入内存中
  }

  function replace(frag) {
    Array.from(frag.childNodes).forEach(node => {
      let txt = node.textContent
      let reg = /\{\{(.*?)\}\}/g

      if (node.nodeType === 3 && reg.test(txt)) {
        console.log(RegExp.$1)
        let arr = RegExp.$1.split('.')
        let val = vm
        arr.forEach(key => {
          val = val[key]  // eg: this.a.b;  // 🎃注意啊，这里的 val 时跟着循环遍历而变化的
        })

        node.textContent = txt.replace(reg, val).trim()
      }

      // 如果还有子节点，继续递归 replace
      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }

  replace(fragment) // 替换内容

  vm.$el.appendChild(fragment) // 再将文档碎片放入 el 中
}

// 修复不能匹配两个相邻的{{}}正则匹配
function Compile(el, vm) {
  // ...
  function replace(frag) {
    if (node.nodeType === 3 && reg.test(txt)) {
      function replaceTxt() {
        node.textContent = txt.replace(reg, (matched, placeHolder) => {
          console.log(placeHolder)  // 匹配到的分组 eg：song， album.name， singer 。。。
          new Watcher(vm, placeHolder, replaceTxt)  // 监听变化，进行匹配替换内容

          return placeHolder.split('.').reduce((val, key) => {
            return val[key] // 👍这一步太厉害了
          }, vm)
          
        })
      }
      // 替换
      replaceTxt()
    }
  }
  //...
}


/**
 * 发布订阅
 * 
 * 发布订阅主要靠的就是 数组关系；订阅就是放入函数，发布就是让数组里的函数执行
 * 
 */
function Dep() {
  // 存放函数的 🚗`事件池`
  this.subs = []
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub)
  },
  notify() {
    // 绑定的方法中，都（必须）有一个 update 的方法
    this.subs.forEach(sub => sub.update())
  }
}

function Watcher(fn) {
  this.fn = fn
}
Watcher.prototype.update = function() {
  this.fn()
}


/**
 * 数据更新视图
 * 
 * 订阅一个事件，当数据改变需要重新刷新视图，需要在replace 替换的逻辑里面处理
 * 
 * 通过 new Watcher 把数据订阅一下，数据一变就执行改变内容的操作
 * 
 * @param {any} frag 
 */
function replace(frag) {
  // 省略...
  // 替换的逻辑
  node.textContent = txt.replace(reg, val).trim();
  // 监听变化
  // 给Watcher再添加两个参数，用来取新的值(newVal)给回调函数传参
  new Watcher(vm, RegExp.$1, newVal => {
    node.textContent = txt.replace(reg, newVal).trim();    
  });
}

function Watcher(vm, exp, fn) {
  this.fn = fn
  this.vm = vm
  this.exp = exp
  Dep.target = this
  let arr = exp.split('.')
  let val = vm
  arr.forEach(key => {
    val = val[key]
  })
  Dep.target = null
}

function Observe(data) {
  let dep = new Dep() // +
  // ...
  Object.defineProperty(data, key, {
    get() {
      Dep.target && dep.addSub(Dep.target) // 将 watcher 添加到订阅事件中 [watcher]
      return val
    },
    set (newVal) {
      if (newVal === val) {
        return
      }
      val = newVal
      observe(newVal)
      dep.notify() // 让所有的watcher的update方法执行即可
    }
  })
}

Watcher.prototype.update = function() {
  let arr = this.exp.split('.')
  let val = this.vm
  arr.forEach(key => {
    val = val[key]
  })
  this.fn(val)
}

function replace(frag) {
  // ...
  if (node.nodeType === 1) {
    let nodeAttr = node.attributes
    Array.from(nodeAttr).forEach(attr => {
      let name = attr.name // v-model  type
      let exp = attr.value // c        text
      if (name.includes('v-')) {
        node.value = vm[exp]  // this.c
      }
      // 监听变化
      new Watcher(vm, exp, newVal => {
        node.value = newVal
      })

      node.addEventListener('input', e => {
        let newVal = e.target.value
        vm[exp] = newVal
      })
    })
  }
  if (node.childNodes && node.childNodes.length) {
    replace(node)
  }
}


/**
 * computed(计算属性)
 * 
 */
function initComputed(){
  let vm = this
  let computed = this.$options.computed
  Object.keys(computed).forEach(key => {
    Object.defineProperty(vm, key, {
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
      set() {}
    })
  })
}