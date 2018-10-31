/** 
 * 
 * 所有对象继承了两个转换方法：
 * 第一个是toString(),它的作用是返回一个反映这个对象的字符串
 * 第二个是valueOf(),它的作用是返回它相应的原始值
*/

const arr = [1,5,9,5,6,2,1,5,9]

console.log(
  arr.toString(),
  arr.valueOf()
)