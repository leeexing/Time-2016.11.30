/**
 * EventEmitter
 * 通过一个例子来学习如何编写函数式代码
 */

// 1、最初是这样的
class EventEmitter {
  constructor() {
    this.events = new Map()
  }
  addEventListener(event, fn) {
    if (this.events.has(event)) {
      this.events.set(event, [...this.events.get(event), fn])
    } else {
      this.events.set(event, [fn])
    }
  }
  dispatchEvent(event) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(fn => fn())
    }
  }
}

// 2、通过拆解，使用函数的方式
let eventsMap = new Map()
let addEventListener = (event, fn) => {
  if (eventsMap.has(event)) {
    eventsMap.set(event, [...eventsMap.get(event), fn])
  } else {
    eventsMap.set(event, [fn])
  }
}
let dispatchEvent = event => {
  eventsMap.get(event) && eventsMap.get(event).forEach(fn => fn())
}

// 3、进一步解耦，不依赖外部变量而变得更纯
let addEventListener = (event, fn, newMap) => {
  return newMap.has(event) ?
        new Map(newMap.set(event, [...newMap.get(event), fn])) :
        new Map(newMap.set(event, [fn]))
        // new Map([[event, [...newMap.get(event), fn]]]) : 这样写不是很好.中括号太多
        // new Map([[event, [fn]]])
}
let dispatchEvent = (event, eventMap) => {
  return (eventsMap.has(event) && eventsMap.get(event).forEach(fn => fn())) || event
}

//4、currying 化处理
let addEventListener = fn => event => newMap => 
                                    newMap.has(event) ? 
                                      new Map(newMap.set(event, [...newMap.get(event), fn])) : 
                                      new Map(newMap.set(event, [fn]))

let dispatchEvent = event => eventsMap => (eventsMap.has(event) && eventsMap.get(event).forEach(fn => fn())) || event

// 5、使用
let log = x => conosle.log(x) || x   // 🎈很巧妙的一个写法；重点在分析这个函数的结构。分析错了，完全不一样
let eventsMap = addEventListener(() => log('hi'))('hello')(new Map())
dispatchEvent('hello')(eventsMap) // hi