# -*- coding: utf-8 -*-
"""文件夹中的文件结构化入库"""
import os
import math
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from datetime import datetime
from pymongo import MongoClient

base_path = r'E:\magi'
base_origin_path = r'E:\magi\original'
base_thumb_path = r'E:\magi\thumbnail'

save_origin_path = r'image_sieve/'

batch_name = '20191128'
# userIDs = ['12', '13'] # 测试环境的用户ID
userIDs = ['3', '4'] # 生产环境的用户ID

original_batch_path = os.path.join(base_origin_path, batch_name)
thumbnail_batch_path = os.path.join(base_thumb_path, batch_name)


# conn = MongoClient(host='127.0.0.1:27017') # 开发环境
# conn = MongoClient(host='mongodb://root:root123@10.15.225.23:27017/admin') # 测试环境
conn = MongoClient(host='mongodb://root:root123@52.80.171.106:27017/admin') # 生产环境
mongodb = conn.sourceData

# print(list(mongodb.brushing_image.find().limit(10)))

count = 0

def get_userID_by_count(count):
    if count < 1000:
        return userIDs[0]
    elif count < 2000:
        return userIDs[1]

def structure_file_to_db(path_url):
        """开始批量命名"""
        global count

        for currentDir in os.listdir(path_url):
            current_path = os.path.join(path_url, currentDir)
            try:
                if (not os.path.isdir(current_path)): # -不是目录，说明到了最下层，直接返回
                    # print('current_path: ', current_path)
                    image_name, fileExtension = os.path.splitext(current_path)

                    # if fileExtension.lower() == '.jpg' and '_thumb' in image_name:
                    #     os.remove(current_path)

                    if fileExtension.lower() == '.jpg' and not '_thumb' in image_name:
                        count += 1
                        image_url = image_name.replace(base_origin_path, '')
                        image_mongo_url = Path(current_path.replace(base_origin_path, '')).as_posix() # 只保留到批次的路径地址。将反斜杠 '\' 转为linux斜杠 '/'。存到mongo中
                        image_folder_name = image_url[image_url.rfind('\\') + 1:] # 表示图像文件所在文件夹的名称，也就是图像的名称
                        thumbnail_name = image_folder_name + '_thumb.jpg'
                        thumbnail_save_url =  os.path.join(thumbnail_batch_path, thumbnail_name)
                        thumbnail_mongo_url = Path(thumbnail_save_url.replace(base_thumb_path, '')).as_posix() # 只保留到批次的路径地址。将反斜杠 '\' 转为linux斜杠 '/'
                        mongo_item = {
                            'name': image_folder_name,
                            'url': image_mongo_url,
                            'thumbnailUrl': thumbnail_mongo_url,
                            'batch': batch_name,
                            'userID': get_userID_by_count(count),
                            'type': None,
                            'tag': None,
                            'sieved': False,
                            'createTime': datetime.now(),
                            'modifyTime': datetime.now(),
                        }
                        mongodb.sieve_image.insert_one(mongo_item)
                        generate_thumbnail(current_path, thumbnail_save_url)
                        generate_water_mark(current_path)
                    else:
                        # -删除不需要的图像和txt文件
                        os.remove(current_path)
                else:
                    structure_file_to_db(current_path)
            except Exception as err:
                print('Error happend:%s' % str(err))
                print('[xxx] 报错图像为: ', current_path)
                # continue

def generate_water_mark(url):
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
    out.save(url)


def generate_thumbnail(url, thumbnail_save_url):
    print('图像缩略图保存地址：', thumbnail_save_url)
    img = Image.open(url)
    width, height = img.size
    img.thumbnail((100, math.ceil(100 * height / width)))
    img = img.convert('RGB')
    img.save(thumbnail_save_url)


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
    path_url = original_batch_path
    if init():
        print('start ~')
        structure_file_to_db(path_url)
    print(count)
    # structure_file_to_db(path_url)
    # test()
    # water_mark()

