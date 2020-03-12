# 插件的学习

> 好好整理一下

## 规范

### 命名规范

REFER: https://cn.vuejs.org/v2/style-guide/index.html#

1 只应该拥有单个活跃实例的组件应该以 The 前缀命名，以示其唯一性。

```js
// bad
components/
|- Heading.vue
|- MySidebar.vue

// good
components/
|- TheHeading.vue
|- TheSidebar.vue
```

2 和父组件紧密耦合的子组件应该以父组件名作为前缀命名。

```js
// bad
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue

// good
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

3 组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。

```js
// bad
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue

// good
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

### 优先级

> 组件中各个属性书写的先后顺序。强烈推荐

#### 组件/实例的选项的顺序

```js
副作用 (触发组件外的影响)
  el

全局感知 (要求组件以外的知识)
  name
  parent

组件类型 (更改组件的类型)
  functional

模板修改器 (改变模板的编译方式)
  delimiters
  comments

模板依赖 (模板内使用的资源)
  components
  directives
  filters

组合 (向选项里合并属性)
  extends
  mixins

接口 (组件的接口)
  inheritAttrs
  model
  props/propsData

本地状态 (本地的响应式属性)
  data
  computed

事件 (通过响应式事件触发的回调)

  watch
  生命周期钩子 (按照它们被调用的顺序)
    beforeCreate
    created
    beforeMount
    mounted
    beforeUpdate
    updated
    activated
    deactivated
    beforeDestroy
    destroyed
非响应式的属性 (不依赖响应系统的实例属性)
  methods

渲染 (组件输出的声明式描述)
  template/render
  renderError

```

#### 元素特性的顺序

```js
定义 (提供组件的选项)
  is

列表渲染 (创建多个变化的相同元素)
  v-for

条件渲染 (元素是否渲染/显示)
  v-if
  v-else-if
  v-else
  v-show
  v-cloak

渲染方式 (改变元素的渲染方式)
  v-pre
  v-once

全局感知 (需要超越组件的知识)
  id

唯一的特性 (需要唯一值的特性)
  ref
  key
  slot

双向绑定 (把绑定和事件结合起来)
  v-model

其它特性 (所有普通的绑定或未绑定的特性)

事件 (组件事件监听器)
  v-on

内容 (覆写元素的内容)
  v-html
  v-text

```

#### 隐性的父子组件通信

**应该优先通过 prop 和事件进行父子组件之间的通信，而不是 this.$parent 或改变 prop。**
一个理想的 Vue 应用是 prop 向下传递，事件向上传递的。遵循这一约定会让你的组件更易于理解。然而，在一些边界情况下 prop 的变更或 this.$parent 能够简化两个深度耦合的组件。

#### 为组件样式设置作用域

**对于应用来说，顶级 `App` 组件和布局组件中的样式可以是全局的，但是其它所有组件都应该是有作用域的。**
这条规则只和单文件组件有关。你不一定要使用 `scoped` 特性。设置作用域也可以通过 `CSS Modules`，那是一个基于 `class` 的类似 `BEM` 的策略，当然你也可以使用其它的库或约定。

不管怎样，对于组件库，我们应该更倾向于选用基于 `class` 的策略而不是 `scoped` 特性。

## vue

### $mount

vm.$mount([elementOrSelector])

参数：
{Element | string} [elementOrSelector]
{boolean} [hydrating]

返回值：
vm - 实例本身

1、如果 Vue 实例在实例化时没有收到 `el` 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 `vm.$mount()` 手动地挂载一个未挂载的实例。

2、如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中。

3、这个方法返回实例自身，因而可以链式调用其它实例方法。

```js
var MyComponent = Vue.extend({
  template: '<div>Hello!</div>'
})

// 创建并挂载到 #app (会替换 #app)
new MyComponent().$mount('#app')

// 同上
new MyComponent({ el: '#app' })

// 或者，在文档之外渲染并且随后挂载
var component = new MyComponent().$mount()
document.getElementById('app').appendChild(component.$el)
```

```js 源码实现
Vue.extend = function (extendOptions = {}) {
  const Super = this  // Vue基类构造函数
  const name = extendOptions.name || Super.options.name

  const Sub = function (options) {  // 定义构造函数
    this._init(options)  // _init继承而来
  }

  Sub.prototype = Object.create(Super.prototype)  // 继承基类Vue初始化定义的原型方法
  Sub.prototype.constructor = Sub  // 构造函数指向子类
  Sub.options = mergeOptions( // 子类合并options
    Super.options,  // components, directives, filters, _base
    extendOptions  // 传入的组件对象
  )
  Sub['super'] = Super // Vue基类

  // 将基类的静态方法赋值给子类
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  ASSET_TYPES.forEach(function (type) { // ['component', 'directive', 'filter']
    Sub[type] = Super[type]
  })

  if (name) {  让组件可以递归调用自己，所以一定要定义name属性
    Sub.options.components[name] = Sub  // 将子类挂载到自己的components属性下
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions

  return Sub  // 返回子组件的构造函数
}
```

### vue-extend 插件编写

```js
vue.extend(options)

import Message from './Message.vue'

Vue.extend(Message)

// or

Vue.extend({
  template: '<div id="message"></div>',
  data: () {
    return {
      name: 'messageComponent'
    }
  }
})
```

使用基础 Vue 构造器，创建一个 子类 。蚕食是一个包含组件选项的对象。可以是一个 .vue 的组件
data 选项是特例。需要注意 在 Vue.exten（） 中它必须是函数

创建一个组件实例，并且挂载到一个元素上
`new Profile().$mount('#mount-root')`

### redirect 刷新页面

> 一种新的实现方案

```js
// 先注册一个名为 `redirect` 的路由
<script>
export default {
  beforeCreate() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
```

```js
// 手动重定向页面到 '/redirect' 页面
const { fullPath } = this.$route
this.$router.replace({
  path: '/redirect' + fullPath
})
```

当遇到你需要刷新页面的情况，你就手动重定向页面到redirect页面，它会将页面重新redirect重定向回来，由于页面的 key 发生了变化，从而间接实现了刷新页面组件的效果。

### 全局事件

详情页绑定了一个全局事件，当我在详情页面中滚动，这个样写没有问题，但是当我去到其他页面，在滚动时，你就会发现，刚刚你绑定在详情页中的滚动事件，在这个页面也被执行了，这肯定是有问题的。
其实在我们使用了keep-alive标签后，会有两个生命周期函数分别是：activated、deactivated
> activated：页面展示的时候被执行
> deactivated：页面被隐藏或者页面即将被替换成新的页面时被执行

```js
activated () {
    window.addEventListener('scroll', this.handleScroll)
},
deactivated () {
    window.removeEventListener('scroll', this.handleScroll)
}

```

### 递归组件

// REFER: [组件递归实现多级菜单](https://juejin.im/post/58c0e882da2f60186d6d4818)

> 递归组件就是在我组件的自身去调用组件的自身
在写组件的时候，都会写一个name的属性，它其中一个用途就是——递归组件

```html
// detail-list.vue
<div
    class="item"
    v-for="(item, index) of categoryList"
    :key="index"
>
    <div class="item-title">
      <span class="item-title-icon"></span>
      {{item.title}}
    </div>
    <div class="item-title-children" v-if="item.children">  //判断是否有数据中是否有 children 这个属性，如果有就使用递归组件
      <detail-list :categoryList="item.children"></detail-list>     //把 children 传给递归组件
    </div>
 </div>

 // 使用
 <template>
    <div class="list-detail">
      <detail-list :list="list"></detail-list>
    </div>
</template>
<script>
import detailList from "./components/List";
export default {
  name: 'parent',
  components: {detailList},
  data () {
    return {
      list: [...]
    }
  }
}
</script>
```

:categoryList 就是组件的 name 值

### 组件中name名字的用途

* 递归组件可以用到
* 当你相对某个页面想取消缓存的时候会用到
* 在 Vue 的开发调试工具中会用到

### 路径分配

```js
axios.get('/api/detail.json', {
    params: {
      id: this.$route.params.id
    }
}).then(this.getDetailInfoSucc)

// 这样写路径是访问不到自己mock的数据的，那应该怎么写呢？

axios.get('/static/mock/detail.json', {
    params: {
      id: this.$route.params.id
    }
}).then(this.getDetailInfoSucc)

// 把/api改成/static/mock/这样访问到我们本地的数据了，但是这样有风险的，上线前你需要改回/api，很容易出错，造成bug

module.exports = {
  dev: {
    ...
    proxyTable: {
      '/api':{
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api':'/static/mock'
        }
      }
    }
 }

// 在config/index.js文件中找到dev下的proxyTable，它可以代理路径，我们在项目中写/api，通过proxyTable可以自动找到/static/mock这个目录。
```

### 移动端可以访问

当手机上用本地的ip地址访问项目时被拒绝了，这是因为前端项目是通过`webpack-dev-server`启动的，`webpack-dev-server`默认不支持ip的形式访问页面，这就需要把它默认的配置项做一个修改

```js
"scripts": {
    "dev": "webpack-dev-server --host 0.0.0.0 --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "lint": "eslint --ext .js,.vue src",
    "build": "node build/build.js"
}

// 当每次运行npm run start或者npm run dev时，都是在运行scripts下dev指令，只需要在它上面加上--host 0.0.0.0就可以了
```

**注意**
这样的话，其他同事就可以使用我电脑的ip进行访问了

### 虚拟DOM

> 把DOM树做了一个“DOM-数据 ”映射成虚拟DOM，这个映射的效率比操作dom要高

Virtual DOM 算法。包括几个步骤

1. 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
3. 把2所记录的差异应用到步骤1所构建的真正的DOM树上，视图就更新了

第二步
树的`diff`，同层对比，输出patchs(listDiff/diffChildren/diffProps)

  没有新的节点，返回

  新的节点tagName与key不变， 对比props，继续递归遍历子树
    对比属性(对比新旧属性列表):
      旧属性是否存在与新属性列表中
      都存在的是否有变化
      是否出现旧列表中没有的新属性.

  tagName和key值变化了，则直接替换成新节点
第三步
渲染差异
  遍历patchs， 把需要更改的节点取出来
  局部更新dom

Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存. 既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。

Virtual DOM 算法主要是实现上面步骤的三个函数：`element，diff，patch`

```js
// 1. 构建虚拟DOM
var tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li')])
])

// 2. 通过虚拟DOM构建真正的DOM
var root = tree.render()
document.body.appendChild(root)

// 3. 生成新的虚拟DOM
var newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: red'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li'), el('li')])
])

// 4. 比较两棵虚拟DOM树的不同
var patches = diff(tree, newTree)

// 5. 在真正的DOM元素上应用变更
patch(root, patches)
```

**1** 传入一个对象的所有属性

如果想要将一个对象的所有属性都作为 prop 传入，你可以使用不带参数的 v-bind （取代 v-bind：prop-name）。例如

```js
post: {
  id: 1,
  title: 'My title'
}

<blog-post v-bind="post"></blog-post>

等价于

<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

**2** 非 prop 的特性

一个非 prop 特性是指向一个组件，但是该组件并没有相应 prop 定义的特性

**3** 禁用特性继承

**.sync 修饰符**

我们推荐以 update:myPropName 的模式触发事件对一个 prop 进行“双向绑定”

```js
this.$emit('update:title', newTitle)

<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>

// 为了方便起见

<text-document v-bind:title.sync="doc.title"></text-document>

// 注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。取而代之的是，你只能提供你想要绑定的属性名，类似 v-model
```

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用
`<text-document v-bind.sync="doc"></text-document>`
这样会把 doc 对象中的每一个属性 (如 title) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 v-on 监听器。

### 注意

将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

### computed 和 data 有什么不同呢

**相同点**
Vue 会递归的将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化。
computed是响应式的

当你有一些数据需要随着其它数据变动而变动时，通常更好的做法是使用计算属性而不是命令式的 watch 回调。但是，我发觉，这个源数据只是指data中定义的数据，或者vuex中定义的state数据.。并不针对普通数据。

**不同点**
1.data属性的值，不会随赋值变量的改动而改动。如果要改变这个属性的值，则需要直接给data属性赋值，视图上对这个属性的显示才会变。

2.computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。改变这个赋值变量，computed属性值会随之改变。

3.计算属性是基于它们的依赖进行缓存的。只在相关依赖发生改变时它们才会重新求值。
    methods储存方法，，computed储存需要处理的数据值；methods每次都会调用，computed有缓存机制，只有改变时才执行，性能更佳；

### computed 和 watch 有什么不同呢

更进一步，computed 和 watch 有什么不同呢？


①从属性名上，computed是计算属性，也就是依赖其它的属性计算所得出最后的值。watch是去监听一个值的变化，然后执行相对应的函数。
②从实现上，computed的值在getter执行后是会缓存的，只有在它依赖的属性值改变之后，下一次获取computed的值时才会重新调用对应的getter来计算。watch在每次监听的值变化时，都会执行回调。其实从这一点来看，都是在依赖的值变化之后，去执行回调。很多功能本来就很多属性都可以用，只不过有更适合的。<u>如果一个值依赖多个属性（多对一），用computed肯定是更加方便的。如果一个值变化后会引起一系列操作，或者一个值变化会引起一系列值的变化（一对多），用watch更加方便一些。</u>
③watch的回调里面会传入监听属性的新旧值，通过这两个值可以做一些特定的操作。computed通常就是简单的计算。
④watch和computed并没有哪个更底层，watch内部调用的是vm.$watch，它们的共同之处就是每个定义的属性都单独建立了一个Watcher对象。

### 使用

### 在vue中获取dom元素的宽高

> getBoundingClientRect

该方法返回一个矩形对象，包含四个属性：left、top、right、botton。分别表示元素各边与页面上边和左边的距离

#### sync

```vue
<comp :foo.sync="bar"></comp>

会被扩展为：

<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：
`this.$emit('update:foo', newValue)`

// TIP:  语法糖。还是需要使用 `$emit` 这个方法

#### 非表单组件上使用 v-model

```js
// main.vue
<ToggleTag v-model="isShowTabBar" @on-change="handleToggleTag"></ToggleTag>

// toggleTag
<template>
  <div @click="handleToggleTags" class="toggle-tags-btn-con">
    <Tooltip :content="value ? '关闭标签栏' : '打开标签栏'" placement="bottom">
      <Icon :type="value ? 'ios-pricetags' : 'ios-pricetags-outline'" :size="23"></Icon>
    </Tooltip>
  </div>
</template>

<script>
export default {
  name: 'ToggleTags',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleToggleTags () {
      // NOTE:  正常的逻辑是使用下面的一种方式进行函数回调触发
      this.$emit('input', !this.value)
      // this.$emit('on-change', !this.value)
    }
  }
}
</script>
```

// TIP:  这个比较厉害了，非表单组件也可以进行双向数据绑定。关键是触发回调的方式很特别 `this.$emit('input', newVal)`. 和 `this.$emit('update:xxx', newVal)` 有异曲同工之妙！👍

#### 处理加载状态

这里的异步组件工厂函数也可以返回一个如下格式的对象

```js
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

#### 依赖注入

vue中的依赖注入 provide 和 inject
provide 选项允许我们指定我们想要提供给后代组件的数据/方法。
inject 选项来接收指定的我们想要添加在这个实例上的属性

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}

inject: ['getMap']

/* 示例 */

// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

// TIP:  依赖注入所提供的属性是非响应式

相比 $parent 来说，这个用法可以让我们在任意后代组件中访问 getMap，而不需要暴露整个 <google-map> 实例。这允许我们更好的持续研发该组件，而不需要担心我们可能会改变/移除一些子组件依赖的东西。同时这些组件之间的接口是始终明确定义的，就和 props 一样。

实际上，可以把依赖注入看作一部分“大范围有效的 prop”，除了：

祖先组件不需要知道哪些后代组件使用它提供的属性
后代组件不需要知道被注入的属性来自哪里

#### 程序化的事件侦听器

已经知道了 $emit 的用法，它可以被 v-on 侦听，但是 Vue 实例同时在其事件接口中提供了其它的方法。我们可以：

通过 $on(eventName, eventHandler) 侦听一个事件
通过 $once(eventName, eventHandler) 一次性侦听一个事件
通过 $off(eventName, eventHandler) 停止侦听一个事件

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

// TIP:  这个方法用得很好

之前的方法存在两个问题：

它需要在这个组件实例中保存这个 picker，如果可以的话最好只有生命周期钩子可以访问到它。这并不算严重的问题，但是它可以被视为杂物。
我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化地清理我们建立的所有东西

// NOTE:
使用了这个策略，我甚至可以让多个输入框元素同时使用不同的 Pikaday，每个新的实例都程序化地在后期清理它自己：

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })
  }
}
```

### 强制更新

> 如果你发现你自己需要在 Vue 中做一次强制更新，99.9% 的情况，是你在某个地方做错了事。

你可能还没有留意到数组或对象的变更检测注意事项，或者你可能依赖了一个未被 Vue 的响应式系统追踪的状态。

// NOTE:  然而，如果你已经做到了上述的事项仍然发现在极少数的情况下需要手动强制更新，那么你可以通过 $forceUpdate 来做这件事。

vm.$forceUpdate()

迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件

### 注意事项

由于 JavaScript 的限制，Vue 不能检测以下变动的数组

* 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
* 当你修改数组的长度时，例如：vm.items.length = newLength

为了解决第一类问题，以下两种方式都可以实现和 vm.items[indexOfItem] = newValue 相同的效果，同时也将触发状态更新

```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

为了解决第二类问题，你可以使用 splice: `vm.items.splice(newLength)`

### 对象更改检测注意事项

对于已经创建的实例，Vue 不能动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性

有时你可能需要为已有对象赋予多个新属性，比如使用 Object.assign() 或 _.extend()。
在这种情况下，你应该用两个对象的属性创建一个新的对象。所以，如果你想添加新的响应式属性，不要像这样

```js
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})

// 应该这样做
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

### 单元素/组件的过渡

Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

* 条件渲染 (使用 v-if)
* 条件展示 (使用 v-show)
* 动态组件
* 组件根节点

显性的过渡持续时间
可以用 `<transition>` 组件上的 duration 属性定制一个显性的过渡持续时间 (以毫秒计)

```js
<transition :duration="1000">...</transition>

<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript 钩子

```js
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>

enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave: function (el, done) {
    // ...
    done()
  },
```
当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成。

推荐对于仅使用 JavaScript 过渡的元素添加 v-bind:css="false"，Vue 会跳过 CSS 的检测。这也可以避免过渡过程中 CSS 的影响。

### 过渡模式

同时生效的进入和离开的过渡不能满足所有要求，所以 Vue 提供了` 过渡模式 `

### 混入

选项合并

* 当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。
比如，数据对象在内部会进行递归合并，在和组件的数据发生冲突时以组件数据优先。

* 同名钩子函数将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。

* 值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。

**全局混入**
一旦使用全局混入对象，将会影响到 所有 之后创建的 Vue 实例。使用恰当时，可以为自定义对象注入处理逻辑。

### 自定义指令

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

<input v-focus>
```

1. 钩子函数
一个指令定义对象可以提供如下几个钩子函数 (均为可选):

* bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

* inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

* update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

* componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

* unbind：只调用一次，指令与元素解绑时调用。

2.钩子函数参数

* el：指令所绑定的元素，可以用来直接操作 DOM 。
* binding：一个对象，包含以下属性：
      name：指令名，不包括 v- 前缀。
      value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
      oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
      expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
      arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
      modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
* vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
* oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

### 选项 / 生命周期钩子 (created、activated、errorCaptured)

所有的生命周期钩子自动绑定 this 上下文到实例中，因此你可以访问数据，对属性和方法进行运算。
这意味着`你不能使用箭头函数来定义一个生命周期方法` (例如 created: () => this.fetchTodos())。这是因为箭头函数绑定了父上下文，因此 this 与你期待的 Vue 实例不同，this.fetchTodos 的行为未定义。

**activated**
keep-alive 组件激活时调用。

created()：在创建vue对象时，当html渲染之前就触发；但是注意，全局vue.js不强制刷新或者重启时只创建一次，也就是说，created()只会触发一次；

activated()：在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等

**errorCaptured**
当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播

**parent**
指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的 $children 数组中

❗节制地使用 $parent 和 $children - 它们的主要目的是作为访问组件的应急方法。更推荐用 props 和 events 实现父子组件通信

provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。

### 实例属性

vm.$data
Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象属性的访问。

vm.$el
Vue 实例使用的根 DOM 元素。

vm.$refs
一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例。

### keep-alive

REFER: https://juejin.im/post/5cce49036fb9a031eb58a8f9

```js
export default {
  name: 'keep-alive',
  abstract: true, // 判断当前组件虚拟dom是否渲染成真是dom的关键

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null) // 缓存虚拟dom
    this.keys = [] // 缓存的虚拟dom的健集合
  },

  destroyed () {
    for (const key in this.cache) { // 删除所有的缓存
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    // 实时监听黑白名单的变动
    this.$watch('inlcude', val => {
      pruneCache(this, naem => matches(val, name))
    })

    this.$watch('exlcude', val => {
      pruneCache(this, naem => !matches(val, name))
    })
  },

  render () {
    //
  }
}

function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy() // -执行组件的 destroy 钩子函数
  }
  cache[key] = null
  remove(keys, key)
}
```

### Watch immediate

> 当 watch 一个变量的时候，初始化时并不会执行，如下面的例子，你需要在created的时候手动调用一次

```js
watch: {
  searchText: {
    handler: 'fetchUserList',
    immediate: true
  }
}
```

ps: watch 还有一个容易被大家忽略的属性`deep`。当设置为`true`时，它会进行深度监听。
简而言之就是你有一个 const obj={a:1,b:2}，里面任意一个 key 的 value 发生变化的时候都会触发watch。
应用场景：比如我有一个列表，它有一堆query筛选项，这时候你就能deep watch它，只有任何一个筛序项改变的时候，就自动请求新的数据。
或者你可以deep watch一个 form 表单，当任何一个字段内容发生变化的时候，你就帮它做自动保存等等。

```js
watch: {
  obj: {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    deep: true
  }
}
```

deep的意思就是深入观察，监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改obj里面任何一个属性都会触发这个监听器里的 handler。

优化，我们可以是使用**字符串形式**监听。

```js
watch: {
  'obj.a': {
    handler(newName, oldName) {
      console.log('obj.a changed');
    },
    immediate: true,
    // deep: true
  }
}
```

**注销watch**:
为什么要注销 watch？因为我们的组件是经常要被销毁的，比如我们跳一个路由，从一个页面跳到另外一个页面，那么原来的页面的 watch 其实就没用了，这时候我们应该注销掉原来页面的 watch 的，不然的话可能会导致内置溢出。好在我们平时 watch 都是写在组件的选项中的，他会随着组件的销毁而销毁。

但是，如果我们使用下面这样的方式写 watch，那么就要手动注销了，这种注销其实也很简单

```js
const unWatch = app.$watch('text', (newVal, oldVal) => {
  console.log(`${newVal} : ${oldVal}`);
})

unWatch(); // 手动注销watch
```

### $Attrs 和 $listeners

REFER: [Vue 父子组件数据传递( inheritAttrs + $attrs + $listeners)](https://juejin.im/post/5ae4288a5188256712784787)
REFER: [vue组件间通信的六种方式](https://juejin.im/post/5cde0b43f265da03867e78d3#heading-11)

* $attrs--继承所有的父组件属性（除了prop传递的属性、class 和 style ）

* inheritAttrs--默认值true,继承所有的父组件属性（除props的特定绑定）作为普通的HTML特性应用在子组件的根元素上，
    如果你不希望组件的根元素继承特性设置  inheritAttrs: false,但是class属性会继承

* $listeners--属性，它是一个对象，里面包含了作用在这个组件上的所有监听器，你就可以配合 v-on="$listeners"
  将所有的事件监听器指向这个组件的某个特定的子元素。

**主要用途**
用在父组件传递数据给子组件或者孙组件

```js 项目中看到的代码
<template>
  <el-select ref="dragSelect" v-model="selectVal" v-bind="$attrs" class="drag-select" multiple v-on="$listeners">
    <slot />
  </el-select>
</template>
```

### provide 和 inject

REFER: [vue组件间通信的六种方法]https://juejin.im/post/5cde0b43f265da03867e78d3#heading-11

provide / inject API 主要解决了跨级组件间的通信问题，不过它的`使用场景，主要是子组件获取上级组件的状态`，跨级组件间建立了一种主动提供与依赖注入的关系。

*需要注意的是*：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的

**provide与inject 怎么实现数据响应式**
使用2.6最新API `Vue.observable` 优化响应式 provide(推荐)

```js
  // 方法二:使用2.6最新API Vue.observable 优化响应式 provide
  provide() {
    this.theme = Vue.observable({
      color: "blue"
    });
    return {
      theme: this.theme
    };
  },
  methods: {
    changeColor(color) {
      if (color) {
        this.theme.color = color;
      } else {
        this.theme.color = this.theme.color === "blue" ? "red" : "blue";
      }
    }
  }
```

### capture 和 self

> capture和self主要是函数执行顺序的问题

.capture先执行父级的函数，再执行子级的触发函数

self是只执行子级本身的函数

```js
<div v-on:click.self='alert("1")' style="width: 100%;height: 45px;background-color: black;">
  <div v-on:click="alert('2')" style='width: 80%;margin-left: 10%;background-color: white;'>
    123
  </div>
</div>

// 此时点击子级的div会执行alert(‘2’)，不会执行alert(‘1’)
```

### .sync

> 这个也是 vue 2.3 之后新加的一个语法糖。这也是平时在分装组件的时候很好用的一个语法糖，它的实现机制和v-model是一样的。


```js
<comp :foo.sync="bar" />

// 等同于

<comp :foo="bar" @update:foo="val => bar = val" />

// 更新方式
this.$emit('update:foo', newVal)
```

2.当我们用一个对象同时设置多个 prop 的时候，也可以将这个 .sync 修饰符和 v-bind 配合使用：

```js
<text-document v-bind.sync="doc"></text-document>
```

这样会把 `doc` **对象**中的每一个属性 (如 title) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 v-on 监听器。

注意：doc 必须是一个对象，不能是一个单独的基本类型

将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的

### Object.freeze

当你把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter，它们让 Vue 能进行追踪依赖，在属性被访问和修改时通知变化。
使用了 Object.freeze 之后，不仅可以减少 observer 的开销，还能减少不少内存开销。

## vue-router

### 源码解读

参考：[Vue-Router](https://juejin.im/post/5dd04cda51882510d91a7527)

### addRoutes && removeRoutes

背景：
动态添加的路由，并不能动态的删除。这就是导致一个问题，当用户权限发生变化的时候，或者说用户登出的时候，我们只能通过刷新页面的方式，才能清空我们之前注册的路由。之前老版本的 vue-element-admin就一直采用的是这种方式。虽然能用，但作为一个 spa，刷新页面其实是一种很糟糕的用户体验。

**后来发现了一种 hack 的方法，能很好的动态清除注册的路由**-

```js
const createRouter = () => new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.master = newRouter.matcher // reset router
}

export default router
```

所有的 `vue-router` 注册的路由信息都是存放在`matcher`之中的
所以当我们想清空路由的时候，我们只要新建一个空的`Router`实例，将它的`matcher`重新赋值给我们之前定义的路由就可以了。巧妙的实现了动态路由的清除。

## vuex

## vue webpack 中 proxy 遇到的坑

```js config/index.js
dev: {
  // Paths
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  proxyTable: {
    '/v2/api/': {
      target: 'http://127.0.0.1:5281/v2/api',
      secure: false,
      changeOrigin: true,
      onProxyReq: ProxyReq => {
        console.log('%c PROXY ...', 'color: teal')
        // proxyReq.removeHeader('origin')
      },
      pathRewrite: {
        '^/v2/api/': ''
      }
    },
    '/v2/smartApi/': {
      target: 'http://10.15.225.12:8848/api',
      secure: false,
      changeOrigin: true,
      onProxyReq: ProxyReq => {
        console.log('%c PROXY ...', 'color: teal')
        // proxyReq.removeHeader('origin')
      },
      pathRewrite: {
        '^/v2/smartApi/': ''
      }
    },
  },
  // ...
}
```

然后控制台之中出现不了

```js
 I  Your application is running here: http://localhost:7014
%c PROXY ... color: teal
%c PROXY ... color: teal
%c PROXY ... color: teal
%c PROXY ... color: teal
```

注意：
主要原因在于，我的 axios 请求的端口使用的是 5280 而我的前端站点使用的端口是 7014.
本来 proxy 代理的就是前端页面的路由，也就是代理默认端口 7014 下的接口请求
而我之前的路由已经有了一个后台服务的5280端口.
这样的话，也就不起作用了。

解决方案：

1. 前端站点的端口和接口请求的端口保持一致
2. 使用 nginx 反向代理。需要注意的是，代理的服务端口不能和已经开启的python服务端口一样。一样的话就不能是实现反向代理

## vue-cli3 遇到的问题

### 不能再IE11上显示

主要问题还是打包的时候，没有进行很好的 babel 编译

## 前端错误监控 vue 版本

Vue全局配置 errorHandler可以进行全局错误收集,我们可以根据这个特性对前端异常做这样的处理：业务错误直接写在业务里；代码错误、ajax请求异常等错误可以进行全局捕获然后抛出，不至于前端页面挂掉

``` JS
import Vue from 'vue'
//系统错误捕获
const errorHandler = (error, vm)=>{
  console.error('抛出全局异常');
  console.error(vm);
  console.error(error);

}

Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error)=> errorHandler(error,this);
```

**tips**:
1、代码错误不用手动抛出，全局会捕获到

2、如果是ajax异步请求，异常需要通过`this.$throw()`手动抛出

