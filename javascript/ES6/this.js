/** 
 * !箭头函数不绑定this
 * 
 *  * 它会捕获其所在(即定义的位置)上下文的this值，作为自己的this值
 *  * 所以，call、apply、bind 方法对于箭头函数来说，只是传入参数，对它的this毫无影响
 * 
 * !箭头函数中的this指向的是定义时的this，而不是执行时的this
 *  
 * !箭头函数作为方法，this指向全局window对象，而普通函数则指向调用它的对象
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