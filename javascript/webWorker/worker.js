/**
 * onmessage    //  onmessage处理函数允许我们在任何时刻，一旦接收到消息就可以执行一些代码，代码中消息本身作为事件的data属性进行使用。
 * postMessage  //  postMessage()方法，将结果回传给主线程
 * close
 * 都是浏览器的全局方法
 * 
 * worker线程中，workers 也可以调用自己的 close  方法进行关闭
 * 
 * importScripts  //  执行时会按照传入 importScripts() 中的文件名顺序进行
 */
onmessage = event => {
  // console.log(event)
  var count = event.data
  var interval = setInterval(function () {
    postMessage(count--)
    !count && clearInterval(interval)
  }, 1000)
}
