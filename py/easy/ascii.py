# -*- coding: utf-8 -*-
"""图片转文字"""
from PIL import Image
import argparse

# 命令行输入参数处理
parser = argparse.ArgumentParser()

parser.add_argument('file') # 输入文件
parser.add_argument('-o', '--output') # 输出文件
parser.add_argument('-w', '--width', type=int, default=100) # 输出字符宽度
parser.add_argument('-hei', '--height', type=int, default=100) # 高度

# 获取参数
args = parser.parse_args()
print(args)

IMG = args.file
WIDTH = args.width
HEIGHT = args.height
OUTPUT = args.output

ascii_char = list(r"$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ")

# 将256灰度映射到70个字符上
def get_char(r, g, b, alpha=256):
    if alpha == 0:
        return ' '
    length = len(ascii_char)
    gray = int(0.2126 * r + 0.7152 * g + 0.0722 * b)

    unit = (256.0 + 1) / length
    return ascii_char[int(gray/unit)]

def img_2_text():
    """图像转文字"""
    im = Image.open(IMG)
    im = im.resize((WIDTH, HEIGHT), Image.NEAREST)

    text = ''

    for i in range(HEIGHT):
        for j in range(WIDTH):
            text += get_char(*im.getpixel((j, i)))
        text += '\n'

    print(text)

    # 字符花输出到文件
    if OUTPUT:
        with open(OUTPUT, 'w') as f:
            f.write(text)
    else:
        with open('output.txt', 'w') as f:
            f.write(text)

def main():
    img_2_text()

if __name__ == '__main__':
    main()