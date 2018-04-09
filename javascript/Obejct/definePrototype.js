/**
 * 重新理解 definePrototype
 */
let song = '发如雪'
let obj = {
  singer: '周杰伦'
}
Object.defineProperty(obj, 'music', {
  // value: '七里香,
  configurable: true,
  // writable: true,
  enumerable: true,
  // 🎈 get、set 设置时不能设置 value 和 writable。他们代替了两者且时互斥的
  get () {
    return song
  },
  set (val) {
    song = val
  }
})