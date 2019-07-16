# inter-http

## 请求报文示例

![请求报文](https://github.com/semlinker/awesome-http/raw/master/images/http-resource-3.png)

```js
GET / HTTP/1.1          <----请求行： 请求方法、URL 和 HTTP 协议版本组成，它们之间用空格分开
Host: www.baidu.com     <----请求头： 由 key-value 对组成，每行一对，key (键) 和 value (值)用英文冒号 : 分隔
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,id;q=0.4
Cookie: PSTM=1490844191; BIDUPSID=2145FF54639208435F60E1E165379255; BAIDUID=CFA344942EE2E0EE081D8B13B5C847F9:FG=1;
                        <-----空行: 最后一个请求头之后是一个空行，发送回车符和换行符，通知服务器以下不再有请求头
```

## 常见状态代码、状态描述

常见状态代码、状态描述的说明如下：

200 OK：客户端请求成功
204 No Content：没有新文档，浏览器应该继续显示原来的文档
206 Partial Content：客户发送了一个带有Range头的GET请求，服务器完成了它
301 Moved Permanently：所请求的页面已经转移至新的url
302 Found：所请求的页面已经临时转移至新的url
304 Not Modified：客户端有缓冲的文档并发出了一个条件性的请求，服务器告诉客户，原来缓冲的文档还可以继续使用。
400 Bad Request：客户端请求有语法错误，不能被服务器所理解
401 Unauthorized：请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
403 Forbidden：对被请求页面的访问被禁止
404 Not Found：请求资源不存在
500 Internal Server Error：服务器发生不可预期的错误
503 Server Unavailable：请求未完成，服务器临时过载或当机，一段时间后可能恢复正常

## 输入 url 后发生了什么。简易版

1. 在chrome的地址栏输入http://baidu.com
2. chrome通过DNS去查找http://baidu.com这个域名对应的IP地址
  chrome浏览器会先查找有没有缓存的DNS记录，如果在浏览器缓存没有找到需要的记录，就会去做一个系统的调用，获取系统缓存的记录
  如果没有记录请求会继续到路由器上，路由器上有自己的DNS缓存
  如果没有记录就会到ISP的DNS缓存中查看记录
  如果没有记录就会在ISP的DNS服务器从根服务器域名服务器开始递归搜索最后得到IP地址
3. 浏览器给baidu服务器发送一个HTTP请求
4. baidu服务器301重定向响应
5. chrome浏览器请求重定向来的地址
6. baidu服务器处理请求
  baidu服务器在这个时候接收到了请求，它会去查看请求它的参数还有cookie信息，然后会进行一些操作处理，例如对数据进行存储，从数据库中获取需要被请求的数据等
7. baidu服务器返回HTML响应
  当baidu服务器处理好之后，就会给浏览器返回数据了，这个时候会有一个Response Headers发送给浏览器
8. chrome浏览器显示baidu页面

* 浏览器获得url对应的请求，向操作系统请求该url对应的iP地址
* 操作系统查询DNS （首先查询本地host文件，没有则查询网络）获得对应ip地址
* 浏览器发送tcp连接请求向 ip地址对应的服务器（带SYN标志数据包）。
* 服务器收到tcp连接请求后，回复可以链接请求（有SYN/ACK标志的数据包）。
* 浏览器收到回传的数据，确认ok后，还会向服务端发送数据（带ACK标志的数据包）包表示三次握手结束。
* 三次握手成功后，浏览器和服务端开始tcp连接形式传输数据包。
* 服务器传给浏览所需要的资源数据。
* 浏览器获得数据，渲染网页然后呈现给用户。

## 状态码

301、302

301 Moved Permanently 被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个URI之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。

302 Found 请求的资源现在临时从不同的URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。

字面上的区别就是**301是永久重定向，而302是临时重定向。**

* 301比较常用的场景是使用域名跳转。

  比如，我们访问 http://www.baidu.com 会跳转到 https://www.baidu.com，发送请求之后，就会返回301状态码，然后返回一个location，提示新的地址，浏览器就会拿着这个新的地址去访问。

  **注意： 301请求是可以缓存的， 即通过看status code，可以发现后面写着from cache。** -

  或者你把你的网页的名称从php修改为了html，这个过程中，也会发生永久重定向。

* 302用来做临时跳转

　　比如未登陆的用户访问用户中心重定向到登录页面。

　　访问404页面会重新定向到首页。

配合nginx

**niginx 301/302配置**
rewrite后面接上permenent就代表301跳

```js
//把来自veryyoung.me的请求301跳到 www.veryyoung.me
if ($host != 'veryyoung.me') {
    rewrite ^/(.*)$ http://www.veryyoung.me/$1 permanent;
}
```

接上redirect就代表302跳

```js
//把来自veryyoung.me的请求302跳到 www.veryyoung.me
if ($host != 'veryyoung.me') {
    rewrite ^/(.*)$ http://www.veryyoung.me/$1 redirect;
}
```

 TIP: -总结

301重定向和302重定向的区别

　　302重定向只是暂时的重定向，搜索引擎会抓取新的内容而保留旧的地址，因为服务器返回302，所以，搜索搜索引擎认为新的网址是暂时的。

　　而301重定向是永久的重定向，搜索引擎在抓取新的内容的同时也将旧的网址替换为了重定向之后的网址。

## http 跨域

### 同源策略

> 同源策略是指【协议 + 域名 +  端口号】 三者相同。如果两个相同的域名指向同一个 ip 地址，也是非同源的情况 （http://www.leeing.cn/a.js 和 http://132.232.18.77/b.js 这也是非同源）

  当协议、域名、端口号中任意一个不同时，都是跨域。同样包括（`一级域名与二级域名的不同`）互相请求资源的情况下是一种跨域状态

```js
http:// www  .  abc.com :  8080    /uer/detail
协议   子域名    主域名     端口号   请求资源地址
```

浏览器对一下几个标签，是允许跨域加载资源的

* img
* script
* link

设置 `Access-Control-Allow-Origin` 请求头只能解决简单的跨域请求： GET、HEAD、POST

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

> 由于TCP连接是全双工的，因此每个方向都必须单独进行关闭，所以即使没有最后一个包，也需要先回复断开连接的请求，然后再发送关闭请求

## 缓存策略 & web缓存机制

### 相关阅读文章

[web缓存机制系列文章](http://www.alloyteam.com/2012/03/web-cache-2-browser-cache/)

### 相关知识点摘要

> 可分为 强缓存 和 协商缓存

1. Cache-Control/Expires: 浏览器判断缓存是否过期，未过期时，直接使用强缓存，Cache-Control的 max-age 优先级高于 Expires
2. 当缓存已经过期时，使用协商缓存
  唯一标识方案: Etag(response 携带) & If-None-Match(request携带，上一次返回的 Etag): 服务器判断资源是否被修改，
  最后一次修改时间: Last-Modified(response) & If-Modified-Since (request，上一次返回的Last-Modified)
    * 如果一致，则直接返回 304 通知浏览器使用缓存
    * 如不一致，则服务端返回新的资源

Last-Modified 缺点

* 周期性修改，但内容未变时，会导致缓存失效
* 最小粒度只到 s， s 以内的改动无法检测到

Etag 的优先级高于 Last-Modified

**哪些请求不能被缓存**：
1、HTTP信息头中包含 cache-control: no-cache/store, pragma: no-cache, cache-control: max-age=0等告诉浏览器不用缓存的请求
2、需要根据 Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
3、经过https安全加密的请求
4、POST请求不能被缓存
5、http响应头中不包含 last-modified/Etag，也不包含Cache-control/Expires的请求无法缓存

## 应用层

应用层( application-layer ）的任务是通过应用进程间的交互来完成特定网络应用

应用层交互的数据单元称为报文

### 域名系统

域名系统( Domain Name System )是因特网的一项核心服务，它作为可以将域名和 IP 地址相互映射的一个分布式数据库，能够使人更方便的访问互联网，而不用去记住能够被机器直接读取的 IP 数串。

### http 协议

超文本传输协议（ HyperText Transfer Protocol ）是互联网上应用最为广泛的一种网络协议。所有的 WWW（万维网） 文件都必须遵守这个标准。

## 传输层

传输层(transport layer)的主要任务就是负责向两台主机进程之间的通信提供通用的数据传输服务。应用进程利用该服务传送应用层报文

传输层常用的两种协议

1. 传输控制协议-TCP：提供面向连接的，可靠的数据传输服务。
2. 用户数据协议-UDP：提供无连接的，尽最大努力的数据传输服务（不保证数据传输的可靠性）。

* TCP 是面向连接的（需要先建立连接）
* 每一条 TCP 连接只能有两个端点，每一条 TCP 连接只能是一对一
* TCP提供可靠交付的服务。通过TCP连接传送的数据，无差错、不丢失、不重复、并且按序到达
* TCP 提供全双工通信。TCP 允许通信双方的应用进程在任何时候都能发送数据。TCP 连接的两端都设有发送缓存和接收缓存，用来临时存放双方通信的数据
* 面向字节流。TCP 中的“流”（Stream）指的是流入进程或从进程流出的字节序列

* UDP 是无连接的
* UDP 是尽最大努力交付，即不保证可靠交付，因此主机不需要维持复杂的链接状态
* UDP 是面向报文的
* UDP 没有拥塞控制，因此网络出现拥塞不会使源主机的发送速率降低（对实时应用很有用，如直播，实时视频会议等）
* UDP 支持一对一、一对多、多对一和多对多的交互通信
* UDP 的首部开销小，只有 8 个字节，比 TCP 的 20 个字节的首部要短

## 网络层

网络层的任务就是选择合适的网间路由和交换结点，确保计算机通信的数据及时传送。
在发送数据时，网络层把运输层产生的报文段或用户数据报封装成分组和包进行传送。
在 TCP/IP 体系结构中，由于网络层使用 IP 协议，因此分组也叫 IP 数据报 ，简称数据报

## 数据链路层

数据链路层(data link layer)通常简称为链路层。两台主机之间的数据传输，总是在一段一段的链路上传送的，这就需要使用专门的链路层的协议
在两个相邻节点之间传送数据时，数据链路层将网络层接下来的 IP 数据报组装成帧，在两个相邻节点间的链路上传送帧。每一帧包括数据和必要的控制信息（如同步信息，地址信息，差错控制等）

## 物理层

在物理层上所传送的数据单位是比特。
物理层(physical layer)的作用是实现相邻计算机节点之间比特流的透明传送，尽可能屏蔽掉具体传输介质和物理设备的差异。使其上面的数据链路层不必考虑网络的具体传输介质是什么。
“透明传送比特流”表示经实际电路传送后的比特流没有发生变化，对传送的比特流来说，这个电路好像是看不见的。
在互联网使用的各种协议中最重要和最著名的就是 TCP/IP 两个协议。
