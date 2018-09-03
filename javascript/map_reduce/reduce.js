/**
 * 还是需要好好了解 reduce 的具体使用
 */

 // 基本概念：reduce() 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始缩减，最终为一个值
 // reduce 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组。

 // arr.reduce(callback,[initialValue])

 /*
  * callback （执行数组中每个值的函数，包含四个参数）

    previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    currentValue （数组中当前被处理的元素）
    index （当前元素在数组中的索引）
    array （调用 reduce 的数组）
    initialValue （作为第一次调用 callback 的第一个参数。）
  * 

  Tip: 不要将参数的位置记反了。prev 这个值很有意思
  */

// !不借助原生高阶函数，定义reduce
const reduce = (f, acc=0, arr) => {
  if (arr.length === 0) return acc
  let [head, ...tail] = arr
  return reduce(f, f(head, acc), tail)
}
// 点评：有点深奥啊.感觉有点错误啊

// !使用 reduce 可以 替代 map 和 filter
var arr = [10, 45, 36, 67]
arr.map(item => item + 15).filter(item => item > 50)

arr.reduce((pre, cur) => {
  console.log(pre, cur)
  cur += 15
  if (cur > 50) {
    pre.push(cur)
  }
  return pre
},[])

// !使用reduce 模仿 map 函数
function map(arr, iterator) {
  return arr.reduce((pre, cur, index) => {
    let newItem = iterator(cur, index)
    pre.push(newItem)
    return pre
  }, [])
}

// !使用 reduce 模仿 filter 函数
function filter(arr, iterator) {
  return arr.reduce((pre, cur, index) => {
    let flag = iterator(cur, index)
    if (flag) {
      pre.push(cur)
    }
    return pre
  }, [])
}

// !reduce扁平化数组
const nestedArr = [1, 2, [3, 4, [5, 6]]]
const flatten = arr =>
  arr.reduce(
    (flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next),
    []
  )
// 点评：好厉害啊！递归运用得很好

// !取出对象深层次的熟悉
const deepAttr = { a: { b: { c: 15 } } }
const pluckDeep = path => obj =>
  path.split('.').reduce((val, attr) => val[attr], obj)
// 点评：reduce 的两个参数要根据具体的场景合适的命名。这样比较好理解

// !对数组里面的属性进行分组
const users = [
  { name: "Adam", age: 30, sex: "male" },
  { name: "Helen", age: 27, sex: "female" },
  { name: "Amy", age: 25, sex: "female" },
  { name: "Anthony", age: 23, sex: "male" },
]
const isMale = person => person.sex === 'male'
const grouping = (isValid, arr) =>
  arr.reduce(
    ([pass, fail], next) =>
      isValid(next) ? [[...pass, next], fail] : [pass, [...fail, next]]
  )
// 点评：太强悍了

// !提取数据 takeWhile
const houses = [
  "Eddard Stark",
  "Catelyn Stark",
  "Rickard Stark",
  "Brandon Stark",
  "Rob Stark",
  "Sansa Stark",
  "Arya Stark",
  "Bran Stark",
  "Rickon Stark",
  "Lyanna Stark",
  "Tywin Lannister",
  "Cersei Lannister",
  "Jaime Lannister",
  "Tyrion Lannister",
  "Joffrey Baratheon"
]
let ret = houses.filter(item => item.includes('Stark'))

const takeWhile = f => ([head, ...tail]) =>
  f(head) ? [head, ...takeWhile(f)(tail)] : []
const isStark = name => name.toLowerCase().includes('stark')
console.log(takeWhile(isStark)(houses))
// 点评。takeWhile这个函数在其他地方也看到过，看起来还是很不错的

// !使用takewhile控制合适停止。找出数组中的奇数，然后取出前4个
const numList = [1, 3, 11, 4, 2, 5, 6, 7]
const takeFirst = (limit, f, arr) => {
  if (limit === 0 || arr.length === 0) {
    return []
  }
  const [head, ...tail] = arr
  return f(head) ? [head, ...takeFirst(limit - 1, f, tail)] : takeFirst(limit, f, tail)
}
const isOdd = num => num % 2 === 1
console.log(takeFirst(4, isOdd, numList))
// 点评：使用递归可以很好的控制函数的执行情况

// !pipe.辅助函数
const pipe = (...fns) => (...args) => fns.reduce((fx, fy) => fy(fx), ...args)

const numList1 = [1, 3, 11, 4, 2, 5, 6, 7]
const add = x => x + 2
const mul = y => y * 2
// const pipe = (...fns) => (...args) => fns.reduce((fx, fy) => fy(fx), ...args)
let ret = numList1.map(pipe(add, mul))
console.log(ret)
// 点评：需要好好理解并适应且使用这种 -- 函数没有直接显示参数的表达方式
// TODO: 需要花点时间好好理解这里的 pipe 函数

// !一个高级一些的概念 -- Transduce
const filter = (f, arr) =>
  arr.reduce((acc, val) => (f(val) && acc.push(val), acc), [])

const map = (f, arr) =>
  arr.reduce((acc, val) => (acc.push(f(val)), acc), [])
// 点评一：使用reduce来定义 filter 和 map。他们都有一定的共性

filter = f => reducer => (acc, val) => {
  if (f(val)) reducer(acc, val)
  return acc
}
map = f => reducer => (acc, val) => reducer(acc, f(val))
// 点评二：将共通之处提取出来

const pushReducer = (acc, val) => (acc.push(val), acc)
const addReducer = (acc, val) => acc + val

const isEven = x => x % 2 === 0
const add2 = x => x + 2

console.log('test1', numList.reduce(filter(isEven)(pushReducer), []) )
console.log('test2', numList.reduce(map(add2)(addReducer)) )
// 点评三：这种思维还是很新颖。需要消化并在工作中常用

// !使用黑科技.很有意思的一个实现
function *repeatArr (arr) {
  let i = 0
  let len = arr.length
  while(i < len) {
    yield arr[i++]
  }
}
const infiniteNameList = repeatArr(starks)
const wait = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
const fn = async () => {
  for (let name of infiniteNameList) {
    await wait(2000)
    console.log(name)
  }
}
console.log(fn())