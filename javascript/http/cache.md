# http 缓存

## 缓存相关的 header

* Expires             资源的过期时间
* Cache-Control       缓存控制字段
* if-Modified-Since   资源最近修改时间，由浏览器告诉服务器
* Last-Modified       资源最近修改时间，由服务器告诉浏览器
* Etag                资源标识，由服务器告诉浏览器
* if-None-Match       缓存资源标识，由浏览器告诉服务器

配对使用的字段

1. if-modified-since 和 last-modified
2. etag 和 if-none-match

浏览器先检查 Cache-Control，如果有，则以 Cache-Control 为准，忽略 Expires。如果没有 Cache-Control，则以 Expires 为准。

可以加上版本号

```js
<script src="http://test.com/a.js?version=0.0.1"></script>
```

### if-modified-since

小计

2018-08-28

```js
XMLHttpRequestProgressEvent
    bubbles: false
    cancelBubble: false
    cancelable: true
    clipboardData: undefined
    currentTarget: undefined
    defaultPrevented: false
    eventPhase: 2
    lengthComputable: false
    loaded: 4982035
    position: 4982035
    returnValue: true
    srcElement: undefined
    target: undefined
    timeStamp: 1323097256269
    total: 18446744073709552000
    totalSize: 18446744073709552000
    type: "progress"
    __proto__: XMLHttpRequestProgressEvent
```

之前遇到的一个问题，就是直接通过 xhr get nginx 配置的图像地址时，报了一个 `XMLHttpRequestProgressEvent` 错误

问题出在

```js
xhr.setRequestHeader('If-Modified-Since','0')
```

这里是为了清除缓存才加上这么一句代码，没想到会给自己挖了一个大坑。调试了很久才发现问题出现在这里

早知道就用 时间戳 来清除缓存了