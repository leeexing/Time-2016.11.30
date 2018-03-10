/**
 * worker // 专用worker
 * 
 * shareWorker  // 共享 worker
 */

const myWorker = new Worker('worker.js')
const first = document.querySelector('.first')
const second = document.querySelector('.second')

first.onchange = e => {
  myWorker.postMessage([first.value, second.value])
  console.log('Message posted to worker')
}
second.onchange = e => {
  myWorker.postMessage([first.value, second.value])
  console.log('Message posted to worker')
}

myWorker.onmessage = function(e) {
  // result.textContent = e.data;
  console.log(e.data)
  console.log('Message received from worker');
}

const stopElem = document.querySelector('.stop')
stopElem.onclick = e => {
  myWorker.terminate()
}

let shareWorker
if (!!window.ShareWorker) {
  shareWorker = new ShareWorker('shareWorker.js')
}