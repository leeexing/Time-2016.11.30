/** 
 * 一个简单的应用
 * 监控数据的变化
*/

function Archiver () {
  let value = null
  let archiver = []

  Object.defineProperty(this, 'num', {
    get () {
      console.log('get ...')
      return value
    },
    set (val) {
      console.log('set ...')
      value = val
      archiver.push({val})
    }
  })

  this.getArchiver = () => archiver
}

let arc = new Archiver()
arc.num
arc.num = 12
arc.num = 15
console.log(arc.getArchiver())