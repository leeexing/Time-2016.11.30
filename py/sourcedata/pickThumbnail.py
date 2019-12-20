# -*- coding: utf-8 -*-
"""
    将嵌套很深的缩略图拷贝到一个目录

    ：考虑欠佳，将缩略图的目录结构也戴上了
"""

import os
import shutil

count = 0
base_search_path = r'E:\magi\thumbnail\nuctech_1\民航现场图像原数据'
des_save_path = r'E:\magi\thumbnail\nuctech_1'


def pick_thumbnail_to_one_folder(path_url):
    """开始批量命名"""
    global count

    for root, dirs, files in os.walk(path_url):
        # if count >= 5:
        #     return
        try:
            for name in files:
                current_path = os.path.join(root, name)
                if (not os.path.isdir(current_path)): # -不是目录，说明到了最下层，直接返回
                    print(f'current_path: ', current_path, count)
                    count += 1
                    shutil.move(current_path, des_save_path)
        except Exception as err:
            print('Error happend:%s' % str(err))
            print('[xxx] 报错图像为: ', current_path)


if __name__ == '__main__':
    pick_thumbnail_to_one_folder(base_search_path)
    print(count)
