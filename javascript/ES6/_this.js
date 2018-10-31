/** 
 * !箭头函数不绑定this
 * 
 *  * 它会捕获其所在(即定义的位置)上下文的this值，作为自己的this值
 *  * 所以，call、apply、bind 方法对于箭头函数来说，只是传入参数，对它的this毫无影响
 * 
 * !箭头函数中的this指向的是定义时的this，而不是执行时的this
 *  
 * !箭头函数作为方法，this指向全局window对象，而普通函数则指向调用它的对象
 *  * 箭头函数的this绑定看的是this所在的函数定义在那个对象下，绑定到哪个对象则this就指向哪个对象
 *  * 如果有对象嵌套的情况，则this绑定到最近的一层对象上
*/

/**
 * 摘抄一些学习总结
 * 
 * 1、普通函数中，this指向window对象呢
 * 2、函数作为对象的属性，函数中的this指向调用函数的对象呢
 * 3、在构造函数中，this指向构造函数的实例对象呢
 * 4、在call和apply中，this指向第一个参数，即被扩展的作用域对象
*/
const obj = {
  name: 'leeing',
  say: () => console.log(this.name, this), // * undefined, windwo
  hello: function() {
    console.log(this.name, this)  // * leeing, obj
  },
  tell: function() {
    setTimeout(() => {
      console.log(this.name) // ? leeing or undefined
    }, 500)
  }
}
obj.say()
obj.tell()
obj.hello()