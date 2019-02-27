# 插件的学习

> 好好整理一下

## vue

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

### 使用

```
<comp :foo.sync="bar"></comp>

会被扩展为：

<comp :foo="bar" @update:foo="val => bar = val"></comp>
```
当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：
`this.$emit('update:foo', newValue)`

// TIP:  语法糖。还是需要使用 `$emit` 这个方法


**处理加载状态**
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

**依赖注入**

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

**程序化的事件侦听器**

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
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
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
可以用 <transition> 组件上的 duration 属性定制一个显性的过渡持续时间 (以毫秒计)

```js
<transition :duration="1000">...</transition>

<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

**JavaScript 钩子**

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

**过渡模式**

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

2. 钩子函数参数
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

### 选项 / 生命周期钩子

所有的生命周期钩子自动绑定 this 上下文到实例中，因此你可以访问数据，对属性和方法进行运算。这意味着`你不能使用箭头函数来定义一个生命周期方法` (例如 created: () => this.fetchTodos())。这是因为箭头函数绑定了父上下文，因此 this 与你期待的 Vue 实例不同，this.fetchTodos 的行为未定义。

**activated**
keep-alive 组件激活时调用。

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


## CSS

flex 着重于单轴，而 grid 适应于多轴

### 容器属性

grid-template 系列

grid-template-columns
grid-template-rows
grid-template-areas


grid-gap 系列

grid-column-gap
grid-row-gap


place-items 系列

justify-items
align-items


place-content 系列

justify-content
align-content


grid 系列

grid-auto-columns
grid-auto-rows
grid-auto-flow


## question

1. 在chrome的地址栏输入http://baidu.com
2. chrome通过DNS去查找http://baidu.com这个域名对应的IP地址
  chrome浏览器会先查找有没有缓存的DNS记录，如果在浏览器缓存没有找到需要的记录，就会去做一个系统的调用，获取系统缓存的记录
  如果没有记录请求会继续到路由器上，路由器上有自己的DNS缓存
  如果没有记录就会到ISP的DNS缓存中查看记录
  如果没有记录就会在ISP的DNS服务器从根服务器域名服务器开始递归搜索最后得到IP地址
3. 浏览器给baidu服务器发送一个HTTP请求
4. baidu服务器301重定向响应
5. chrome浏览器请求重定向来的地址
6. baidu服务器处理请求
  baidu服务器在这个时候接收到了请求，它会去查看请求它的参数还有cookie信息，然后会进行一些操作处理，例如对数据进行存储，从数据库中获取需要被请求的数据等
7. baidu服务器返回HTML响应
  当baidu服务器处理好之后，就会给浏览器返回数据了，这个时候会有一个Response Headers发送给浏览器
8. chrome浏览器显示baidu页面

1. 浏览器获得url对应的请求，向操作系统请求该url对应的iP地址
2. 操作系统查询DNS （首先查询本地host文件，没有则查询网络）获得对应ip地址
3. 浏览器发送tcp连接请求向 ip地址对应的服务器（带SYN标志数据包）。
4. 服务器收到tcp连接请求后，回复可以链接请求（有SYN/ACK标志的数据包）。
5. 浏览器收到回传的数据，确认ok后，还会向服务端发送数据（带ACK标志的数据包）包表示三次握手结束。
6. 三次握手成功后，浏览器和服务端开始tcp连接形式传输数据包。
7. 服务器传给浏览所需要的资源数据。
8. 浏览器获得数据，渲染网页然后呈现给用户。