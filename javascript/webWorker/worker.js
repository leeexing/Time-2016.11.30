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
if ('function' === typeof importScripts) {
  importScripts('main.js')

  let options = {
    version: 4,
    tableName: 'customers',
    createIndexName: ['name', 'age', 'email']
  }    
  const request = new IndexedDB(options)
  
  onmessage = function(e) {
    console.log('%c Message received from index script ', 'background: #1890ff');
    let type = e.data[0]
    let queryNum = e.data[1] === '' ? 1 : +e.data[1]
    switch (type) {
      case 'close':
        close()
        break;
      case 'add':
        addIndexData()
        break;
      case 'get':
        getIndexData(queryNum).then(data => {
          postMessage(data)
        })
        break;
      default:
        postMessage(e.data)
    }
    // var workerResult = 'Result: ' + (e.data[0] + ' - ' + e.data[1]);
    // console.log('Posting message back to index script');
    // setTimeout(() => {
    //   postMessage(workerResult);
    // }, 2000)
  }

  function getIndexData(queryNum) {
    return new Promise(resolve => {
      let store = request.db.transaction('customers', 'readwrite').objectStore('customers')
      store.get(queryNum).onsuccess = e => {
        // console.log(e.target.result)
        resolve(e.target.result)
      }
    })
  }
  function addIndexData() {
    let str = '123456789545478'
    let dataArr = []
    str.split('').forEach((item, index) => {
      let data = {
        id: index + 1,
        name: 'leeing-' + index,
        age: 24 + (+item),
        email: `674023427${item}@qq.com`
      }
      dataArr.push(data)
    })
    request.add(dataArr).then(data => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  }
} // if end



