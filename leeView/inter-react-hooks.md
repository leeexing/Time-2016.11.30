# React Hooks

## 推荐文章

1、[一篇看懂 React Hooks - 知乎](https://zhuanlan.zhihu.com/p/50597236)

## 基本学习

## 高阶学习

## 基本使用

### 模拟生命周期

1、componentDidMount

```js
useEffect(() => {}, [])
```

2、componentWillUnmount

> 等价于 `useEffect` 的回调函数返回值（仅执行一次时）

```js
useEffect(() => fn, [])

useUnmount(() => {
  // ... 整个参数就是上面封装中的 fn
})
```

3、Force Updata

```js
const useUpdate = () => useState(0)[1]

const update = useUpdate()
// 就算数据没有变化，调用了也会刷新组件
```

## 自定义Hooks

### useIsMounted

```js
function useIsMounted() {
  const [isMount, setIsMount] = useState(false)
  useEffect(() => {
    if (!isMount) {
      setIsMount(true)
    }
    return () => setIsMount(false)
  }, [])
  return isMount
}
```

### useComponentSize

> 效果：通过调用 useComponentSize 拿到某个组件 ref 实例的宽高，并且在宽高变化时，rerender 并拿到最新的宽高。

```js achieve
useLayoutEffect(() => {
  handleResize()

  let resizeObserver = new ResizeObserver(() => handleResize())
  resizeObserver.observe(ref.current)
  return () => {
    resizeObserver.disconnect(ref.current)
    resizeObserver = null
  }
}, [input])
```

### useInputValue

> 效果：通过 useInputValue() 拿到 Input 框当前用户输入的值，而不是手动监听 onChange 再腾一个 otherInputValue 和一个回调函数把这一堆逻辑写在无关的地方

```js achieve
function useInputValue(initialValue) {
  let [value, setValue] = useState(initialValue)
  let onChange = useCallback(
    (value) => {
      setValue(event.currentTarget.value)
    },
    []
  )
  return {
    value,
    onChange
  }
}

let name = useInputValue("Jamie");
// name = { value: 'Jamie', onChange: [Function] }
return <input {...name} />;
```

### o

## 存数据

## useReduce [模拟 redux 的 reducer 行为]

```js use
const store = createStore({
  user: {
    name: "小明",
    setName: (state, payload) => {
      state.name = payload;
    }
  }
});

const App = () => (
  <StoreProvider store={store}>
    <YourApp />
  </StoreProvider>
);

function YourApp() {
  const userName = useStore(state => state.user.name);
  const setName = userAction(dispatch => dispatch.user.setName);
}
```

```js achieve
const StoreContext = cteateContext()

const StoreProvider = ({ children, store }) => {
  <StoreContext.Provider value={store}>{ children }</StoreContext.Provider>
}
```

```js
const store = useContext(StoreContext)
return store
```