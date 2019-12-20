# -*- coding: utf-8 -*-
"""文件夹中的文件结构化入库"""
import os
import math
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from datetime import datetime
from pymongo import MongoClient

root_path = r'D:\sourcedata\original'
base_search_path = r'D:\sourcedata\original\nuctech_1'
base_origin_path = r'D:\sourcedata\original'
base_thumb_path = r'D:\sourcedata\thumbnail'

save_origin_path = r'image_sieve/' # -暂时没有用到

batch_name = 'nuctech_1' # -批次名称
batch_cname = '白云机场' # -批次中文名

original_batch_path = os.path.join(base_origin_path, batch_name)
thumbnail_batch_path = os.path.join(base_thumb_path, batch_name)

# - db
# conn = MongoClient(host='127.0.0.1:27017') # 开发环境
conn = MongoClient(host='mongodb://root:root123@10.15.225.23:27017/admin') # 测试环境
# conn = MongoClient(host='mongodb://root:root123@52.80.171.106:27017/admin') # 生产环境
mongodb = conn.sourceData
# print(list(mongodb.sieve_image.find().limit(10))) # 测试mongo是否可以连接成功

count = 0 # 用户给不同用户分配图像的变量


def generate_new_batch(count):
    """生成批次名"""
    global batch_name, original_batch_path, thumbnail_batch_path

    index =  count // 50000 + 1
    batch_name = f'nuctech_{index}'
    print(batch_name)

    original_batch_path = os.path.join(base_origin_path, batch_name)
    thumbnail_batch_path = os.path.join(base_thumb_path, batch_name)

    if not os.path.exists(original_batch_path):
        os.makedirs(original_batch_path)

    if not os.path.exists(thumbnail_batch_path):
        os.makedirs(thumbnail_batch_path)


def structure_file_to_db(path_url):
    """开始批量命名"""
    global count

    for root, dirs, files in os.walk(path_url):
        if count >= 5:
            return
        if count % 500 == 0:
            generate_new_batch(count)
        try:
            for name in files:
                current_path = os.path.join(root, name)
                if (not os.path.isdir(current_path)): # -不是目录，说明到了最下层，直接返回
                    print(f'current_path: < {batch_name} >: ', current_path, count)
                    basename, ext = os.path.splitext(name)
                    count += 1
                    # image_file, fileExtension = os.path.splitext(current_path)
                    image_url = root.replace(root_path, '')
                    image_folder_name = image_url[1:]
                    save_original_folder_path = os.path.join(original_batch_path, image_folder_name)
                    if not os.path.exists(save_original_folder_path):
                        os.makedirs(save_original_folder_path)
                    # 所掳如图就放在批次路径下
                    # save_thumbnail_folder_path = os.path.join(thumbnail_batch_path, image_folder_name)
                    # if not os.path.exists(save_thumbnail_folder_path):
                    #     os.makedirs(save_thumbnail_folder_path)
                    save_original_image_path = os.path.join(save_original_folder_path, name)
                    save_thumbnail_image_path = os.path.join(thumbnail_batch_path, basename + '_thumb.jpg')
                    mongo_original_url = os.path.join(f'/{batch_name}', image_url[1:], name).replace('\\', '/')
                    mongo_thumbnail_url = os.path.join(f'/{batch_name}', basename + '_thumb.jpg').replace('\\', '/')
                    print('image_url', image_url)
                    print('水印图mongo地址：', mongo_original_url)
                    print('缩略图mongo地址：', mongo_thumbnail_url)
                    print('水印图local地址：', save_original_image_path)
                    print('缩略图local地址：', save_thumbnail_image_path)
                    # generate_water_mark(current_path, save_original_image_path)
                    # generate_thumbnail(current_path, save_thumbnail_image_path)
                    # mongo_item = {
                    #     'name': basename,
                    #     'url': mongo_original_url,
                    #     'thumbnailUrl': mongo_thumbnail_url,
                    #     'batch': batch_name,
                    #     'userID': None,
                    #     'type': None,
                    #     'tag': None,
                    #     'sieved': False,
                    #     'createTime': datetime.now(),
                    #     'modifyTime': None,
                    # }
                    # mongodb.sieve_image.insert_one(mongo_item)
        except Exception as err:
            print('Error happend:%s' % str(err))
            print('[xxx] 报错图像为: ', current_path)


def generate_water_mark(url, save_url):
    """生成图像水印"""
    img = Image.open(url)
    width, height = img.size
    layer = img.convert('RGBA')
    font = ImageFont.truetype('./test.simhei.ttf', 48)
    text = Image.new('RGBA', layer.size, (204, 232, 207, 0))
    img_draw = ImageDraw.Draw(text)
    img_draw.text((10, 10), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width / 2 - 100, height / 2 - 80), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width / 2, height / 2 + 80), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width - 180, height - 60), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    out = Image.alpha_composite(layer, text)
    out = out.convert('RGB')
    out.save(save_url)


def generate_thumbnail(url, save_url):
    """生成缩略图"""
    img = Image.open(url)
    width, height = img.size
    img.thumbnail((100, math.ceil(100 * height / width)))
    img = img.convert('RGB')
    img.save(save_url)


def init():
    """检查缩略图是否有对应的批次文件夹"""
    if not os.path.exists(original_batch_path):
        print('❌  错误！！，没有该批次的拷贝文件')
        return False
    if os.path.exists(thumbnail_batch_path):
        print('❌  请再次确认，此文件夹已存在！！！')
        return False
    else:
        os.mkdir(thumbnail_batch_path)
        return True


def test():
    img = Image.open('E:\magi\XT2100HS0120190205000145\XT2100HS0120190205000146\XT2100HS0120190205000160\XT2100HS0120190205000160.jpg')
    width, height = img.size
    print(width, height)
    img.thumbnail((100, math.ceil(100 * height / width)))
    img = img.convert('RGB')
    img.save('./_thumb.jpg')


def water_mark():
    """png图片多一个通道，alpha，图片大许多"""
    img = Image.open('E:/magi/original/20191125/XT2100HS0120190205000025/XT2100HS0120190205000025.jpg')
    width, height = img.size
    layer = img.convert('RGBA')
    font = ImageFont.truetype('./test.simhei.ttf', 48)
    text = Image.new('RGBA', layer.size, (204, 232, 207, 0))
    img_draw = ImageDraw.Draw(text)
    img_draw.text((10, 10), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width / 2 - 100, height / 2 - 80), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width / 2, height / 2 + 80), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    img_draw.text((width - 180, height - 60), 'NUCTECH', font=font, fill=(204, 204, 204, 150))
    out = Image.alpha_composite(layer, text)
    out = out.convert('RGB')
    out.save('./_thumb.jpg')


if __name__ == '__main__':
    path_url = base_search_path
    # if init():
    #     print('start ~')
    #     structure_file_to_db(path_url)
    structure_file_to_db(path_url)
    # structure_file_to_db_walk()
    print(count)

