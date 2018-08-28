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