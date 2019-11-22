# -*- coding: utf-8 -*-
"""文件夹中的文件结构化入库"""
import os
import math
from PIL import Image
from pathlib import Path
from datetime import datetime
from pymongo import MongoClient

base_path = r'E:\magi'
base_origin_path = r'E:\magi\original'
base_thumb_path = r'E:\magi\thumbnail'

save_origin_path = r'image_sieve/'

batch_name = '20191122'
userID = '5b3dc3f879e28d2594cfb772'

original_batch_path = os.path.join(base_origin_path, batch_name)
thumbnail_batch_path = os.path.join(base_thumb_path, batch_name)


conn = MongoClient(host='127.0.0.1:27017')
mongodb = conn.sourcedata

count = 0

def structure_file_to_db(path_url):
        """开始批量命名"""
        global count

        for currentDir in os.listdir(path_url):
            current_path = os.path.join(path_url, currentDir)
            try:
                if (not os.path.isdir(current_path)): # -不是目录，说明到了最下层，直接返回
                    print('file: ', current_path)
                    image_name, fileExtension = os.path.splitext(current_path)

                    # if fileExtension.lower() == '.jpg' and '_thumb' in image_name:
                    #     os.remove(current_path)
                    if fileExtension.lower() == '.jpg' and not '_thumb' in image_name:
                        count = count + 1
                        image_url = image_name.replace(base_origin_path, '')
                        image_mongo_url = Path(current_path.replace(base_origin_path, '')).as_posix()
                        filename = os.path.join(thumbnail_batch_path, image_url[image_url.rfind('\\') + 1:])
                        thumbnail_save_url = filename + '_thumb.jpg'
                        mongo_item = {
                            'url': image_mongo_url,
                            'thumbnailUrl': Path(thumbnail_save_url.replace(base_thumb_path, '')).as_posix(),
                            'batch': batch_name,
                            'userID': userID,
                            'type': '',
                            'tag': '',
                            'sieved': False,
                            'createTime': datetime.now(),
                            'modifyTime': datetime.now(),
                        }
                        mongodb.sieve_image.save(mongo_item)
                        generate_thumbnail(current_path, thumbnail_save_url)
                else:
                    print('=== 文件夹 ===', current_path)
                    structure_file_to_db(current_path)
            except Exception as err:
                print('Error happend:%s' % str(err))
                print('[xxx] 报错图像为: ', current_path)
                # continue


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


if __name__ == '__main__':
    path_url = original_batch_path
    # if init():
    #     print('start ~')
    #     structure_file_to_db(path_url)
    structure_file_to_db(path_url)
    print(count)
    # test()

