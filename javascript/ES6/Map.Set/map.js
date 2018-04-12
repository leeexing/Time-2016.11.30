/**
 * 听说 object 
 * JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键
 * 如果只是简单的 key：value结构，建议优先使用 Map。
 * 因为Map提供方便的遍历机制
 * 所以 --
 * 是时候好好深入了解一下map
 */

/**
 * 0.Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现
 * 1、map 的构造参数，是一个 二维数组：元素数组的元素分别是 键 和 值
 * 2、理解了第一点。map 的“键”的范围不限于字符串，各种类型的值（包括对象）都可以当键值
 * 3、map.keys\values 返回的不是一个 array 数据格式，而是一个 遍历器 ，不能使用 forEach 等方法进行遍历。需要使用 for...of 进行遍历获取元素
 * 4、但是 map 实例本身是可以使用 forEach 进行遍历的。同时 Map 的 遍历顺序 就是 插入顺序
 * 5、如果对同一个键多次赋值，后面的值将覆盖前面的值。
 * 6、只有对同一个对象的引用，Map 结构才将其视为同一个键。下面的 o 就是同一个对象。如果换了 {say: 'hi'} 就是另一个对象了。Map的键实际上是跟内存地址绑定的
 */
let o = {say: 'hi'}
let arr = [[1, 'x'], [2, 'y'], [3, ['a', 'b']], ['engineer', {name: 'leeing', age: 23}], [o, {what: 'hello, world'}]]
let map = new Map(arr)

map.forEach((value, key, map) => {
  console.log(value, key)
})

// items.forEach(
//   ([key, value]) => map.set(key, value)
// );

console.log(map)
// Map(4) {1 => "x", 2 => "y", 3 => "z", "leeing" => {…}}

console.log(map.has(o)) // true
console.log(map.delete(2)) // true


// map 类型的数据，提供的方法只有 set 和 get。搭配 keys，values，entries; size, delete, 和很实用的 has
map.set('city', {name: 'beijing', population: '100W', culture: 'freedom'})

console.log(map.keys(), map.values())
// MapIterator {1, 2, 3, "engineer", "city"} MapIterator {"x", "y", "z", {…}, {…}}

// 使用 for ... in 进行遍历 无效
for(let item in map.values()) {
  console.log(item) // undefined
}

// 可以使用 for ... of 进行遍历操作获取键值
for (let value of map.values()) {
  console.log(value)
}

// 可以使用基础解构获取；一下两种方式相同
// for(let [key, value] of map)
for(let [key, value] of map.entries()) {
  console.log(key, value)
}

// 既然 map.values 等返回的是遍历器，那么久可以很好的使用 扩展运算符 的方式获取里面的键值
let map_values = [...map.values()]
console.table(map_values)

// 结合数组的 map、filter 方法，实现 Map 的遍历和过滤
// 注意，直接结构 map 数据的时候，元素是一个 数组 （[key, value]）
console.log([...map]) // [Array(2), Array(2), Array(2), Array(2), Array(2)]

let map_map = new Map(
  [...map].map(([key, value]) => [key, value])
)

let map_filter = new Map(
  [...map].filter(([key, value]) => key === 1)
)
console.log(map_filter)

// Map 转为 对象
// 注意：如果键名为 object 数据类型，转为对象的时候键名是 '[object Object]'
function map_to_obj(map) {
  let obj = {}
  for (let [key, value] of map) {
    obj[key] = value
  }
  return obj
}
console.log(map_to_obj(map))


/**
 * WeakMap
 * 区别有两点：
 * 1、只接受对象作键名，不接受其他类型的值作为键名
 * 2、键名所指向的对象，不计入垃圾回收机制；WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用
 * WeakMap的设计目的在于，在某个对象上面存放一些数据，但是这会形成对于这个对象的引用
 * 由于，WeakMap的键名所引用的对象都是 弱引用，即 垃圾回收机制不将该引用考虑在内。
 * 所以
 * 只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存
 * 也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用
 * 总之
 * WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。
 */

 /**
  * 操作上面
  * 一是没有遍历操作（即没有key()、values()和entries()方法），也没有size属性
  */
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"

// 这时，WeakMap 里面对element的引用就是弱引用，不会被计入垃圾回收机制