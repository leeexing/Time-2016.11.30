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

  Tip: 不要讲参数的位置记反了。prev 这个值很有意思
  */

// !不借助原生高阶函数，定义reduce
const reduce = (f, acc, arr) => {
  if (arr.length === 0) return acc
  let [head, ...tail] = arr
  return reduce(f, f(head, acc), tail)
}
// 点评：有点深奥啊

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