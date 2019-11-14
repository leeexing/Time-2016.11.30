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
