# coding=utf-8
"""挑选img图像文件
安全包
@author   nuctech/training
@desc     挑选jpg图片用于源数据管理平台<AI筛图>模块。挑选出空包、危险包
@rootpath 根目录。`/民航现场图像原数据/广州白云机场` 路径的父级路径
@destPath 存放图像路径(文件夹)
@count    统计本次脚本执行拷贝的图像数量
@date     2020/03/23

注意：执行之前根据要求修改以下变量：1）rootPath；2）destPath；3）mongo_json_path
执行的时候后面带上导出类型。例如：python yourPath/ToolForPickRemoteImg.py -t danger
"""

import os
import json
import argparse
from shutil import copyfile

parse = argparse.ArgumentParser()
parse.add_argument('-t', '--type', required=True, default='test', help='需要拷贝的图像类型。danger or safe')
args = parse.parse_args()

if args.type == 'test':
    rootPath = 'D:/sourcedata/original/'   # -本地测试文件存放路径
    destPath = 'D:/sourcedata/pickDanger/' # -目标文件存放路径
    # -需要导出的文件mongo数据。json格式
    mongo_json_path = r'E:\Leeing\node\besame\test.json'
elif args.type == 'danger':
    rootPath = 'S:/'                     # -服务器img文件存放路径。带上后面的斜杠
    destPath = 'S:/pickDanger/'          # -服务器目标文件存放路径。带上后面的斜杠
    # -需要导出的文件mongo数据。使用的时候，请修改 🆘🆘🆘
    mongo_json_path = r'E:\Leeing\node\besame\py\sourcedata\20200323_sieve_image_danger_23370.json'
elif args.type == 'safe':
    rootPath = 'S:/'                     # -服务器img文件存放路径。带上后面的斜杠
    destPath = 'S:/pickSafe/'          # -服务器目标文件存放路径。带上后面的斜杠
    # -需要导出的文件mongo数据。使用的时候，请修改 🆘🆘🆘
    mongo_json_path = r'E:\Leeing\node\besame\py\sourcedata\20200323_sieve_image_safe_10000.json'


count = 0


def read_mongo_data_4_json():
    """读取数据
    从json文件中读取mongo中需要导出的数据
    """
    data = None
    with open(mongo_json_path, encoding='utf8') as f:
        data = f.readlines()
    return data


def pick_img(pick_data):
    """挑图"""
    global count

    total_count = len(pick_data)

    for item in pick_data:
        item = json.loads(item)
        beg = item['url'].index('/', 1)
        # beg = 0 # -本地测试，服务器拷贝是需要去掉
        end = item['url'].rindex('/')
        file_name = item['url'][end+1:]
        print(item['url'][beg+1:end])
        sourcedir = os.path.join(rootPath, item['url'][beg+1:end])
        img_fold_name = file_name[:file_name.rindex('.')]
        destdir = os.path.join(destPath, img_fold_name)
        # -处理图像文件名重复的问题。不好判断有几个重名，直接使用当前的count做唯一标识
        if os.path.exists(destdir):
            destdir = f'{destdir}({count})'
            os.makedirs(destdir)
        else:
            os.makedirs(destdir)
        # -将目标文件夹下的 xx.img 和 yyy.jpg 文件拷贝出来
        for f_item in os.listdir(sourcedir):
            searchname = os.path.join(sourcedir + '/', f_item)
            if os.path.isfile(searchname):
                if f_item.lower().endswith('.img') or f_item.lower().endswith('.jpg'):
                    destname = os.path.join(destdir + '/', f_item)
                    copyfile(searchname, destname)
        count += 1
        print(f'总共：{total_count}, 已拷：{count} -- 路径：{sourcedir}，名称：{file_name}')


if __name__ == '__main__':
    """执行"""
    pick_data = read_mongo_data_4_json()
    total = len(pick_data)
    pick_img(pick_data)
    print(f'本次拷贝图像总共数量：{total}')
    print(f'本次拷贝图像完成数量：{count}')
