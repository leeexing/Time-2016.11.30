# inter-html

> html一些不知道的知识点

## Manifest.json

Manifest.json文件是h5+移动app的配置文件，用于指定应用的显示名称、图表、应用入口文件地址及需要使用的设备权限等信息。

## 自定义触发事件

```js Event
window.onresize = (e) => {
  console.log(e)
  console.lgo('自定义事件')
}

window.dispatchEvent(new Event('resize'))
```

```js customEvent
// add an appropriate event listener
obj.addEventListener("cat", function(e) { process(e.detail) });

// create and dispatch the event
var event = new CustomEvent("cat", {"detail":{"hazcheeseburger":true}});
obj.dispatchEvent(event);
使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：
```

## Worker

使用了以下，感觉还是挺好用的。没有那么的复杂。交互主要还是通过消息传递

```js worker.js
let timeUsed = 0
let timer = null
let totalTime = null
let intervalTime = null

function countdownStart() {
    timer = setInterval(() => {
        timeUsed += 1
        if (timeUsed > totalTime) {
            clearInterval(timer)
            postMessage({
                action: 'submit'
            })
        }
        if (timeUsed % intervalTime === 0) {
            postMessage({
                action: 'save'
            })
        }
        postMessage({
            action: 'countdown',
            payload: totalTime - timeUsed
        })
    }, 1000)
}

onmessage = ({ data }) => {
    if (data.action === 'start') {
        totalTime = data.payload.totalTime
        intervalTime = data.payload.intervalTime
        countdownStart()
    }
    if (data.action === 'end') {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    }
}
```

```js consumer.js
this.timeRemaingElem = $('.j-time')
this.worker = new Worker('/static/3D/js/training/worker.js')
this.worker.onmessage = ({ data }) => {
    if (data.action === 'countdown') {
        this.timeRemaingElem.html(formatSecondsNoUnit(data.payload))
    }
    if (data.action === 'save') {
        onSaveCb && onSaveCb()
    }
    if (data.action === 'submit') {
        onSubmitCb && onSubmitCb()
        this.worker.postMessage({ action: 'end' })
    }
}
```

## FileReader

> 前端进行文件处理很重要的一个API

平时用的少，但是一些关键的地方，使用这个很重要
特别是对图片的处理，知道图片的处理原理，必须要掌握它

```js
const reader = new FileReader()

// 将文件读取为 arrayBuffer
reader.readAsArrayBuffer(file) // or res.response
reader.readAsDataURL(file) // res.response
reader.readAsText(file)
reader.readAsBinaryString(file)

reader.onprogress = (e) => {
  console.log(e.loaded / e.total)
}

reader.onload = () => {
  console.log(reader.result)
}

reader.onerror = e => {
  console.log(e.code)
}
```

## ArrayBuffer

> 内存中的一段二进制数据， 不能直接读写。js操作二进制数据的一个接口。设计初衷和 webgl 有关

一直对这个API很恐惧啊。需要花点时间去了解熟悉他

### 作用

减少浏览器和显卡通信成本，提升性能。

传统的ja与显卡之间传递的是文本格式（32位整数），需要在显卡端转化为二进制数据，如果数据量比较大，这将十分的耗时。感觉直接在前端就进行数据格式的转换

### 应用

很多浏览器的操作API需要使用二进制数组操作二进制数据

File API
XMHLHttpRequest
Fetch API
Canvas
WebScoket

REFER:
[ES^-ArrayBuffer](https://www.jianshu.com/p/5a841d6d7cc3)

## AudioContext API

> 查看以下自己封装的组件

```js
const AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext

class Music {
  constructor() {
    this.musics = {}
    this.init()
  }
  init() {
    this.audioContext = new AudioContext()
    this.isSuspend = false
  }
  async start(url) {
    if (this.isSuspend) {
      this.audioContext.resume()
    }
    await this.getMusicSource(url)
  }
  pause() {
    this.isSuspend = true
    this.audioContext.pause()
    // this.audioContext.suspend()
  }
  async getMusicSource(url) {
    if (this.musics[url]) {
      return this.play(this.musics[url])
    }
    this.musics[url] = await this.fetchSource(url)
    return this.play(this.musics[url])
  }
  play(buf) {
    this.source = this.audioContext.createBufferSource()
    this.source.buffer = buf
    this.source.connect(this.audioContext.destination)
    this.source.start()
  }
  fetchSource(url) {
    return new Promise((res, rej) => {
      const req = new XMLHttpRequest()
      req.open('GET', url, true)
      req.responseType = 'arraybuffer'
      req.onload = () => {
        this.audioContext.decodeAudioData(req.response,
          buf => res(buf),
          err => console.error('音频：%s 读取错误', url, err)
        )
      }
      req.send()
    })
  }
}
```

下面这种写法也是可以。充分的利用了闭包，将请求到的数据保存下来
这里有一个要求，就是 `music.mp3` 是一个合成的音频，里面有很多的音效音频

```js
  const music = {}
  const url = './music.mp3'
  const context = new AudioContext()
  const req = new XMLHttpRequest()
  req.open('GET', url, true)
  req.responseType = 'arraybuffer'

  req.onload = () => {
    context.decodeAudioData(
      req.response,
      buf => {
        // 将拿到的audio解码转为buffer
        const getSource = () => {
          // 创建source源。
          const source = context.createBufferSource()
          source.buffer = buf
          source.connect(context.destination)
          return source
        }
        music.killStart = () => {
          // 游戏开始的音乐只播放一次
          music.start = () => {}
        }
        music.start = () => {
          // 游戏开始
          // music.killStart()
          getSource().start(0, 0, 1)
          // getSource().start(0, 3.7202, 3.6224)
        }
        music.clear = () => {
          // 消除方块
          getSource().start(0, 0, 0.7675)
        }
        music.fall = () => {
          // 立即下落
          getSource().start(0, 0, 5)
          // getSource().start(0, 1.2558, 0.3546)
        }
        music.gameover = () => {
          // 游戏结束
          getSource().start(0, 8.1276, 1.1437)
        }
      },
      error => {
        if (window.console && window.console.error) {
          window.console.error(`音频: ${url} 读取错误`, error)
          hasWebAudioAPI.data = false
        }
      }
    )
  }

  req.send()
```

### 注意点

1. 播放其实是一个简单的 API，直接调用 BufferSourceNode （其实就是 createBufferSource 生成的对象）的 start 方法即可。
  start 方法有两个我们会用到的参数，第一个是开始时间，第二个是时间位移：决定了我们从什么时候开始，这将在跳播的时候有用
  另外一个值得注意的点是，不能在同一个 bufferSourceNode 上调用两次 start 方法，否则会报错
2. 因为不能在同一个 audioBufferSource 上使用 start 两次，只能在不同的 audioBufferSource 上 start，也就是创建一个新的节点，依旧使用 ajax 请求到的数据来创建一个音频数据
3. 列表循环用到 bufferSource 上的一个回调方法，onended，在播放完成之后就自动执行下一个音频

其他参考
1、[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)
2、[模拟制作网易云音乐](https://www.cnblogs.com/rynxiao/p/7798419.html)

## IntersectionObserver

> 交叉观察者

```js
const box = document.querySelector('.box');
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((item) => {
    if (item.isIntersecting) {
      console.log('进入可视区域');
    }
  })
});
intersectionObserver.observe(box);

```
