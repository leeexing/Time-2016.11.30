/** 
 * Redux 学习
 * 
 * redux 是JavaScript状态容器，提供可预测化的状态管理
 * 
 * 要点：
 *  * 应用中所有的stats都已一个对象树的形式存储在一个单一的store中
 *  * 唯一改变state的办法是触发action，一个描述发生什么的对象
 *  * 为了描述action如何改变state树，需要编写reducers。that's it
 * 
 * 使用：
 *  * 应该把要做的修改变成一个普通对象，这个对象被叫做 action，而不是直接修改 state。
 *  * 然后编写专门的函数来决定每个 action 如何改变应用的 state，这个函数叫做 reducer
 * 
 * !参考【https://github.com/react-guide/redux-tutorial-cn/blob/f89c4c5370e899c702ac074b16dececf94a37093/12_final-words.js】
 * !参考【http://www.redux.org.cn/】
*/
const {createStore, combineReducers, applyMiddleware} = require('redux')

const State = {
  name: 'leeing',
  age: 23,
  like: 'NBA'
}
const Users = ['leeing', 'hanna']
// !action 构造器
const setNameActionCreator = name => {
  return {
    type: 'ADD_USER',
    name
  }
}
const asyncAddUserActionCreator = name => {
  return dispath => {
    setTimeout(() => {
      dispath({
        type: 'ADD_USER',
        name
      })
    }, 2000)
  }
}
// !中间件
const thunkMiddleWare = ({dispatch, getState}) => 
  next => 
    action => {
      console.log('middleware action received: ', action)
      return typeof action === 'function' ? action(dispatch, getState) : next(action)
    }

// !加如中间件的createStore
const finalCreateStore = applyMiddleware(thunkMiddleWare)(createStore)

const itemReducer = (state = State, action) => {
  console.log('itemReducer was called with state ', state, ' and action:', action)
  let {type} = action
  switch (type) {
    case 'SAY_SOMETHING':
      return {
        ...state,
        message: action.value
      }
    default:
      return state
  }
}
const userReducer = (state = Users, action) => {
  console.log('userReducer was called with state ', state, ' and action:', action)
  let {type} = action
  switch (type) {
    case 'ADD_USER':
      return [
        ...state,
        action.name
      ]
    default:
      return state
  }
}
const reducer = combineReducers({
  items: itemReducer,
  users: userReducer
})
console.log(reducer)
let store = finalCreateStore(reducer) // 只是将状态存储起来
// let store = createStore(reducer) // 只是将状态存储起来

store.subscribe(_ => {
  console.log('++++ store has been updated. Latest store state: ')
  console.log(store.getState())
})

console.log(store)
console.log(store.getState())
store.dispatch({type: 'SAY_SOMETHING', value: 'good lock'})
// console.log(store.getState())
store.dispatch(setNameActionCreator('天使下凡'))
// console.log(store.getState())
console.log(new Date())
store.dispatch(asyncAddUserActionCreator({filmName: '谍影重重'}))