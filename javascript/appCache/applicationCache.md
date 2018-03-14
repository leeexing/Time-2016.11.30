# Application cache

> 应用程序缓存

三个优势:
1. 离线浏览 - 用户可在应用离线时使用它们
1. 速度 - 已缓存资源加载得更快
1. 减少服务器负载 - 浏览器将只从服务器下载更新过或更改过的资源。

要使用application cache，主要用到缓存清单文件：manifest，该文件告诉浏览器需要缓存哪些资源
manifest文件结构

```
CACHE MANIFEST
# 以上折行必需要写

CACHE:
# 这部分写需要缓存的资源文件列表
# 可以是相对路径也可以是绝对路径
index.html
index.css
images/logo.png
js/main.js
http://img.baidu.com/js/tangram-base-1.5.2.1.js

NETWORK:
# 可选
# 这一部分是要绕过缓存直接读取的文件
login.php


FALLBACK:
# 可选
# 这部分写当访问缓存失败后，备用访问的资源
# 每行两个文件，第一个是访问源，第二个是替换文件*.html /offline.html
```

使用

```html
<html manifest="demo.cache">
  ...
</html>
```

注意点：

站点离线存储的容量限制是5M
如果manifest文件，或者内部列举的某一个文件不能正常下载，整个更新过程将视为失败，浏览器继续全部使用老的缓存
引用manifest的html必须与manifest文件同源，在同一个域下
在manifest中使用的相对路径，相对参照物为manifest文件
CACHE MANIFEST字符串应在第一行，且必不可少
系统会自动缓存引用清单文件的 HTML 文件
manifest文件中CACHE则与NETWORK，FALLBACK的位置顺序没有关系，如果是隐式声明需要在最前面
FALLBACK中的资源必须和manifest文件同源
当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。
站点中的其他页面即使没有设置manifest属性，请求的资源如果在缓存中也从缓存中访问
当manifest文件发生改变时，资源请求本身也会触发更新
