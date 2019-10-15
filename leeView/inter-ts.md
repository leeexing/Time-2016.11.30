---
title: typescript learn
tags: javascript, typescript
---

## 基本语法使用

知道的简单的略过，这里重点学习比较难理解的

1、泛型约束

```ts
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

loggingIdentity(7) // 报错
```

使用 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性

2、泛型接口

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc // 这里进行了函数约束
mySearch = function(source: string, subString: string) {
  retru source.search(subString) !== -1
}

interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>
}

// or

interface CreateArray<T> {
  (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc
createArray = function<T>(length: number, value: T): Array<T> {}
```

3、Union Types and Type Guarding 联合类型和类型保护

```ts Union Types
class App extends React.Component<
  {},
  {
    count: number | null; // like this
  }
> {
  state = {
    count: null
  }
  increment = (amt: number) => {
    this.setState({
      count: (state.count | 0) + amt
    })
  }
  render() {
    return <div onClick={() => this.increment(1)}>{this.state.count}</div>
  }
}
```

```ts Type Guarding
interface Admin {
  role: string;
}

interface User {
  email: string;
}

// -method1
funciton redirect(user: Admin | User) {
  if ('role' in user) {
    routeToAdminPage(user.role)
  } else {
    routoToHomePage(user.emial)
  }
}

// method2
function isAdmin(user: Admin | User): user is Admin {
  return (user as any).role !== undefined
}
```

4、Enum Type

```ts
export enum ButtonSizes {
  default = 'default',
  small = 'small',
  large = 'large'
}

export const PrimaryBurron = (props: Props && React.HTMLProps<HTMLButtonElement>) =>
  <Button size={ButtonSizes.default} {...props} />

// or
export declare type Position = 'left' | 'right' | 'top' | 'bottom'
```

5、Troubleshooting Handbook: Operators 故障排除手册

* typeof and instanceof: type query used for refinement
* keyof: get keys of an object
* O[K]: property lookup
* [K in O]: mapped types
* \+ or - or readonly or ?: addition and subtraction and readonly and optional modifiers
* x ? Y : Z: Conditional types for generic types, type aliases, function parameter types
* !: Nonnull assertion for nullable types
* =: Generic type parameter default for generic types
* as: type assertion
* is: type guard for function return types

6、Troubleshooting Handbook: Utilities

* ConstructorParameters: a tuple of class constructor's parameter types
* Exclude: exclude a type from another type
* Extract: select a subtype that is assignable to another type
* InstanceType: the instance type you get from a newing a class constructor
* NonNullable: exclude null and undefined from a type
* Parameters: a tuple of a function's parameter types
* Partial: Make all properties in an object optional
* Readonly: Make all properties in an object readonly
* ReadonlyArray: Make an immutable array of the given type
* Pick: A subtype of an object type with a subset of its keys
* Record: A map from a key type to a value type
* Required: Make all properties in an object required
* ReturnType A function's return type

7、Troubleshooting Handbook: TSLint

* /* tslint:disable */ total disable
* // tslint:disable-line just this line
* /* tslint:disable:semicolon */ sometimes prettier adds semicolons and tslint doesn't like it.
* /* tslint:disable:no-any */ disable tslint restriction on no-any when you WANT to use any
* /* tslint:disable:max-line-length */ disable line wrapping linting

## 一些简单的例子|分析|理解

1、[一篇文章中学习](https://2ality.com/2018/04/type-notation-typescript.html)

```ts
interface Array<T> {
  concat(...item: Array<T[] | T>): T[];
  reduce<U>(
    callback: (state: U, element: U, index: number, array: T[]) => U,
    firstState?: U): U;
  )
}
```

看似不好理解，拆解开来慢慢看，还是可以略知一二的。

method .reduce() introduces its own type variable, U. U expresses the fact that the following entities all have the same type (which you don’t need to specify, it is inferred automatically):

2、基本类型的使用

```ts
type AppProps = {
  message: string;
  count: number;
  disabled: boolean;
  names: stirngs[];
  status: 'waiting' | 'success';
  obj: object;
  obj2: {};
  obj3: {
    id: string;
    title: string;
  };
  objArr: {
    id: string;
    title: string;
  }[];
  onSomething: Function;
  onClick: () => void;
  onChange: (id: number) => void;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  optional?: OptionalTypes;
}
```

3、Useful React Prop Type Example

```ts
export declare interface AppProps {
  children1: JSX.Element; // bad
  children2: JSX.Element | JSX.Element[]; // return value of React.createElement
  children3: JSX.ReactChildren;
  children4: React.ReactChild[]; // better
  children5: React.ReactNode; // best; return value of a compoent
  funcitonChildren: (name: string) => React.ReactNode;
  style?: React.CSSProperties;
  onChange?: React.FormEventHandle<HTMLInputElement>;
  props: Props & React.PropsWithoutRef<JSX.IntinsicElement['Button]>;
}
```

4、Commenting Components

```ts
import React from 'react'

interface MyProps {
  /** Description of prop 'label'
   * @default foobar
   * */
  label?: string;
}

export default funciton MyComponent({ label = 'foobar' }: MyProps) {
  return <div>Hellp world { label }</div>
}
```

5、Context 涉及到 hooks 了

```ts
functin createCtx<A>() {
  const ctx = React.createContext<A | undefined>(undefined)
  function useCtx() {
    const c = React.useContext(ctx)
    if (!c) throw new Error('useCtx must be inside a Provider with a value')
    retur c
  }
  return [useCtx, ctx.Provider] as const; // make Typescript infer a tuple, not a array of union types
}

// usage
export const [useCtx, SettingProvider] = createCtx<string>()
export function App() {
  const key = useConstomHook('key')
  return (
    <SettingProvider>
      <Component/>
    </SettingProvider>
  )
}
```

6、条件类型

```ts
function process<T extends string | null>(
  text: T
): T extends string ? string : null {
  ...
}

declare const maybeFoo: string | null

typeof process("foo") // => string
typeof process(null) // => null
typeof process(maybeFoo) // => string | null
```

So that's what a conditional type is! A kind of ternary type expression. It always has this form:

```ts
A extends B ? C : D
```

7、高级的添加类型

```ts
type ExcludTypeKey<K> = K extends 'type' ? never : K

type Test = ExcludeTypeKey<'emailAddress' | 'type' | 'foo'> // => 'emailAddress' / 'foo'

type ExcludeTypeField<A> = { [k in ExcludeTypeKey<keyof A>]: A[K] }

type Test = ExcludeTypeField<{ type: 'LOG_IN'; emailAddress: string }> // => { emailAddress: string }

type ExtractActionParameters<A, T> = A extends { type: T }
  ? ExcludeTypeField<A>
  : never
```

## react-typescript-cheatsheet

```jsx
class App extends React.Component<{ message: string }, { count: number }> {
  state = { count: 0 }
  render() {
    return (
      <div onclick={() => this.increment(1)}>
        { this.props.message } { this.state.count }
      </div>
    )
  }
  increment = (amt: number) => {
    this.setState( state => {
      count: state.count + amt
    })
  }
}
```

```ts
class App extends React.Component<{}, { text: string }> {
  state = {
    text: ''
  }
  onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ text: e.currentTarget.value })
  }

  // or

  onChange: React.ChangeEventHandle<HTMLInputElement> = e => {
    this.setState({ text: e.currentTarget.value })
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.onChange} />
      </div>
    )
  }
}

```

## 别人的分享

1、useContext

```ts
interface ProviderState {
  themeColor: string;
}

interface UpdateStateArg {
  key: keyof ProviderState;
  value: string;
}

interface ProviderStore {
  state: ProviderState;
  update: (arg: UpdateStateArg) => void;
}

const Context = React.createContext({} as ProviderState)

class Provider extends React.Component<{}, ProviderState> {
  public readonly state = {
    themeColor: 'red'
  }

  private update = ({ key, value }: UpdateStateArg) => {
    this.setState({ [key]: value })
  }

  public render() {
    const store: ProviderStore = {
      state: this.state,
      update: this.update
    }

    return (
      <Context.Provider value={store}>{this.props.children}</Context.Provider>
    )
  }
}

const Consumer = Context.Consumer
```

2、Portal

```ts
const modalRoot = document.getElementById('modal-root) as HTMLElement

export class Modal extends React.Component {
  el: HTMLElement = document.createElement('div')

  componentDidMount() {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}
```

## 实战中使用心得


