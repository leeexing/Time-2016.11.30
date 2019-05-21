# inter-nginx

> ngixn 学习

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