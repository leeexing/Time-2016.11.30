# inter-react

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