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