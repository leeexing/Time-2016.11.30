# -*- coding: utf-8 -*-
"""挑选危险包

    description 从所有包含危险品的图像文件中，跳转特定的危险品图像。用于制作过年安检特定考题
"""

import os
import shutil
import re
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from datetime import datetime
from pymongo import MongoClient

root_path = r'E:\test\weixianbao'
base_search_path = r'E:\test\weixianbao'
base_dest_path = r'E:\test\tiaoxuanbao'

# - db
# conn = MongoClient(host='127.0.0.1:27017') # 开发环境
# conn = MongoClient(host='mongodb://root:root123@10.15.225.23:27017/admin') # 测试环境
# conn = MongoClient(host='mongodb://root:root123@52.80.171.106:27017/admin') # 生产环境
# mongodb = conn.sourceData
# print(list(mongodb.sieve_image.find().limit(10))) # 测试mongo是否可以连接成功

count = 0 # 总共扫面的图像数量
pick_count = 0 # 挑选的图像数量

# -用于过滤txt包含关键字段的危险品图像
red_list = ['烟花爆竹', '烟饼', '礼花弹', '其它烟火类', '雷管', '爆炸装置', '非金属机身打火机', '金属机身打火机', '点烟器', '镁棒', '火柴', '异型点烟器/打火机', 'ZIPPO油', '打火机气', '其它易燃品', '喷雾']
zh_reg = re.compile(r'[\u4e00-\u9fa5]+/?[\u4e00-\u9fa5]*')


def structure_file_to_db(path_url):
    """开始批量命名"""
    global count, pick_count

    for root, dirs, files in os.walk(path_url):
        # if count >= 50:
        #     return
        try:
            for name in files:
                current_path = os.path.join(root, name)
                if (not os.path.isdir(current_path)): # -不是目录，说明到了最下层，直接返回
                    basename, ext = os.path.splitext(name)
                    basename_label = basename + '_label.txt'
                    source_txt_path = os.path.join(root, basename_label)
                    if ext.lower() == '.jpg' and basename_label in files:
                        count += 1
                        with open(source_txt_path, 'r', encoding='utf8') as f:
                            data = f.readlines()
                            has_key_word = False
                            for item in data:
                                words = zh_reg.findall(item)
                                if not has_key_word and words[0] in red_list:
                                    has_key_word = True
                            if has_key_word:
                                pick_count += 1
                                print(f'current_path: ', current_path, '，总共:', count, '，挑选:', pick_count)
                                save_original_folder_path = os.path.join(base_dest_path, basename)
                                if not os.path.exists(save_original_folder_path):
                                    os.makedirs(save_original_folder_path)
                                save_original_image_path = os.path.join(save_original_folder_path, name)
                                save_original_txt_path = os.path.join(save_original_folder_path, basename_label)
                                shutil.copyfile(current_path, save_original_image_path)
                                shutil.copyfile(source_txt_path, save_original_txt_path)
        except Exception as err:
            print('Error happend:%s' % str(err))
            print('[xxx] 报错图像为: ', current_path)


if __name__ == '__main__':
    structure_file_to_db(base_search_path)
    print(f'图像捞取结束。总共 {count} 副图像，符合目标的图像 {pick_count} 副。')
