---
title: typescript learn
tags: javascript, typescript
---

## 1、基本语法使用

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

### 1.2 泛型的再理解

> 这里告诉我，官方的文档还是说得更加详细一些。阮一峰的那个对泛型这一个知识点说得比较简单，例子讲解也不够详细

```ts
function logIdentiry<T>(arg: T[]): T[] {
  console.log(arg.length)
  return arg
}
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  return arg
}

// - 应出勤和实出勤天数
let identi: <T>(arg: T) => T = identity
let identit: { <T>(arg: T): T } = identity

// 提取出来，编写一个泛型接口
interface GenericIdentity {
  <T>(arg: T): T
}
let test: GenericIdentity = identity

// 把泛型参数当作整个接口的一个参数。这样我们就能清楚的知道使用的具体是哪个泛型类型
interface GenericIdentit<T> {
  (arg: T): T
}
// 但是这样的花，下面这种写法就不对了。没有
let test: GenericIdentity = identity
// 正确的写法应该是这样，包含一个类型参数
let test2: GenericIdentit<string> = identity
                          ⬆⬆⬆⬆⬆⬆⬆

// 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。
// 当我们使用 GenericIdentityFn的时候，还得传入一个类型参数来指定泛型类型（这里是：number），锁定了之后代码里使用的类型。
// 对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。

```

**泛型约束**:

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```

在泛型约束中使用类型参数

```ts
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
// 但是上面一个函数并没有提示报错信息
```

上面的代码中并没有解决两个参数间的使用约束问题。而且 T，K 也会报没有找到对应变量的问题
正确的写法应该是这样的

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

这样定义之后，最后一个函数调用前，就会提示。使用 `K extends  keyof T` 很好的解决了该问题

REFER: [keyof and lookup](https://mariusschulz.com/blog/keyof-and-lookup-types-in-typescript)

## 2、interface 和 type 的不同

2.1 接口有几种类型：

* 属性类接口
* 函数类接口
* 可索引接口
* 类类型接口

其他还有 接口继承接口，接口继承类

函数类型： 为了使用接口表示函数类型，我们需要给接口定义一个`调用签名`.它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型。

```ts 属性类接口。type也可以
interface Person {
  name: string;
  age: numver;
}

type Person = {
  name: string
  age: number
}

function printPerson(person: Person) {
  console.log(person.name + ' ' + person.age)
}

```

```ts 函数类接口. type 也可以
interface encrypt {
  (key: string, value: string): string;
}

type encrypt = (key: string, value: string) => string;

let md5: encrypt = function(key: string, value: string): string {
  return key + value
}
```

```ts 可索引接口：对数组和对象的约束。不常用
interface UserArr {
  [index: number]: string;
}

interface UserObj {
  [index: string]: string;
}
```

```ts 类类型接口
interface Animal {
  name: string;
  eat(str: string): void;
}

class Dog implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name
  }

  eat(str: string) {
    console.log(this.name + 'eat shit')
  }
}

interface ClockConstructor {
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
  currentTime: Data;
  constructor(h: number, m: number) {}
}
```

__接口可以继承类__.

2.2 interface 和 type 使用的区别

```ts
interface CreateArr<T> {
  (len: number, value: T): Array<T>;
}

//  TIP: 这样是报错的
type CreateArray<T> {
  (len: number, value: T): Array<T>;
}
// 这样写才对
type CreateArray<T> = (len: number, value: T) => Array<T>;

```

看到上面的代码，可以明白 interface 使用的是 `{}`; type 使用的是 `=`

下面这段代码需要说明的是。两种不同的声明函数需要符合的形状的方式

```ts
interface Counter {
  (start: number): string
}

type Count = (start: number) => number;

let getCounter: Count
getCounter = function(start: number) {
  console.log(223)
  return 'heelp'
}
```

都允许扩展（Extends）

```ts
interface Name {
  name: string;
}
interface User extends Name {
  age: number;
}

type Name = {
  name: string;
}
type User = Name & { age: string }

// 可以相互继承
type Name = {
  name: string;
}
interface User extends Name {
  age: number;
}
```

不同点：

* type可以生命基本类型别名，联合类型，元组等类型
* type 语句中还可以使用 `typeof` 获取实例的 类型 进行赋值
* 其他骚操作

```ts
type Name = string;

interface Dog {
  wong()
}
interface Cat {
  miao()
}
type Pet = Dog | Cat
type PetList = [Dog, Cat]

let div = document.createElement('div')
type B = typeof div

// 骚操作
type StringOrNumber = string | number;
type Text = string | { text: string }
type NameLookup = Dictionary<string, Person>
type callback<T> = (data: T) => void;
type Pair<T> = [T, T]
type Coordinates = Pair<number>
type Tree<T> = T | { left: Tree<t>, right: Tree<T>}
```

其中,类似 `(v: T) => boolean` 这样的代码，就是将逻辑复用，声明成一个类型

```ts
// 声明泛型类，类型变量为 T
class FilteredList<T> {
    // 声明过滤器是以 T 为参数类型，返回 boolean 的函数表达式
    filter: (v: T) => boolean;
    // 声明数据是 T 数组类型
    data: T[];
    constructor(filter: (v: T) => boolean) {
        this.filter = filter;
    }

    add(value: T) {
        if (this.filter(value)) {
            this.data.push(value);
        }
    }

    get all(): T[] {
        return this.data;
    }
}

// 处理 string 类型的 FilteredList
const validStrings = new FilteredList<string>(s => !s);

// 处理 number 类型的 FilteredList
const positiveNumber  = new FilteredList<number>(n => n > 0);


// 优化之后
type Predicate<T> = (v: T) => boolean;

class FilteredList<T> {
    filter: Predicate<T>;
    data: T[];
    constructor(filter: Predicate<T>) { ... }
    add(value: T) { ... }
    get all(): T[] { ... }
}
```

interface 可以做到

* 声明合并

```ts
interface User {
  name: string
  age: number
}
interface User {
  sex: string
}

// User 接口为
{
  name
  age
  sex
}
```

2.3 泛型别名

```ts
// 非泛型的联合类型重命名
type ant = string | (() => string)

// 泛型相关类型的重命名
type ant<T> = T | (() => T)
```

2.4 泛型接口

```ts
interface Generics {
  <S>(arg: S): S;
}
// 等价于。将泛型参数提前到接口名上
interface Generics<S> {
  (arg: S): S;
}

const generics = <T>(arg: T): T => {
  return arg
}

let generics_1: <T>(arg: T) => T = generics
let generics_2: { <S>(arg: S): S } = generics // 对象字面量
let generics_3: Generics = generics

console.log(generics_1(18))
console.log(generics_1('是吧'))
console.log(generics_1('pre'))
```

2.5 泛型类

> 泛型类看上去与泛型接口差不多。 泛型类使用（ <>）括起泛型类型，跟在类名后面。

```ts
class Sum<T> {
  zero: T;
  add: (x: T, y: T) => T;
}

// NOTE: 使用。需要传递一个类型参数
let sum = new Sum<number>() // 这里就限定了类的参数只能是 number 类型
sum.zero = 12 // 这里就不能是 string
sum.add(2, 4) // 这里也是如此，不能使用其他数据类型
```

与接口一样，直接把泛型类型放在类后面，可以帮助我们确认类的所有属性都在使用相同的类型。

## 3、一些简单的例子|分析|理解

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

## 4、react-typescript-cheatsheet

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

## 5、别人的分享

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

## 6、实战中使用心得

### 6.1 简直太难了

> 还是需要费很多的脑细胞去理解

```ts
export interface BaseAction {
  type: string;
}

export interface Action<Payload> extends BaseAction {
  payload?: Payload;
  error?: boolean;
}

type ActionFunction0<R> = () => R;

type ActionFunction1<T1, R> = (t1: T1) => R;

type Todo = {
  id?: string;
  text: string;
  completed: boolean;
}

function createAction(
  actionType: string
): ActionFunction0<Action<void>> {
  return () => ({
    type: actionType
  })
}

function createAction1<Payload, Arg1>(
  actionType: string,
  payloadCreator: ActionFunction1<Arg1, Payload>
): ActionFunction1<Arg1, Action<Payload>> {
  return (text) => ({
    type: actionType,
    payload: payloadCreator(text),
  })
}

const c = createAction(
  'ADD'
)

const cc = createAction1<Todo, string>(
  'ADD_NEW',
  (text: string) => ({ text, completed: false })
)
```
