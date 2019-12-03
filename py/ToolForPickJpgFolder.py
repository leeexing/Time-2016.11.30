# -*- coding: utf-8 -*-
"""文件夹中的文件结构化入库

    @desc 捞数据、捞图像
    @filePath
    @destPath 目标图像目录
"""

import os
import json
from pymongo import MongoClient
from shutil import copyfile


rootPath = r'E:'
filePath = r'E:\magi\original' # 实际情况是根目录
destPath = r'E:\znquanbao'

batch_name = '20191125' # -批次名称。用于查询

urlData = None
count = 0


def get_mongo_data():
    """获取数据库中保存的图像数据"""
    # conn = MongoClient(host='127.0.0.1:27017') # 开发环境
    conn = MongoClient(host='mongodb://root:root123@10.15.225.23:27017/admin') # 测试环境
    # conn = MongoClient(host='mongodb://root:root123@52.80.171.106:27017/admin') # 生产环境
    mongodb = conn.sourceData

    # -查询条件。筛选出空包
    mongo_sql = {
        'type': None, # 空包
        # 'type': 1, # 空包
        'batch': batch_name, # 批次名称
    }
    data = list(mongodb.sieve_image.find(mongo_sql, {'url': 1, '_id': 0}).limit(300)) # 测试mongo是否可以连接成功

    with open('./pickJpgData.txt', 'w') as f:
        f.write(json.dumps(data))


def get_mongo_data_from_txt():
    """从txt文件中获取数据"""
    global urlData
    with open('./pickJpgData.txt') as f:
        data = json.loads(f.read())
        # 实际需要去掉批次号
        urlData = [item['url'].replace('/', '\\') for item in data]
        # urlData = [item['url'][1:].replace(batch_name, '').replace('/', '\\') for item in data]


def pick_jpg_folder_from_urls():
    """根据url路径获取图像文件整个文件夹"""
    for item in urlData:
        relativePath = item[1:item.rindex('\\')]
        sourceDir = os.path.join(filePath, relativePath)
        if not os.path.exists(sourceDir):
            print('该文件目录不存在：', sourceDir)
            continue
        print('拷贝文件夹：', sourceDir)
        copy_file(sourceDir)


def copy_file(soueceDir):
    """拷贝文件"""
    for root, dirs, files in os.walk(soueceDir):
        for name in files:
            sourcename = os.path.join(root, name)
            destDir = root.replace(filePath, destPath)
            if not os.path.exists(destDir):
                os.makedirs(destDir)
            destname = os.path.join(destDir, name)
            copyfile(sourcename, destname)


if __name__ == '__main__':
    """执行"""
    # get_mongo_data()
    get_mongo_data_from_txt()
    pick_jpg_folder_from_urls()
