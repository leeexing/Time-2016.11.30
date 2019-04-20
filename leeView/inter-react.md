# inter-react

## 和 vue 的本质区别

1.React严格上只针对MVC的view层,Vue则是MVVM模式

2.virtual DOM不一样,vue会跟踪每一个组件的依赖关系,不需要重新渲染整个组件树.

  而对于React而言,每当应用的状态被改变时,全部组件都会重新渲染,所以react中会需要shouldComponentUpdate这个生命周期函数方法来进行控制

3.组件写法不一样, React推荐的做法是 JSX + inline style, 也就是把HTML和CSS全都写进JavaScript了,即'all in js';

  Vue推荐的做法是webpack+vue-loader的单文件组件格式,即html,css,jd写在同一个文件;

4.数据绑定: vue实现了数据的双向绑定,react数据流动是单向的

5.state对象在react应用中不可变的,需要使用setState方法更新状态;

  在vue中,state对象不是必须的,数据由data属性在vue对象中管理；

react整体的思路就是函数式，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以做到，比如结合redux-form，而vue是基于可变数据的，支持双向绑定。react组件的扩展一般是通过高阶组件，而vue组件会使用mixin。vue内置了很多功能，而react做的很少，很多都是由社区来完成的，vue追求的是开发的简单，而react更在乎方式是否正确。

一、监听数据变化的实现原理不同

Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能。
React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的VDOM的重新渲染。
为什么 React 不精确监听数据变化呢？这是因为 Vue 和 React 设计理念上的区别，Vue 使用的是可变数据，而React更强调数据的不可变。所以应该说没有好坏之分，Vue更加简单，而React构建大型应用的时候更加鲁棒。因为一般都会用一个数据层的框架比如 Vuex 和 Redux

二、数据流的不同

Vue中默认是支持双向绑定的
然而 React 从诞生之初就不支持双向绑定，React一直提倡的是单向数据流，他称之为 onChange/setState()模式。

三、HoC 和 mixins

在 Vue 中我们组合不同功能的方式是通过 mixin，而在React中我们通过 HoC (高阶组件）。
React 最早也是使用 mixins 的，不过后来他们觉得这种方式对组件侵入太强会导致很多问题，就弃用了 mixinx 转而使用 HoC
高阶组件本质就是高阶函数，React 的组件是一个纯粹的函数，所以高阶函数对React来说非常简单。

但是Vue就不行了，Vue中组件是一个被包装的函数，并不简单的就是我们定义组件的时候传入的对象或者函数。比如我们定义的模板怎么被编译的？比如声明的props怎么接收到的？这些都是vue创建组件实例的时候隐式干的事。由于vue默默帮我们做了这么多事，所以我们自己如果直接把组件的声明包装一下，返回一个高阶组件，那么这个被包装的组件就无法正常工作了。

四、组件通信的区别

在Vue 中有三种方式可以实现组件通信：
1.父组件通过 props 向子组件传递数据或者回调，虽然可以传递回调，但是我们一般只传数据，而通过 事件的机制来处理子组件向父组件的通信
2.子组件通过 事件 向父组件发送消息
3.通过 V2.2.0 中新增的 provide/inject 来实现父组件向子组件注入数据，可以跨越多个层级。
4.另外有一些比如访问 $parent/$children等比较dirty的方式这里就不讲了。

在 React 中，也有对应的两种方式：
1.父组件通过 props 可以向子组件传递数据或者回调
2.可以通过 context 进行跨层级的通信，这其实和 provide/inject 起到的作用差不多。

可以看到，React 本身并不支持自定义事件，Vue中子组件向父组件传递消息有两种方式：事件和回调函数，而且Vue更倾向于使用事件。但是在 React 中我们都是使用回调函数的，这可能是他们二者最大的区别。

五、模板渲染方式的不同

在表层上， 模板的语法不同

React 是通过JSX渲染模板；
Vue是通过一种拓展的HTML语法进行渲染。

但其实这只是表面现象，毕竟React并不必须依赖JSX。

在深层上，模板的原理不同，这才是他们的本质区别：

React是在组件JS代码中，通过原生JS实现模板中的常见语法，比如插值，条件，循环等，都是通过JS语法实现的；
Vue是在和组件JS代码分离的单独的模板中，通过指令来实现的，比如条件语句就需要 v-if 来实现。

对这一点，我个人比较喜欢React的做法，因为他更加纯粹更加原生，而Vue的做法显得有些独特，会把HTML弄得很乱。
举个例子，说明React的好处：

react中render函数是支持闭包特性的，所以我们import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以我们import 一个组件完了之后，还需要在 components 中再声明下，这样显然是很奇怪但又不得不这样的做法。

六、Vuex 和 Redux 的区别

从表面上来说，store 注入和使用方式有一些区别。

在 Vuex 中，$store 被直接注入到了组件实例中，因此可以比较灵活的使用：

使用 dispatch 和 commit 提交更新；
通过 mapState 或者直接通过 this.$store 来读取数据。

在 Redux 中，我们每一个组件都需要显示的用 connect 把需要的 props 和 dispatch 连接起来。

另外 Vuex 更加灵活一些，组件中既可以 dispatch action 也可以 commit updates，而 Redux 中只能进行 dispatch，并不能直接调用 reducer 进行修改。

从实现原理上来说，最大的区别是两点：
1.Redux 使用的是不可变数据，而Vuex的数据是可变的。Redux每次都是用新的state替换旧的state，而Vuex是直接修改
2.Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过 getter/setter来比较的（如果看Vuex源码会知道，其实他内部直接创建一个Vue实例用来跟踪数据变化）

而这两点的区别，其实也是因为 React 和 Vue的设计理念上的区别。React更偏向于构建稳定大型的应用，非常的科班化。相比之下，Vue更偏向于简单迅速的解决问题，更灵活，不那么严格遵循条条框框。因此也会给人一种大型项目用React，小型项目用 Vue 的感觉。

## hooks

REFER: https://github.com/dt-fe/weekly/blob/master/80.%E7%B2%BE%E8%AF%BB%E3%80%8A%E6%80%8E%E4%B9%88%E7%94%A8%20React%20Hooks%20%E9%80%A0%E8%BD%AE%E5%AD%90%E3%80%8B.md

### 修改页面 title

```js
useDocumentTitle("个人中心")

function useDocumentTitle(title) {
  useEffect(
    () => {
      document.title = title;
      return () => (document.title = "前端精读");
    },
    [title]
  );
}
```

### 监听页面大小变化，网络是否断开

```js
const windowSize = useWindowSize();
return <div>页面高度：{windowSize.innerWidth}</div>;

function useWindowSize() {
  let [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  };
}
```

### 将更新与动作解耦

利用 useEffect 的兄弟 useReducer 函数，将更新与动作解耦就可以了：

```js
const [state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;

useEffect(() => {
  const id = setInterval(() => {
    dispatch({ type: "tick" }); // Instead of setCount(c => c + step);
  }, 1000);
  return () => clearInterval(id);
}, [dispatch]);
```

这就是一个局部 “Redux”，由于更新变成了 dispatch({ type: "tick" }) 所以不管更新时需要依赖多少变量，在调用更新的动作里都不需要依赖任何变量。 具体更新操作在 reducer 函数里写就可以了

> Dan 也将 useReducer 比作 Hooks 的的金手指模式，因为这充分绕过了 Diff 机制，不过确实能解决痛点！

### 将 Function 挪到 Effect 里

在 “告诉 React 如何对比 Diff” 一章介绍了依赖的重要性，以及对 React 要诚实。那么如果函数定义不在 useEffect 函数体内，不仅可能会遗漏依赖，而且 eslint 插件也无法帮助你自动收集依赖。

**如果非要把 Function 写在 Effect 外面呢？**
如果非要这么做，就用 useCallback 吧！

```js
function Parent() {
  const [query, setQuery] = useState("react");

  // ✅ Preserves identity until query changes
  const fetchData = useCallback(() => {
    const url = "https://hn.algolia.com/api/v1/search?query=" + query;
    // ... Fetch data and return it ...
  }, [query]); // ✅ Callback deps are OK

  return <Child fetchData={fetchData} />;
}

function Child({ fetchData }) {
  let [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); // ✅ Effect deps are OK

  // ...
}
```

由于函数也具有 Capture Value 特性，经过 useCallback 包装过的函数可以当作普通变量作为 useEffect 的依赖。
useCallback 做的事情，就是在其依赖变化时，返回一个新的函数引用，触发 useEffect 的依赖变化，并激活其重新执行。

### 模拟生命周期

**componentDidMount**
效果：通过 useMount 拿到 mount 周期才执行的回调函数。
实现：componentDidMount 等价于 useEffect 的回调（仅执行一次时），因此直接把回调函数抛出来即可。

```js
useMount(() => {
  // quite similar to `componentDidMount`
});

useEffect(() => void fn(), []);
```

**componentWillUnmount**
效果：通过 useUnmount 拿到 unmount 周期才执行的回调函数。
实现：componentWillUnmount 等价于 useEffect 的回调函数返回值（仅执行一次时），因此直接把回调函数返回值抛出来即可

```js
useUnmount(() => {
  // quite similar to `componentWillUnmount`
});

useEffect(() => fn, []);
```

**componentDidUpdate**
效果：通过 useUpdate 拿到 didUpdate 周期才执行的回调函数。
实现：componentDidUpdate 等价于 useMount 的逻辑每次执行，除了初始化第一次。因此采用 mouting flag（判断初始状态）+ 不加限制参数确保每次 rerender 都会执行即可。

```js
useUpdate(() => {
  // quite similar to `componentDidUpdate`
});

const mounting = useRef(true);
useEffect(() => {
  if (mounting.current) {
    mounting.current = false;
  } else {
    fn();
  }
});
```

**Force Update**
效果：这个最有意思了，我希望拿到一个函数 update，每次调用就强制刷新当前组件。
实现：我们知道 useState 下标为 1 的项是用来更新数据的，而且就算数据没有变化，调用了也会刷新组件，所以我们可以把返回一个没有修改数值的 setValue，这样它的功能就仅剩下刷新组件了。

```js
const update = useUpdate();

const useUpdate = () => useState(0)[1];
```

**isMounted**
效果：通过 useIsMounted 拿到 isMounted 状态。
实现：看到这里的话，应该已经很熟悉这个套路了，useEffect 第一次调用时赋值为 true，组件销毁时返回 false，注意这里可以加第二个参数为空数组来优化性能。

```js
const isMounted = useIsMounted();

const [isMount, setIsMount] = useState(false);
useEffect(() => {
  if (!isMount) {
    setIsMount(true);
  }
  return () => setIsMount(false);
}, []);
return isMount;
```

### 存数据

**全局 Store**
效果：通过 createStore 创建一个全局 Store，再通过 StoreProvider 将 store 注入到子组件的 context 中，最终通过两个 Hooks 进行获取与操作：useStore 与 useAction：

REFER: https://github.com/ctrlplusb/easy-peasy

## redux

### mapDispatchToProps

> connect 的第二个参数是 mapDispatchToProps，它的功能是，用来建立 UI 组件的参数到store.dispatch方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。

如果mapDispatchToProps是一个对象，它的每个键名也是对应 UI 组件的同名参数，`键值应该是一个函数`，会被当作 Action creator ，返回的 Action 会由 Redux发出

```js
const mapDispatchToProps = (dispatch) => {
   return {
       onJudge:(data)=>{
           dispatch({type:"LOGIN",data});
       }
   }
}
```

如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数

```js
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onJudge: () => {
      dispatch({
        type: 'LOGIN',
        data
      });
    }
  };
}
```