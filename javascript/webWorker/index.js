/**
 * worker // 专用worker
 * 
 * shareWorker  // 共享 worker
 */
$(() => {
  const myWorker = new Worker('worker.js')
  const first = document.querySelector('.first')
  const second = document.querySelector('.second')
  
  $(first).on('keydown', function(e) {
    if (e.keyCode === 13) {
      let value = +$(this).val()
      myWorker.postMessage(value)
      console.log('Message posted to worker')
    }
  })
  
  myWorker.onmessage = function(e) {
    console.log(e.data)
    console.log('Message received from worker');
  }
  
  const stopElem = document.querySelector('.stop')
  stopElem.onclick = e => {
    myWorker.terminate()
  }

})

// let shareWorker
// if (!!window.ShareWorker) {
//   shareWorker = new ShareWorker('shareWorker.js')
// }