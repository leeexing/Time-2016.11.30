# coding=utf-8
"""
第一步：对指定的目录的图像移动
"""

import os
import shutil
import argparse
from shutil import copyfile

# parser = argparse.ArgumentParser()
# parser.add_argument('-s', '--src', help='包含jpg的源文件夹')
# parser.add_argument('-d', '--dest', help='目的文件夹')

filePath = r'F:\重庆江北机场\TFNCH-VII-160037\2019'
destPath = r'B:\暂不需要发放标注数据\重庆江北机场\TFNCH-VII-160037\2019'

# args = parser.parse_args()
# if args.src:
#     if not os.path.exists(args.src):
#         raise Exception('请验证源文件夹')
#     filePath = args.src
#     print('src:', args.src)
# else:
#     raise Exception('没有指定源文件夹')

# if args.dest:
#     if not os.path.exists(args.dest):
#         raise Exception('请验证目的文件夹')
#     destPath = args.dest
#     print('dest:', args.dest)
# else:
#     raise Exception('没有指定目的文件夹')

for root, dirs, files in os.walk(filePath):
    for name in files:
        ext = os.path.splitext(name)[-1]
        basename = os.path.splitext(name)[0]
        dir_uppers = [x.upper() for x in dirs]
        if ext == '.jpg' and ('%s.IMG' % basename in files or '%s.img' % basename in files) and 'HELIXSE' in dir_uppers:
            searchname = os.path.join(root, basename + '.jpg')
            # if os.path.exists(searchname):
            destdir = os.path.join(destPath, basename)
            if not os.path.exists(destdir):
                os.makedirs(destdir)
            destname = os.path.join(destdir, basename + '.jpg')
            shutil.copyfile(searchname, destname)
