# - 制作通用的python应用程序所依赖的执行环境
FROM python:3.7-alpine

LABEL version='1.0'
LABEL author='leeing'

COPY requirements.txt /requirements.txt

# 解决安装 Pillow 时报错的问题
# 用pip安装项目所依赖的python库
# 删除缓存文件和虚拟包
RUN apk --no-cache add jpeg-dev zlib-dev \
    && apk --no-cache add --virtual .build-deps build-base \
    && pip3 install -r /requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && rm -rf .cache/pip \
    && apk del .build-deps

EXPOSE 80 5000 8000 8080

ENTRYPOINT []
