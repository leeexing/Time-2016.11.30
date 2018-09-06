/** 
 * 利用redux做一个简单的计数器
*/
const {createStore} = require('redux')

const counterReducer = (state = 0, action) => {
  console.log('counterReducer was called with state ', state, 'and action', action)
  const {type} = action
  switch (type) {
    case 'INCREASE':
      return state += 1
    case 'DECREASE':
      return state -= 1
    default:
      return state
  }
}
const store = createStore(counterReducer)
console.log(store)
// 订阅
store.subscribe(() => {
  console.log(store.getState())
})
// 分发
store.dispatch({type: 'INCREASE'})
store.dispatch({type: 'INCREASE'})
store.dispatch({type: 'DECREASE'})