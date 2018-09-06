/**
 * Redux 学习
 * 
 * * reducer函数最重要的特征就是，他是一个纯函数。所以要做到：不能改写参数，不能调用IO的API，不能调用Date.now等不纯的方法
 */

 // !简单模拟实现redux中的 createStore
 const createStore = (reducer) => {
   let state
   let listeners = []

   const getState = () => state

   const dispatch = action => { // !用户发出action，store自动调用 Reducer，并返回新的 state
     state = reducer(state, action)
     listeners.forEach(listener => listener())
   }

   const subscribe = listener => { // !返回的结果是一个函数（unsubscribe）。调用该函数，就将之前传进来的回调函数从监听队列面上删除，更新监听队列
     listeners.push(listener)
     return () => {
       listeners = listeners.filter(item => item !== listener)
     }
   }

   dispatch({}) // !所以理解了为什么初始化的时候也会调用一次reducer

   return {getState, dispatch, subscribe}
 }

 // !combineReducers的简单实现
 const combineReducers = reducers => {
  return (state={}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action)
        return nextState
      },
      {}
    )
  }
}