# inter-util

## 播放音频

> 需要考虑兼容性

```js
const audio = new Audio()
const fileReader = new FileReader()
const audioContext = new AudioContext()

  playMusic(src) {
    audio.src = src
    return audio.play()
  },
  pauseMusic() {
    audio.pause()
  },
  playSound(src) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', src)
    xhr.responseType = 'blob'
    xhr.onload = () => fileReader.readAsArrayBuffer(xhr.response)
    xhr.send()
    fileReader.onload = () => {
      audioContext.decodeAudioData(fileReader.result, result => {
        //创建播放源
        const source = audioContext.createBufferSource()
        source.buffer = result
        //连接输出终端
        source.connect(audioContext.destination)
        //开始播放
        source.start()
      })
    }
  },
```

REFER: https://juejin.im/post/5cbfdd4ee51d456e6f45c721

## 图片懒加载

```js
class LazyLoad {
  constructor (el) {
    this.imgList = Array.from(document.querySelector(el))
    this.init()
  }
  init () {
    this.canILoad()
    this.bindEvent()
  }
  bindEvent () {
    window.addEventListener('scroll', () => {
      this.canILoad()
    })
  }
  canILoad () {
    this.imgList.forEach((item, index) => {
      this.getBound(item) && this.loadImage(item, index)
    })
  }
  getBound (el) {
    let bound = el.getBoundingClientRect(el)
    let clientHeight = window.innerHeight
    return bound.top <= clientHeight - 100 // -100是为了看到效果，可以去掉
  }
  loadImage (el, index) {
    let src = el.getAttribute('data-origin')
    el.src = src
    this.imgList.splice(index, 1)
    this.checkImage(el)
  }
  checkImage (el) {
    el.onload = () => {
      el.className = 'origin'
    }
  }
}

const lazy = new LazyLoad('.lazy')

```

## 对象深拷贝

```js
const deepCopy = input => {
  if (input instanceof Object) {
    if (Array.isArray(input)) {
      return input.map(deepCopy)
    }
    let output = {}
    Object.entries(input).forEach([key, value] => {
      output[key] = deepCopy(value)
    })
    return output
  }
  return input
}

// 挺新奇的一种写法。学习了
```
