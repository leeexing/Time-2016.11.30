# -*- coding: utf-8 -*-
"""图像文字识别
:description 需要注册百度云账号，申请一个应用
"""

import cv2
from aip import AipOcr

# 你的 APPID AK SK  图2的内容
APP_ID = '18416769'
API_KEY = 'KmzXZX3Msb9yz5lUyuIowSwm'
SECRET_KEY = 'zqUGo8k9CYxFXL0Gil6YqcroMZaiYgp4'

client = AipOcr(APP_ID, API_KEY, SECRET_KEY)

fname = r'C:/Users/lixing1/Desktop/源数据平台/标记嫌疑框算法逻辑.png'

# 读取图片
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()

image = get_file_content(fname)

# 调用通用文字识别, 图片参数为本地图片
results = client.general(image)["words_result"]  # 还可以使用身份证驾驶证模板，直接得到字典对应所需字段

img = cv2.imread(fname)
for result in results:
    text = result["words"]
    location = result["location"]

    print(text)
    # 画矩形框
    # cv2.rectangle(img, (location["left"],location["top"]), (location["left"]+location["width"],location["top"]+location["height"]), (0,255,0), 2)

# cv2.imwrite(fname[:-4]+"_result.jpg", img)

# if __name__ == '__main__':
#     # test()
#     main()
