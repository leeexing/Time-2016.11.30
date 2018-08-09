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