from PIL import Image
import os
import sys

# 定义可以识别的图片文件类型，可以自行扩充
valid_file_type = ['.jpg', '.png']
# 定义压缩比，数值越大，压缩越小
SIZE_normal = 1.0
SIZE_small = 1.5
SIZE_more_small = 2.0


def make_directory(directory):
    """创建目录"""
    os.makedirs(directory)


def directory_exists(directory):
    """判断目录是否存在"""
    if os.path.exists(directory):
        return True
    else:
        return False


def list_img_file(directory):
    """列出目录下所有文件，并筛选出图片文件列表返回"""
    old_list = os.listdir(directory)
    # print old_list
    new_list = []
    for filename in old_list:
        if os.path.isfile(filename):
            f, e = os.path.splitext(filename)
            if e in valid_file_type:
                new_list.append(filename)
            else:
                pass
        else:
            pass
    # print new_list
    return new_list


def print_help():
    print """
    This program helps compress many image files
    you can choose which scale you want to compress your img(jpg/png/etc)
    1) normal compress(4M to 1M around)
    2) small compress(4M to 500K around)
    3) smaller compress(4M to 300K around)
    """


def compress(choose, des_dir, file_list):
    """压缩算法，img.thumbnail对图片进行压缩，还可以改变宽高数值进行压缩"""
    if choose == '1':
        scale = SIZE_normal
    if choose == '2':
        scale = SIZE_small
    if choose == '3':
        scale = SIZE_more_small
    for infile in file_list:
        img = Image.open(infile)
        # size_of_file = os.path.getsize(infile)
        w, h = img.size
        img.thumbnail((int(w/scale), int(h/scale)))
        img.save(des_dir + '/' + infile)


if __name__ == "__main__":
    src_dir, des_dir = sys.argv[1], sys.argv[2]
    if directory_exists(src_dir):
        if not directory_exists(des_dir):
            make_directory(des_dir)
        # business logic
        file_list = list_img_file(src_dir)
        # print file_list
        if file_list:
            print_help()
            choose = raw_input("enter your choice:")
            compress(choose, des_dir, file_list)
        else:
            pass
    else:
        print "source directory not exist!"
