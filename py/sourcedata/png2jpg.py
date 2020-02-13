# -*- coding: utf-8 -*-
"""png转jpg

:description 春运保障。将png -> jpg。图像变小。请求更快。带宽减少
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont


base_origin_path = r'D:\sourcedata\2020春运保障'
base_source_path = r'D:\sourcedata\2020_spring'

count = 0


def png_2_jpg(path_url):
    """主程序"""
    global count

    for root, dirs, files in os.walk(path_url):
        try:
            for name in files:
                # if count >= 5:
                #     return False
                count += 1
                source_dir = root.replace(base_origin_path, base_source_path)
                if not os.path.exists(source_dir):
                    os.makedirs(source_dir)
                current_path = os.path.join(root, name)
                source_path = current_path.replace(base_origin_path, base_source_path)
                img = Image.open(current_path)
                width, height = img.size
                save_img = img.convert('RGB')
                save_img.save(source_path)
                print('current_path', current_path, ' 处理图像数量：', count)
        except Exception as err:
            print('Error happend:%s' % str(err))
            print('[xxx] 报错图像为: ', current_path)


if __name__ == '__main__':
    png_2_jpg(base_origin_path)
    print(f'总共图像：{count}')