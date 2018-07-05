/**
 * 正则表达式中的 test 方法
 * 
 * 可以通过 RegExp.$1[,$2] 获取到匹配的数据
 */
let arr = [1,2,3,4]
arr.next = function(a, b, c) {
  console.log(this)
  this.push({
    fn: a,
    dir: b,
    last: c
  })
  return arr
}
let a = arr.shift()
console.log(a)

const key = 'leeing_token'
let key_en = new Buffer(key).toString('base64')
console.log(key_en)
let key_de = new Buffer(key_en, 'base64').toString()
console.log(key_de)

