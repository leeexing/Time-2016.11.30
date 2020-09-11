# Docker

> docker 学习

## 基本使用

docker stack deploy -c stack.yml mongo
docker-compose -f stack.yml up

## 将容器打包成镜像

> docker commit

docker commit -a "leecin" -m "social基础镜像" social_img leeing0712/social:v1.0

docker push leeing0712/social:v1.0

## docker 容器里面没有vim如何编辑文件

1. apt-get update
2. apt-get install vim

## docker内使用apt-get update时报Temporary failure resolving 'security.ubuntu.com错的解决方法

cd /etc/docker
touch daemon.json
然后将如下的内容放入daemon.json里面

{
    "dns": ["8.8.8.8", "114.114.114.114"]
}

重启docker

systemctl restart docker

## 准则

1. 尽量将Dockerfile放在空目录中，如果目录中必须有其他文件，则使用.dockerignore文件。
2. 避免安装不必须的包。
3. 每个容器应该只关注一个功能点。
4. 最小化镜像的层数。
5. 多行参数时应该分类。这样更清晰直白，便于阅读和review，另外，在每个换行符\前都增加一个空格。
6. 对构建缓存要有清楚的认识。

### dockerfile编写经验

1.精简镜像用途：                 尽量让每个镜像的用途都比较集中、单一，避免构造大而复杂、多功能的镜像；
2.选用合适的基础镜像：            过大的基础镜像会造成构建出臃肿的镜像，一般推荐比较小巧的镜像作为基础镜像；
3.提供详细的注释和维护者信息：     Dockerfile也是一种代码，需要考虑方便后续扩展和他人使用；
4.正确使用版本号：               使用明确的具体数字信息的版本号信息，而非latest，可以避免无法确认具体版本号，统一环境；
5.减少镜像层数：                减少镜像层数建议尽量合并RUN指令，可以将多条RUN指令的内容通过&&连接；
6.及时删除临时和缓存文件：        这样可以避免构造的镜像过于臃肿，并且这些缓存文件并没有实际用途；
7.提高生产速度：                合理使用缓存、减少目录下的使用文件，使用.dockeringore文件等；
8.调整合理的指令顺序：           在开启缓存的情况下，内容不变的指令尽量放在前面，这样可以提高指令的复用性；
9.减少外部源的干扰：             如果确实要从外部引入数据，需要制定持久的地址，并带有版本信息，让他人可以重复使用而不出错。

## 安装

使用 yum 安装。
当然也可以使用python安装。但是，就是你需要安装py环境。所以，网上都是推荐使用yum安装

[一个教程](https://blog.csdn.net/qq_36379495/article/details/92837897)

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

## docker常用的一些基本镜像

### nginx

或则 nginx:alpine

1）默认启动的是 `/etc/nginx/` 下面的 `/etc/nginx/nginx.conf` 和 `/etc/nginx/conf.d/default.conf` 里面的配置
2）默认的显示文件是 `/usr/share/nginx/` 下面的 `/usr/share/nginx/html/index.html` 显示文件内容
3）默认的启动命令 `nginx -g daemon off`

## docker基本使用

三个重要的概念：镜像（Image）、容器（Container）、仓库（Repository）

### docker容器中访问redis容器中的服务

redis启动的时候。执行这样的脚本

``` Python
docker run -d -p 6340:6379 -v /root/docker/conf/redis.conf:/usr/local/etc/redis/redis.conf -v /root/docker/data/redis:/data --name docker_redis docker.io/redis redis-server /usr/local/etc/redis/redis.conf --appendonly yes
```

连接的时候

``` Python
import redis
r = redis.Redis(host="132.232.18.77", port=6340)
r.get('count')
```

### 常用参数

```js
docker run -it --rm \
    ubuntu:18.04 \
    bash
```

* -it：这是两个参数，一个是 -i：交互式操作，一个是 -t 终端。我们这里打算进入 bash 执行一些命令并查看返回结果，因此我们需要交互式终端。
* --rm：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。
  我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 --rm 可以避免浪费空间。
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

### 安装docker

略

### ADD和COPY

虽然ADD和COPY功能相似，但一般来讲，更建议使用COPY。因为COPY比ADD更透明，COPY只支持从本地文件到容器的拷贝，但是ADD还有一些其他不明显的特性（比如本地tar包解压缩和远程URL支持）。因此，ADD的最优用处是本地tar包自动解压缩到镜像中。如：ADD rootfs.tar.xz /。
如果有多个Dockerfile步骤用于处理不同的文件，建议分开COPY它们，而不是一次性拷贝。这可以保证每个步骤的build缓存只在对应的文件改变时才无效。比如：

``` Python
# Python
COPY requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt
COPY . /tmp/
```

**注意**：最适合使用 ADD 的场合，就是所提及的需要自动解压缩的场合。

另外需要注意的是，ADD 指令会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。

因此在 COPY 和 ADD 指令中选择的时候，可以遵循这样的原则，所有的文件复制均使用 COPY 指令，仅在需要自动解压缩的场合使用 ADD。

在使用该指令的时候还可以加上 `--chown=<user>:<group>` 选项来改变文件的所属用户及所属组。

### ENTRYPOINT

ENTRYPOINT 的最佳用处是设置镜像的主命令，允许将镜像当成命令本身来运行（用 CMD 提供默认选项）。

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

docker build -f my_dockerfile -t image_name .
# eg: docker build -f docker_nginx.df -t docker_nginx .
# eg: docker run --name my_docker_nginx -d -p 81:80 docker_nginx
```

```yml
docker run -c xxx # 覆盖Dockerfile文件中的 CMD 中的变参
docker run --enterpoint # 使用Dockerfile文件中的 ENTERPOINT 的定参

ENTERPOINT # 类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖
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

## docker-compose

Docker-Compose标准模板文件应该包含version、services、networks 三大部分，最关键的是services和networks两个部分。

```yml 一个简单的例子
version: '3'

services:

  web:
    # image: has_build_image
    build: .
    ports:
      - "3000"
      - "8000:8000"
      - "49100:22"
      - "127.0.0.1:8001:8001"
    depends_on:
      - db
      - redis

  redis:
    image: redis

  db:
    image: postgres
```

### depends_on

在使用Compose时，最大的好处就是少打启动命令，但一般项目容器启动的顺序是有要求的，如果直接从上到下启动容器，必然会因为容器依赖问题而启动失败。例如在没启动数据库容器的时候启动应用容器，应用容器会因为找不到数据库而退出。depends_on标签用于解决容器的依赖、启动先后的问题

### ports

ports用于映射端口的标签。
使用HOST:CONTAINER格式或者只是指定容器的端口，宿主机会随机映射端口。

**注意**当使用HOST:CONTAINER格式来映射端口时，如果使用的容器端口小于60可能会得到错误得结果，因为YAML将会解析xx:yy这种数字格式为60进制。所以建议采用字符串格式。

extra_hosts
　　添加主机名的标签，会在/etc/hosts文件中添加一些记录。

```yml
extra_hosts:
 - "somehost:162.242.195.82"
 - "otherhost:50.31.209.229"
```

启动后查看容器内部hosts：

```yml
162.242.195.82  somehost
50.31.209.229   otherhost
```

### volumes

挂载一个目录或者一个已存在的数据卷容器，可以直接使用 [HOST:CONTAINER]格式，或者使用[HOST:CONTAINER:ro]格式，后者对于容器来说，数据卷是只读的，可以有效保护宿主机的文件系统。
Compose的数据卷指定路径可以是相对路径，使用 . 或者 .. 来指定相对目录。

```yml
volumes:
  # 只是指定一个路径，Docker 会自动在创建一个数据卷（这个路径是容器内部的）。
  - /var/lib/mysql
  # 使用绝对路径挂载数据卷
  - /opt/data:/var/lib/mysql
  # 以 Compose 配置文件为中心的相对路径作为数据卷挂载到容器。
  - ./cache:/tmp/cache
  # 使用用户的相对路径（~/ 表示的目录是 /home/<用户目录>/ 或者 /root/）。
  - ~/configs:/etc/configs/:ro
  # 已经存在的命名的数据卷。
  - datavolume:/var/lib/mysql
```

### expose

暴露端口，但不映射到宿主机，只允许能被连接的服务访问。仅可以指定内部端口为参数，如下所示：

expose:
    - "3000"
    - "8000"

### links

链接到其它服务中的容器。使用服务名称（同时作为别名），或者“服务名称:服务别名”（如 SERVICE:ALIAS）

links:
    - db
    - db:database
    - redis

### net

设置网络模式。

net: "bridge"
net: "none"
net: "host"

模板文件

```yml
version: '2'
services:
  web1:
    image: nginx
    ports:
      - "6061:80"
    container_name: "web1"
    networks:
      - dev
  web2:
    image: nginx
    ports:
      - "6062:80"
    container_name: "web2"
    networks:
      - dev
      - pro
  web3:
    image: nginx
    ports:
      - "6063:80"
    container_name: "web3"
    networks:
      - pro

networks:
  dev:
    driver: bridge
  pro:
    driver: bridge
```