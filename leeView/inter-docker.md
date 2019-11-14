# Docker

> docker 学习

## docker 登录 docker hub

```js
docker login

username leeing0712
password xxxxxxx

WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

```

## 自己的主要配置相关参数

### 构建一个基础的通用的python程序环境

具体还可以参考 `../project/docker`

```yml docker demo
FROM python:3.7-alpine

LABEL version='1.0'
LABEL author='leeing'

# USER root

COPY requirements.txt /requirements.txt

# 安装精简的mariadb依赖库
RUN apk --no-cache add mariadb-connector-c-dev

# 安装 mysqlclient 的依赖环境到临时的虚拟包
# 用pip安装 mysqlclient 到python库
# 删除缓存文件和虚拟包
RUN apk --no-cache add --virtual .build-deps \
    build-base \
    mariadb-dev \
    && pip install -r /requirements.txt \
    && rm -rf .cache/pip \
    && apk del .build-deps

# RUN pip install -r requirements.txt

# EXPOSE 6281

# ENV NAME opera

# CMD ["python", "manage.py", "runserver"]

```

```js 创建镜像
docker build -t python-platform
```

### 基于前面创建的镜像，运行自己的程序

第一版：

```yml docker-compose.yml
version: "1.0"
services:
  api:
    build: .
    ports:
      - "6281:6281"
    volumes:
      - ".:/code"
    restart: always
# 网络设置
networks:
  webnet:
driver: bridge
```

第二版：

```yml
version: "3"
services:
  plot_api:
    image: opera
    # container_name: plot_api # 默认是 <项目名称><服务名称><序号>
    ports:
      - "6281:6281"
    volumes:
      - /root/projects/api/plot/plot_api:/mnt/plot_api
    command: ["python", "/mnt/plot_api/manage.py", "runserver", "-p", "6281"]
    restart: always
  plot_upload:
    images: opera
    ports:
      - "6282:6282"
    volumes:
      - /root/projects/api/plot/plot_upload:/mnt/plot_upload
    command: ["python", "/mnt/plot_upload/manage.py", "runserver", "-p", '6282']
    restart: always
  plot_file_scan:
    images: opera
    ports:
      - "6283:6283"
    volumes:
      - /root/projects/api/plot/plot_file_scan:/mnt/plot_file_scan
    command: ["python", "/mnt/plot_file_scan/manage.py", "runserver", "-p", '6283']
    restart: always

```

### docker + python + gunicorn

踩坑
这样会报错

```js
docker run -t -p 6283:5000 -v /root/projects/api/plot/plot_api:/mnt opera gunicorn /mnt/deploylinuxTest:APP -w 2 -b 0.0.0.0:5000
// => ModuleNotFoundError: No module named '/mnt/deploylinuxTest'


// 这样也会报错
docker run -t -p 6283:5000 -v /root/projects/api/plot/plot_api:/mnt opera gunicorn /mnt.deploylinuxTest:APP -w 2 -b 0.0.0.0:5000
// => ModuleNotFoundError: No module named '/mnt'

// 这样还会报错
docker run -t -p 6283:5000 -v /root/projects/api/plot/plot_api:/mnt opera gunicorn mnt.deploylinuxTest:APP -w 2 -b 0.0.0.0:5000
// => ModuleNotFoundError: No module named 'app'


// 😂这样就对了
docker run -t -p 6283:5000 -v /root/projects/api/plot/plot_api:/mnt opera gunicorn --pythonpath /mnt deploylinuxTest:APP -w 2 -b 0.0.0.0:5000
```

**重要的原因**
gunicorn命令解释文档也有很多，不一一说了，我参考的是：gunicorn配置文件解释，有两个需要注意的地方：

一个是：当run.sh和flask启动文件manage.py不在同一级目录时，
使用 `gunicorn src.manage:app` ，而非：`gunicorn /src/manage:app`，
或者指定gunicorn的pathonpath参数，`--pythonpath /var/jenkins_home/workspace/src`

另一个注意点：若启动容器时报 "docker standard_init_linux.go:195: exec user process caused  no such file or directory",

其他。gunicorn 可以配置其他参数

```js
gunicorn src.manage:app \
        --bind 0.0.0.0:8000 \
        --workers 4 \
        --log-level debug \
        --access-logfile=/var/jenkins_home/workspace/log/access_print.log \
        --error-logfile=/var/jenkins_home/workspace/log/error_print.log
```

所以我们可以写成一个脚本 **run.sh**

```py
#!/bin/bash
set -e
pwd
# 日志文件
touch /var/jenkins_home/workspace/log/access_print.log
touch /var/jenkins_home/workspace/log/error_print.log
touch /var/jenkins_home/workspace/log/output_print.log
pwd
ls -l
echo makedir ok
chmod 777 src

# gunicorn启动命令
exec gunicorn src.manage:app \
        --bind 0.0.0.0:8000 \
        --workers 4 \
        --log-level debug \
        --access-logfile=/var/jenkins_home/workspace/log/access_print.log \
        --error-logfile=/var/jenkins_home/workspace/log/error_print.log
exec "$@"
```

## 基本使用

三个重要的概念：镜像（Image）、容器（Container）、仓库（Repository）

### 常用参数

```js
docker run -it --rm \
    ubuntu:18.04 \
    bash
```

* -it：这是两个参数，一个是 -i：交互式操作，一个是 -t 终端。我们这里打算进入 bash 执行一些命令并查看返回结果，因此我们需要交互式终端。
* --rm：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 --rm 可以避免浪费空间。
* -d 后台运行

### Docker 镜像

Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。
镜像不包含任何动态数据，其内容在构建之后也不会被改变。

### Docker 容器

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。
容器可以被创建、启动、停止、删除、暂停等。

容器的实质是**进程**

容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用 数据卷（Volume）、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失。

### 安装

略

### 常用操作

```yml

# 拉取镜像
docker pull

# 删除容器
docker rm <Container name or ID>

# 删除镜像
docker rmi <image ID>

# 查看容器日志
docker logs -f <container name or ID>

# 查看正在运行的容器
docker ps [-a]

# 删除所有容器
docker rm ${docker ps -a -q}

# 停止、启动、杀死指定容器
docker start <container name or ID>
docker stop <container name or ID>
docker kill <container name or ID>

# 查看所有镜像
docker images

# 后台运行
docker run -d <other params> # docker run -d -p 127.0.0.1:33301:22 centos6-ssh

# 暴露端口
docker -p ip:hostPort:containerPort # 映射指定地址的主机端口到容器端口
# 例如：docker -p 127.0.0.1:3306:3306 映射本机3306端口到容器的3306端口
docker -p ip::containerPort # 映射指定地址的任意可用端口到容器端口
# 例如：docker -p 127.0.0.1::3306 映射本机的随机可用端口到容器3306端口
docer -p hostPort:containerPort # 映射本机的指定端口到容器的指定端口
# 例如：docker -p 3306:3306 # 映射本机的3306端口到容器的3306端口

# 映射数据卷
docker -v /home/data:/opt/data # 这里/home/data 指的是宿主机的目录地址，后者则是容器的目录地址
```

### 数据卷

数据卷 是一个可以供一个或多个容器使用的特殊目录，他绕过 UFS，可以提供很多有用的特性

* 数据卷 可以在容器之间共享和重用
* 对数据卷的修改立马生效
* 对数据卷的更新，不会影响镜像
* 数据卷 默认会一直存在，即使容器被删除

```js
// 创建一个数据卷
docker volume create my-vol

// 查看数据卷
docker volume inspect my-vol

// 删除数据卷
docker volume rm my-vol
```

### 使用网络

当使用 -P 标记时，Docker 会随机映射一个 49000~49900 的端口到内部容器开放的网络端口。

-p 则可以指定要映射的端口，并且，在一个指定端口上只可以绑定一个容器。支持的格式有 ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort。

**映射所有接口地址**
使用 hostPort:containerPort 格式本地的 5000 端口映射到容器的 5000 端口，可以执行

```js
 docker run -d -p 5000:5000 training/webapp python app.py
```

可以使用 ip:hostPort:containerPort 格式指定映射使用一个特定地址，比如 localhost 地址 127.0.0.1

```js
 docker run -d -p 127.0.0.1:5000:5000 training/webapp python app.py
```

使用 ip::containerPort 绑定 localhost 的任意端口到容器的 5000 端口，本地主机会自动分配一个端口。

**查看映射端口配置**
使用 docker port 来查看当前映射的端口配置，也可以查看到绑定的地址

```js
$ docker port nostalgic_morse 5000
127.0.0.1:49155.
```

-p 标记可以多次使用来绑定多个端口

```js
$ docker run -d \
    -p 5000:5000 \
    -p 3000:80 \
    training/webapp \
    python app.py
```