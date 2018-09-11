/**
 * ramda学习的一些小例子。希望能在平时的工作中用上
 */
const R = require('ramda')

// !例子一
function example1() {
  const data = [
    {name: '张三', role: 'worker'},
    {name: '李四', role: 'worker'},
    {name: '王五', role: 'manager'},
  ]
  
  const prop = (p, obj) => obj[p]
  const propRole = R.curry(prop)('role')
  const isworker = s => s === 'worker'
  const getWorkers = R.filter(R.pipe(propRole, isworker))
  console.log(getWorkers(data))
}

// !例子二
function example2 () {
  const str = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';

  const getLonggestWordLength = R.pipe(
    R.split(' '),
    R.map(R.length),
    R.reduce(R.max, 0)
  )
  console.log(getLonggestWordLength(str))
}

// !例子三
function example3 () {
  const obj = [{a: 12, b: 'dd'}, {a: 45, c: 'c:c'}, {a: 20}]

  console.log(R.map(R.pick('a')(obj)))
}

// !demo4
function example4 () {
  const queryString = "?page=2&pageSize=10&total=203";

  const parseQs = R.compose(
    R.fromPairs,
    R.map(R.split('=')),
    R.split('&'),
    R.tail
  )
}

// !demo5
function example5 () {
  const alice = {name: 'ALICE', age: 101}
  const bob = {name: 'Bob', age: -12}
  const clark = {name: 'clack', age: 31.1415}
  
  const sortByName = R.sortBy(
    R.compose(R.toLower, R.prop('name'))
  )

  const sortByAge = R.sortBy(
    R.compose(Math.abs, R.prop('age'))
  )

  const arr = [clark, alice, bob]
  console.log(sortByName(arr))
  console.log(sortByAge(arr))
}

R.type([])
R.uniq([1,2,2,3,1,1])
R.pipe(R.multiply(2), R.add(2), R.divide(2))
R.contains({name:'leeing'})([{name: 'leeing'}, {name:'hanna'}])
R.flatten([1,2,[3,[4,5,6]]])
R.union([1,2,3],[2,3,4]) // [1,2,3,4]
R.invertObj({first: 'Lucy', second: 'Tom', third: 'Lucy'}) // {Lucy: 'Third', Tom: 'second'}
R.invert({first: 'Lucy', second: 'Tom', third: 'Lucy'}) // {Lucy: ['first', 'Third'], Tom: ['second']}



// !逻辑运算
R.allPass([gt10, even])(arr)
R.T() // true 永远返回 true 的函数

// !柯里化
const productOfArr = arr => {
  let product = 1
  arr.forEach(item => product *= item)
  return product
}
let count = 0
R.memoize( n => {
  count += 1
  return productOfArr(R.range(1, n + 1))
})
R.replace('{name}', R.__, 'Hello, {name}')('leeing') // Hello, leeing; * 特别注意 R.__ == _. 是ramda中柯里化函数的参数占位符


// !函数的执行
R.tap(x => console.log('x is', x))(100) // 100；将一个值传入指定函数，并返回该值
R.pipe(
  R.assoc('a', 2),
  R.tap(console.log),
  R.assoc('a', 3)
)({a: 1}) // {a: 3}
const zipFn = (x, y) => x + y
R.zipWith(zipFn, [1,2,3])(['a', 'b', 'c']) // !将两个数组对应位置的值，一起作为参数传入某个函数。[f(1, 'a'), f(2, 'b'), f(3, 'c')]
R.ascend(R.prop('age')) // 返回一个升序排列的比较函数，主要用于排序
R.sort(
  R.ascend(R.prop('age'))
)(peopleArr)
R.sort(
  R.descend(R.prop('score')) // 返回一个降序排列的比较函数，主要还是用于排序
)(studentScores)
R.sortBy() // !这个不需要使用 descend 或者 ascend
R.sortWith(
  [
    R.descend(R.prop('age')),
    R.descend(R.prop('name'))
  ]
)(people) // 依据比较函数列表对输入列表进行排序

// !数组的截取和添加
R.head(['hi', 'hanna', 'beautiful']) // hi
R.last(['hi', 'hanna', 'beautiful']) // beautiful
R.tail(['hi', 'hanna', 'beautiful']) // ['hanna', 'beautiful']
R.tail('beautiful') // eautiful
R.init(['hi', 'hanna', 'beautiful']) // ['hi', 'hanna']

// !数组的过滤
const isNotFour = n => n !== 4
const isLtTwo = n => x <= 2
R.takeWhile(isNotFour)([1,2,5,4,1,2,3]) // !一旦条件满足，后面的成员都会被过滤。[1,2,5]
R.dropWhile(isLtTwo) // !一旦【不】满足条件，取出剩余的所有值
R.without([1,2])([1,4,7,8,5,2]) // [4,7,8,5] 返回指定值以外的成员

// ! 但数组运算
R.countBy(Math.floor)([1.0, 1.1, 1.2, 2.0, 3.0, 2.2]) // {'1': 3, '2': 2, '3': 1}
R.splitEvery
R.splitWhen(R.equals(2))([1,4,7,8,5,2]) // 以第一个满足指定函数的成员为界，将数组分成两个部分


// !符合数组
R.find(R.propEq('a', 2))([{a: 1}, {b:2},{a:2}]) // {a:2}
R.findLastIndex(R.propEq('a', 2))([{a: 1}, {b:2},{a:2}, {a: 2, c:3}]) // *多出也可以
R.pluck('a')([{a:2}, {a:3}]) // [2,3] 取出数组成员的某个属性，组成一个新的数组
R.project(['a', 'b'])([{a: 1, b: 2, c:3}, {a:45, b: 63, c: 89}]) // [ { a: 1, b: 2 }, { a: 45, b: 63 } ] 取出多个属性
R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) // 将每个成员相同位置的值，组成一个新数组
R.fromPairs([['a', 1], ['b', 2], ['c', 3]]) // !将嵌套数组转为一个对象。{a: 1, b: 2, c: 3}
const byGrade = R.groupBy(function(student) { // !将数组成员按照指定条件分组
  const score = student.score;
  return score < 65 ? 'F' : // todo：这种写法可以尝试一下
         score < 70 ? 'D' :
         score < 80 ? 'C' :
         score < 90 ? 'B' : 'A';
});
const students = [{name: 'Abby', score: 84},
                {name: 'Eddy', score: 58},
                // ...
                {name: 'Jack', score: 69}];
byGrade(students);
// {
//   'A': [{name: 'Dianne', score: 99}],
//   'B': [{name: 'Abby', score: 84}]
//   // ...,
//   'F': [{name: 'Eddy', score: 58}]
// }

// !对象的特征判断
R.whereEq({a:1, b: 2})({a:1}) // false.如果属性等于给定值（少了不行，多了可以）


// !对象的过滤
R.pick(['a', 'd'])({a:1, b:2, c:3, d:4}) // {a:1, d:4}
R.omit(['a', 'd'])({a:1, b:2, c:3, d:4}) //! 过滤指定属性。这个看看起来比较好 {b: 2, c: 3} 
const testArr = [{a: 1, b:2, c:3, d:4}, {a:2,b:3,c:4,d:5}]
console.log(
  R.map(R.omit(['a','c']))(testArr)
)
// * reject 返回所有不满足条件的属性。和filter相反
const isEven = n => n % 2 === 0
console.log(
  R.map(R.reject(isEven))(testArr)
)

// !对象的截取
R.dissoc('b')({a:1, b:2, c:3}) // {a:1, c:3}
R.assoc('c', 4)({a:1, b:2}) // {a:1, b:2, c:4} 添加或改写某个属性
R.partition(R.contains('e'))({a: 'leeing', b: 'nanam', c:'goddess'}) // [{a: 'leeing', c:'goddess'}, { b: 'nanam'}] 根据属性值是否满足给定条件，将属性区分
R.pick(['a', 'e'])({a:2,b:2,c:3}) // {a:1}
R.pickAll(['a', 'e'])({a:2,b:2,c:3}) // {a:1, e: undefined} pickAll会包含不存在的属性
const isUpperCase = (val, key) => key.toUpperCase() === key
R.pickBy(isUpperCase)({a:1, B:2, c:3, D:4}) // {B:2, D:4}

// !对象的运算
R.prop('name')({name: 'leeing'}) // leeing
R.mapObjIndexed((val, key, obj) => console.log(val, key, obj)) // 显示的多一个键和值的参数
R.merge({name: 'leeing', age: 23})({age: 24}) // * 合并对象，有同名属性，后面的值会覆盖前面的值
R.mergeWith(
  R.concat,
  {a: 1, name: 'leeing'},
  {b: 2, name: 'hanna'}
) // {a: 1, b: 2, name: ['leeing', 'hanna']};有同名的属性，会使用给定的函数处理

// !复合对象
R.path(['a', 'b'])({a: {b: 2}}) // 2

// ! lens 比较新颖。 相当于封装了 getter 和 setter 方法
const aLens = R.lens(R.prop('a'), R.assoc('a')) // * assoc 相当于 setters
const obj = [{a: 12, b: 'dd'}, {a: 45, c: 'c:c'}, {a: 20, d: 'leing'}]
R.view(aLens,obj[0])
R.set(aLens, 5, obj[1])
R.over(aLens, R.add(8), obj[2])