/** 
 * 利用redux做一个简单的todos
 * 
*/
const {createStore, combineReducers} = require('redux')

let State = {
  todos: [
    {
      text: '上班',
      completed: false
    }, {
      text: '午休',
      completed: false
    }
  ],
  visibilityFilter: 'SHOW_COMPLETED'
}
const todosReducer = (state = State.todos, action) => {
  console.log('todosReducer was called with state ', state, 'and action', action)
  const {type} = action
  switch (type) {
    case 'ADD_TODO':
      return state.concat([{text: action.text, completed: false}])
    case 'DELETE_TODO':
      state.splice(action.index, 1)
      return state
    case 'TOGGLE_TODO':
      return state.map((item, index) => 
        action.index === index ? {text: item.text, completed: !item.completed} : item
      )
    default:
      return state
  }
}
const visibilityFilterReducer = (state = 'SHOW_ALL', action) => {
  const {type} = action
  switch (type) {
    case 'SET_VISIBLE_FILTER':
      return action.filter
    default:
      return state
  }
}
// !没有使用任何API的写法
// const todosApp = (state = {}, action) => {
//   return {
//     todos: todosReducer(state.todos, action),
//     visibleFilter: visibilityFilterReducer(state.visibilityFilter, action)
//   }
// }
// const store = createStore(todosReducer)
// const store = createStore(visibilityFilterReducer)
// const store = createStore(todosApp)

const reducer = combineReducers({
  todos: todosReducer,
  visible: visibilityFilterReducer
})
const store = createStore(reducer)

// console.log(store)
// 订阅
let unsub = store.subscribe(() => {
  console.log(store.getState())
})
console.log(unsub(), '取消订阅函数')
// 分发
store.dispatch({type: 'ADD_TODO', text: '下班'})
store.dispatch({type: 'TOGGLE_TODO', index: 1})
store.dispatch({type: 'DELETE_TODO', index: 1})
store.dispatch({type: 'SET_VISIBLE_FILTER', filter: 'SHOW_NOT_COMPLETED'})
store.dispatch({type: 'NONE', filter: 'SHOW_NONE'})