# http

## TCP

1. 三次握手
2. 四次挥手
3. 滑动窗口: 流量控制
4. 拥塞处理
  慢开始
  拥塞避免
  快速重传
  快速恢复

### TCP三次握手

> 建立连接前，客户端和服务端需要通过握手来确认对方:

1. 客户端发送 syn(同步序列编号) 请求，进入 syn_send 状态，等待确认
2. 服务端接收并确认 syn 包后发送 syn+ack 包，进入 syn_recv 状态
3. 客户端接收 syn+ack 包后，发送 ack 包，双方进入 established 状态

### TCP四次挥手

1. 客户端 -- FIN --> 服务端， FIN—WAIT
2. 服务端 -- ACK --> 客户端， CLOSE-WAIT
3. 服务端 -- ACK,FIN --> 客户端， LAST-ACK
4. 客户端 -- ACK --> 服务端，CLOSED

## 缓存策略

> 可分为 强缓存 和 协商缓存

1. Cache-Control/Expires: 浏览器判断缓存是否过期，未过期时，直接使用强缓存，Cache-Control的 max-age 优先级高于 Expires
2. 当缓存已经过期时，使用协商缓存
  * 唯一标识方案: Etag(response 携带) & If-None-Match(request携带，上一次返回的 Etag): 服务器判断资源是否被修改，
  * 最后一次修改时间: Last-Modified(response) & If-Modified-Since (request，上一次返回的Last-Modified)
    * 如果一致，则直接返回 304 通知浏览器使用缓存
    * 如不一致，则服务端返回新的资源

Last-Modified 缺点
  * 周期性修改，但内容未变时，会导致缓存失效
  * 最小粒度只到 s， s 以内的改动无法检测到

Etag 的优先级高于 Last-Modified