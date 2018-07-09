/**
 * seajs加载的模块，好像是必须要有 module.exports 才行
 * 不然加载到的只有一个 undefined
 * 想多了。还是失败了
*/
define((require, exports, module) => {
  class Foo {
    static say (name) {
      return 'hello ' + name
    }
  }
  module.exports = {Foo}
})