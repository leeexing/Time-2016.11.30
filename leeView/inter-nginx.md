# inter-nginx

> ngixn 学习

## nginx - include 配置

在我自己的本地我是这么配置的

```conf
http {
  # 一大堆

  include "D:/Soft Ware/nginx/nginx-1.14.0/conf/conf.d/*.conf";
}

# 由于我的路径中带有空格，所以，我需要将绝对路径用双引号引起来
# 但是发现，这里我使用的是 “绝对路径”
```

在实际线上环境部署的时候，我使用同样的策略

```conf
http {
  # 省略一大段

  include C:/nginx/conf/conf.d/*.conf;

  # or

  include extra/*.conf;

}
```


 TIP: 配置的路径的时候，一定要小心，别少了任何一个 `/`

## 配置

### location

1. = 开头表示精确匹配
2. ^~ 开头表示 url 以某个常规字符串开头，理解为匹配 url 路径即可。
3. ~ 开头表示区分大小写的正则匹配
4. ~* 开头表示不区分大小写的正则匹配
5. !~ 和 ~* 分别为区分大小写不匹配 及 不区分大小写不匹配 的正则
6. / 通用匹配。任何请求都会匹配到

### root

**root**：根路径匹配，用于访问文件系统。在匹配到`location`配置的URL路径后，指向 root 配置的路径。并把请求路径附加到其后。

```js
location /test/ {
  root /usr/local/;
}
```

请求 `/test/1.png` 将会返回文件 `/usr/local/test/1.png` （**注意** 没有 `/test/`）

### alias

alias 和 root 差不多：别名
有一点时需要注意的：
使用 `alias` 时，目录最后的 `/` 一定要有，而用 `root` 时可有可无。
使用 `alias` 时，只能放在 `location` 块中。`root` 可以不放在 `location` 中
alias 在使用正则匹配时，必须捕捉要匹配的内容并在指定的内容处使用

```js
location /test/ {
  alias /usr/local/;
}
```

请求 `/test/1.png` 将会返回文件 `/usr/local/1.png` （**注意** 没有 `/test/`）

### proxy_pass

反向代理，用于代理请求，适用于前后端负载分离或多台机器、服务器负载分离。

```js
location /test/ {
  proxy_pass http://localhost:8080/;
}
```

请求 `/test/1.png` 将会被 nginx 转发请求到 `http://localhost:8080/1.png` (未附加 /test/ 路径)

### 应用

第一个必须规则: 直接匹配网站根

```js
location = / {
  proxy_pass http://localhost:8081/index;
}
```

第二个必须按规则：处理静态文件请求：（1）目录匹配（2）后缀匹配

```js
location ^~ /static/ {
  root /webroot/static/;
}

location ~* \.(gif|jpg|png|jpeg|css|js|ico)$ {
  root /webtoot/res/;
}
```

第三个规则：通用规则，用来转发动态请求到后端应用服务器

```js
locaton / {
  proxy_pass http://localhost:8080;
}

```

### plot.conf

```conf
# 在线标注平台

# upstream sourceData {
    # weigth参数表示权值，权值越高被分配到的几率越大
    # max_fails 当有#max_fails个请求失败，就表示后端的服务器不可用，默认为1，将其设置为0可以关闭检查
    # fail_timeout 在以后的#fail_timeout时间内nginx不会再把请求发往已检查出标记为不可用的服务器
    # 这里指定多个源服务器，ip:端口,80端口的话可写可不写

    # server 192.168.1.78:8080 weight=5 max_fails=2 fail_timeout=600s;
    # server 192.168.1.222:8080 weight=3 max_fails=2 fail_timeout=600s;
    # server 132.232.18.77:7012;
# }

server {
    listen 80;
    server_name plot.anjianba.cn;
    rewrite ^(.*)$ https://${server_name}$1 permanent;
}

server {
    listen 443 ssl;
    server_name plot.anjianba.cn;
    ssl_certificate D:\\cert\\2412747__anjianba.cn_nginx\\2412747__anjianba.cn.pem;
    ssl_certificate_key D:\\cert\\2412747__anjianba.cn_nginx\\2412747__anjianba.cn.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    root D:\\projects\\plot_web;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location = /50x.html {
        root html;
    }
    error_page 404              /404.html;
    error_page 500 502 503 504  /50x.html;
}

server {
    listen 443 ssl;
    server_name plotapi.anjianba.cn;
    ssl_certificate D:\\cert\\2412747__anjianba.cn_nginx\\2412747__anjianba.cn.pem;
    ssl_certificate_key D:\\cert\\2412747__anjianba.cn_nginx\\2412747__anjianba.cn.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location /v1/api/ {
        proxy_pass http://52.81.103.142:5281/v1/api/;
        if ($request_method = OPTIONS ) {
            add_header Access-Control-Allow-Origin "$http_origin";
            add_header Access-Control-Allow-Methods "POST, GET, PUT, OPTIONS, DELETE";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Allow-Headers "$http_access_control_request_headers";
            add_header Access-Control-Max-Age "3600";
            return 204;
        }
        add_header Access-Control-Allow-Origin "$http_origin" always;
        add_header Access-Control-Allow-Methods "GET, PUT, POST, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header backendIP $upstream_addr;
        add_header backendCode $upstream_status;
        proxy_set_header Host $host;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /downloads/ {
        proxy_pass http://127.0.0.1:5282/downloads/;
    }
    location /images/ {
        proxy_pass http://127.0.0.1:5282/images/;
        if ($request_method = OPTIONS ) {
            add_header Access-Control-Allow-Origin "$http_origin";
            add_header Access-Control-Allow-Methods "POST, GET, PUT, OPTIONS, DELETE";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Allow-Headers "$http_access_control_request_headers";
            add_header Access-Control-Max-Age "3600";
            return 204;
        }
        add_header Access-Control-Allow-Origin "$http_origin";
        add_header Access-Control-Allow-Methods "GET, PUT, POST, DELETE, OPTIONS";
        add_header Access-Control-Allow-Credentials "true";
    }
}
```

## DR图像测试 23 环境nginx配置

```js
server {
    listen      5200;
    server_name localhost;

    location /dr {
        root /home/pizhipeng/projects;
        index dr.html;
    }

    location /ct {
        root /home/pizhipeng/projects;
        index ct.html;
    }
}
```

## 静态资源缓存

REFER: https://www.cnblogs.com/wpjamer/articles/7124087.html
REFER: https://blog.csdn.net/qq_36514766/article/details/99856405

```js
location ~* \.(gif|jpg|jpeg|bmp|png|ico|txt|js|css)$
{
    root /dist;
    expires  30d;
}

// 图片缓存时间设置  

location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$  
{  
expires 8d;  
}  

// JS和CSS缓存时间设置  
location ~ .*.(js|css)?$  
{  
expires 2h;  
}  
```

```conf
location ~ .*\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm)$ {
        log_not_found off;
        # 关闭日志
        access_log off;
        # 缓存时间7天
        expires 7d;
        # 源服务器
        proxy_pass http://localhost:5678;
        # 指定上面设置的缓存区域
        proxy_cache imgcache;
        # 缓存过期管理
        proxy_cache_valid 200 302 1d;
        proxy_cache_valid 404 10m;
        proxy_cache_valid any 1h;
        proxy_cache_use_stale error timeout invalid_header updating http_500 http_502 http_503 http_504;
    }
```

```conf

http {
  ...

  // 缓存目录：/data/nginx/cache
  // 缓存名称：one
  // 缓存占用内存空间：10m
  // 加载器每次迭代过程最多执行300毫秒
  // 加载器每次迭代过程中最多加载200个文件
  // 缓存硬盘空间最多为 200m
  proxy_cache_path / data / nginx / cache keys_zone = one: 10 m loader_threshold = 300
  loader_files = 200 max_size = 200 m;

  server {
    listen 8080;

    // 使用名称为one的缓存
    proxy_cache one;

    location / {
      // 此location中使用默认的缓存配置
      proxy_pass http: //backend1;
    }

    location / some / path {
      proxy_pass http: //backend2;

      // 缓存有效期为1分钟
      proxy_cache_valid any 1 m;

      // 被请求3次以上时才缓存
      proxy_cache_min_uses 3;

      // 请求中有下面参数值时不走缓存
      proxy_cache_bypass $cookie_nocache $arg_nocache$arg_comment;
    }
  }
}
```

## 网站有多个webapp的配置

使用 `upstream` 这个真好

``` Python
http {
    #此处省略一些基本配置
    upstream product_server{
        server www.helloworld.com:8081;
    }
    upstream admin_server{
        server www.helloworld.com:8082;
    }
    upstream finance_server{
        server www.helloworld.com:8083;
    }

    server {
        #此处省略一些基本配置
        #默认指向product的server
        location / {
            proxy_pass http://product_server;
        }
        location /product/{
            proxy_pass http://product_server;
        }
        location /admin/ {
            proxy_pass http://admin_server;
        }
        location /finance/ {
            proxy_pass http://finance_server;
        }
    }
}
```

## 请解释 Nginx 如何处理 HTTP 请求

1）首先，Nginx 在启动时，会解析配置文件，得到需要监听的端口与 IP 地址，然后在 Nginx 的 `Master 进程`里面先初始化好这个监控的Socket(创建 Socket，设置 addr、reuse 等选项，绑定到指定的 ip 地址端口，再 listen 监听)。

2）然后，再 fork(一个现有进程可以调用 fork 函数创建一个新进程。由 `fork 创建的新进程被称为子进程` )出`多个子进程`出来。（epoll）可以配置，一般是服务器的核数）

3）之后，子进程会竞争 accept 新的连接。此时，客户端就可以向 nginx 发起连接了。当客户端与nginx进行三次握手，与 nginx 建立好一个连接后。此时，某一个子进程会 accept 成功，得到这个建立好的连接的 Socket ，然后创建 nginx 对连接的封装，即 ngx_connection_t 结构体。

4）接着，设置读写事件处理函数，并添加读写事件来与客户端进行数据的交换。

  这里，还是有一些逻辑，继续在 「Nginx 是如何实现高并发的？」 问题中来看。

5）最后，Nginx 或客户端来主动  关掉连接，到此，一个连接就寿终正寝了。

## Nginx 是如何实现高并发的

1）如果一个 server 采用一个进程(或者线程)负责一个request的方式，那么进程数就是并发数。那么显而易见的，就是会有很多进程在等待中。等什么？最多的应该是等待网络传输。其缺点胖友应该也感觉到了，此处不述。

  思考下，Java 的 NIO 和 BIO 的对比哟。

2）而 Nginx 的异步非阻塞工作方式正是利用了这点等待的时间。在需要等待的时候，这些进程就空闲出来待命了。因此表现为少数几个进程就解决了大量的并发问题。

3）Nginx是如何利用的呢，简单来说：同样的 4 个进程，如果采用一个进程负责一个 request 的方式，那么，同时进来 4 个 request 之后，每个进程就负责其中一个，直至会话关闭。期间，如果有第 5 个request进来了。就无法及时反应了，因为 4 个进程都没干完活呢，因此，一般有个调度进程，每当新进来了一个 request ，就新开个进程来处理。

  回想下，BIO 是不是存在酱紫的问题？嘻嘻。

4）Nginx 不这样，每进来一个 request ，会有一个 worker 进程去处理。但不是全程的处理，处理到什么程度呢？**处理到可能发生阻塞的地方**，比如向上游（后端）服务器转发 request ，并等待请求返回。那么，**这个处理的 worker 不会这么傻等着，他会在发送完请求后，注册一个事件：“如果 upstream 返回了，告诉我一声，我再接着干”**。于是他就休息去了。此时，如果再有 request 进来，他就可以很快再按这种方式处理。而一旦上游服务器返回了，就会触发这个事件，worker 才会来接手，这个 request 才会接着往下走。

  `这就是为什么说，Nginx 基于事件模型。` 👍

5）由于 web server 的工作性质决定了每个 request 的大部份生命都是在网络传输中，实际上花费在 server 机器上的时间片不多。这是几个进程就解决高并发的秘密所在。即：

  `webserver 刚好属于网络 IO 密集型应用，不算是计算密集型。`👍

而正如叔度所说的

  `异步，非阻塞，使用 epoll ，和大量细节处的优化。`👍

也正是 Nginx 之所以然的技术基石。

## 为什么 Nginx 不使用多线程

1）Apache: 创建多个进程或线程，而每个进程或线程都会为其分配 cpu 和内存（线程要比进程小的多，所以 worker 支持比 perfork 高的并发），并发过大会榨干服务器资源。

2）Nginx: 采用单线程来异步非阻塞处理请求（管理员可以配置 Nginx 主进程的工作进程的数量）(epoll)，不会为每个请求分配 cpu 和内存资源，节省了大量资源，同时也减少了大量的 CPU 的上下文切换。所以才使得 Nginx 支持更高的并发。

  `Netty、Redis 基本采用相同思路。`

## 什么是动态资源、静态资源分离

动态资源、静态资源分离，是让动态网站里的动态网页根据一定规则把不变的资源和经常变的资源区分开来，动静资源做好了拆分以后我们就可以根据静态资源的特点将其做缓存操作，这就是网站静态化处理的核心思路。

动态资源、静态资源分离简单的概括是：**动态文件与静态文件的分离。**

### 为什么要做动、静分离

在我们的软件开发中，有些请求是需要后台处理的（如：.jsp,.do 等等），有些请求是不需要经过后台处理的（如：css、html、jpg、js 等等文件），这些不需要经过后台处理的文件称为静态文件，否则动态文件。

因此我们后台处理忽略静态文件。这会有人又说那我后台忽略静态文件不就完了吗？当然这是可以的，但是这样后台的请求次数就明显增多了。在我们对资源的响应速度有要求的时候，我们应该使用这种动静分离的策略去解决动、静分离将网站静态资源（HTML，JavaScript，CSS，img等文件）与后台应用分开部署，提高用户访问静态代码的速度，降低对后台应用访问

这里我们将静态资源放到 Nginx 中，动态资源转发到 Tomcat 服务器中去。

? 当然，因为现在七牛、阿里云等 CDN 服务已经很成熟，主流的做法，是把静态资源缓存到 CDN 服务中，从而提升访问速度。

相比本地的 Nginx 来说，CDN 服务器由于在国内有更多的节点，可以实现用户的就近访问。
并且，CDN 服务可以提供更大的带宽，不像我们自己的应用服务，提供的带宽是有限的。

## 什么叫 CDN 服务

CDN ，即内容分发网络。

其目的是，通过在现有的 Internet中 增加一层新的网络架构，将网站的内容发布到最接近用户的网络边缘，使用户可就近取得所需的内容，提高用户访问网站的速度。

一般来说，因为现在 CDN 服务比较大众，所以基本所有公司都会使用 CDN 服务。

## Nginx 有哪些负载均衡策略

负载均衡，即是代理服务器将接收的请求均衡的分发到各服务器中

1、轮询（默认）round_robin：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除。

2、IP 哈希 ip_hash：每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决 session 共享的问题。

当然，实际场景下，一般不考虑使用 ip_hash 解决 session 共享。

3、最少连接 least_conn：下一个请求将被分派到活动连接数量最少的服务器

``` Python
weight=1; # (weight 默认为1.weight越大，负载的权重就越大)
down; # (down 表示单前的server暂时不参与负载)
backup; # (其它所有的非backup机器down或者忙的时候，请求backup机器)
max_fails=1; # 允许请求失败的次数默认为 1 。当超过最大次数时，返回 proxy_next_upstream 模块定义的错误
fail_timeout=30; # max_fails 次失败后，暂停的时间
```

## Nginx 如何实现后端服务的健康检查

方式一，利用 nginx 自带模块 ngx_http_proxy_module 和 ngx_http_upstream_module 对后端节点做健康检查。

方式二，利用 nginx_upstream_check_module 模块对后端节点做健康检查。

## Nginx 如何开启压缩

开启nginx gzip压缩后，网页、css、js等静态资源的大小会大大的减少，从而可以节约大量的带宽，提高传输效率，给用户快的体验。虽然会消耗cpu资源，但是为了给用户更好的体验是值得的

## 请解释什么是C10K问题

C10K问题是指无法同时处理大量客户端(10,000)的网络套接字。