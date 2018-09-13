/**
 * !Vue 源码学习
 */
function Vue () {
  this._data = 'leeing'
}
let dataDef = {}
dataDef.get = function(){return this._data}
dataDef.set = function(){
  throw new Error('不能进行赋值，老子最大！')
}
Object.defineProperty(Vue.prototype, '$data', dataDef)

const vue = new Vue()
console.log(vue)
console.log(vue.$data)
vue.$data = 'I want to set value'
