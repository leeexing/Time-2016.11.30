---
title: python常用的类库、包
tag: python
desc: 常用
---

## 内置的常用类库

importlib

  动态导入对象 importlib.import_module

可以绝对导入，也可以相对导入

``` Python
def init_app(app: Flask) -> None:
    blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
    for mod_name in app.config['ENABLED_APIS']:
        mod = import_module(f'.{mod_name}', package=__name__)
        getattr(mod, 'init_app')(blueprint)
    app.register_blueprint(blueprint)
```

注意：相对导入有一个点，类似路径

## 第三方使用包

### minio

Minio是Apache License v2.0下发布的对象存储服务器。它与Amazon S3云存储服务兼容。它最适合存储非结构化数据，如照片，视频，日志文件，备份和容器/ VM映像。对象的大小可以从几KB到最大5TB
Minio服务器足够轻，可以与应用程序堆栈捆绑在一起，类似于NodeJS，Redis和MySQL。
https://docs.minio.io/

### flask_caching

为了尽量减少缓存穿透，同时减少web的响应时间，我们可以针对那些需要一定时间才能获取结果的函数和那些不需要频繁更新的视图函数提供缓存服务，可以在一定的时间内直接返回结果而不是每次都需要计算或者从数据库中查找。flask_caching插件就是提供这种功能的神器。

### flask-RQ2

### docker安装Mysql+图形化管理界面Adminer

docker run --link mysql:mysql --name adminer -p 8888:8080 -d --restart=always adminer

### setuptools
