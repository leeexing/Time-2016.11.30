/**
 * 30秒就能理解的js代码片段
 * Array
*/


/**
 * [数组分块]
 * 把一个数组分块成指定大小的小数组
*/
const chunk = (arr, size) =>
  Array.from({length: Math.ceil(arr.length / size)}, (val, i) =>
    arr.slice(i * size, i * size + size)
  )

// TIP:  没有想到要使用第二个参数


/**
 * [过滤掉数组中所有假值元素]
 * 从数组中移除 falsy 值元素
*/
const compact = arr => arr.filter(Boolean)

// TIP:  之前也这么使用过。只是没有想到要进行封装


/**
 * [返回每个分组数组中元素的数量]
 * 根据给定的函数对数组的元素进行分组，并返回每个分组中元素的数量
*/
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : item => item[fn]).reduce((pre, cur) =>
    pre[cur] = (pre[cur] || 0) + 1
  , {})

// TIP: 比较严谨，很少尝试在map中还进行一次判断


/**
 * [计数数组中某个值的出现次数]
*/
const countOccurrences = (arr, val) =>
  arr.reduce((pre, cur) => (pre += cur === val ? 1 : 0), 0)

// TIP: 很是比较简单的


/**
 * [深度平铺数组]
*/
const deepFlatten = arr =>
  [].concat(...arr.map(item => (Array.isArray(item) ? deepFlatten(item) : item)))

// TIP: 能用好递归（最好是尾递归）的都是比较厉害的


/**
 * [数组比较]
 * 返回两个数组之间的差异
*/
const difference = (a, b) => {
  const sb = new Set(b)
  return a.filter(item => !sb.has(item))
}

// TIP: Set(集合)还是很有用的


/**
 * [通过比较函数比较两个数组的差异]
 * 使用 Array.filter() 和 Array.findIndex() 来查找合适的值
*/
const differenceWith = (arrA, arrB, comp) =>
  arrA.filter(item => arrB.findIndex(val => comp(item, val)) === -1)

// TIP:  基本上都是看如何进行函数组合。思路 + 方法，很重要


/**
 * [数组去重]
 * 返回数组的所有不同值
 * 使用 ES6 的 Set 和 ...rest 操作符剔除重复的值
*/
const distinctValuesOfArray = arr => [...new Set(arr)]


/**
 * [删除数组中的元素]
 * 删除数组中的元素，直到传递的函数返回 true 。 返回数组中的其余元素
*/
const dropElements = (arr, fn) => {
  while (arr.length > 0 && !fn(arr[0])) arr = arr.slice(1)
  return arr
}

// TIP:  循环访问数组，使用 Array.slice() 在数组中从第一个元素开始删除，直到函数的返回值为 true


/**
 * 从右开始删除数组元素
 * 返回从右开始删除 n 个元素的新数组
*/
const dropRight = (arr, n = 1) => arr.slice(0, -n)


/**
 * 获得数组中的每个第 n 个元素
*/
const everyNth = (arr, nth) => arr.filter((item, i) => i % nth === nth - 1)

// TIP:  真的就是在靠算法。这样是不是更好理解 (item, i) => (i + 1) % nth === 0



/**
 * 过滤掉数组中的非唯一值
*/
const filterNonUnique = arr => arr.filter(item => arr.indexOf(item) === item.lastIndexOf(item))

// TIP:  很有意思。思路的转变，可以很快的找到解决问题的捷径


/**
 * 返回 提供的函数返回真(truthy)值的最后一个元素
*/
const findLast = (arr, fn) => arr.filter(fn).slice(-1)

// TIP:  其实都是为了写得简便。上面这种写法最后有可能得到的是一个空数组