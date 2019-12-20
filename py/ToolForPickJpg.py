# coding=utf-8
"""挑选jpg图像
   ~~~~~~~~~~

    @author   nuctech/training
    @desc     挑选jpg图片用于源数据管理平台<AI筛图>模块。挑选出空包、危险包
    @rootpath 为了确保最后需要在服务器上将 {空包} 图像单独 <拷贝> 出来，减少路径文件的困扰，复制文件架构的根级目录
    @filePath 要拷贝图像的路径(文件夹)
    @destPath 存放图像路径(文件夹)
    @count    统计本次脚本执行拷贝的图像数量
    @date     2019/12/3
"""

import os
from shutil import copyfile


rootPath = r'E:'
filePath = r'E:\民航现场图像源数据\广州白云机场'
destPath = r'E:\20191203'

count = 0


def pick_jpg():
    """挑图"""
    global count

    for root, dirs, files in os.walk(filePath):
        for name in files:
            basename, ext = os.path.splitext(name)
            if ext != '.jpg' or '_' in basename:
                continue
            # 确保有.img文件
            dir_uppers = [item.upper() for item in dirs]
            if ('{}.IMG'.format(basename) in files or '{}.img'.format(basename) in files) and 'HELIXSE' in dir_uppers:
                searchname = os.path.join(root, basename + '.jpg')
                relativePath = root.replace(rootPath, '')
                destdir = os.path.join(destPath, relativePath[1:])
                if not os.path.exists(destdir):
                    os.makedirs(destdir)
                destname = os.path.join(destdir, basename + '.jpg')
                copyfile(searchname, destname)
                # 有输出，程序不慌
                if count % 100 == 0:
                    print(f'拷贝了{count:,} 副图像。最近一幅：{name}')
                count += 1


if __name__ == '__main__':
    """执行"""
    pick_jpg()
    print(f'本次拷贝图像数量：{count:,}')
