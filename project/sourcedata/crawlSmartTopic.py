# -*- coding: utf-8 -*-
"""
爬取智慧查验 课件
"""

import re
import os
import time
import json
import pymongo
import requests
from bs4 import BeautifulSoup


# client = pymongo.MongoClient('localhost', 27017)
# db_topic = client['smartirsecurity']['topic']

# reg_topic_type = re.compile(r'【(\w+)】')
# type_list = ['', '单选题', '多选题', '判断题']

dest_path = r'E:\workinghard\smartirsecurity\course'

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
    'Host': 'course.smartirsecurity.com',
    'Pragma': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
    'charset': 'utf8',
    'Cookie': '__RequestVerificationToken=lZ1XpmFLpSkcniCHJWmCV4twZnHV7YP-06IDhCt9t5lkUXF_AAaIXmG3Edmv64p-uJEl0s6nmsj6m0TiocNyLIY5Y5FtvGMdPVM75vKd5OI1; ASP.NET_SessionId=lrm1i1h3ptcsvyzi5sk4ffeq; Hm_lvt_1bcfe93f9c954daa35fa07815202eb80=1588998645; .AspNet.ApplicationCookie=-refJyKd34dd4ZTnZqNF0-JUNKq24sDHuaZqLcpJ3Voh_5ZI44Vu3ro_hWXX9-LMfI1Ags3Gq_XiEYPiAKk0mD0QlQCtpQx3e8AtV_4yFXuE5U0H3AclMwq1gP_ETKoP6buUPXWLV6BhaFzTS_IVJx-otkN-Xh91DwaxoPbOq64hQvqeIT3Rtq6nRaMBX3Gv_IZfvy-YHL0wCJREleNE9tlUD2__QToPa_7lIqS7WdR_2Gh45a5S66DcqNqzhB2EqtE9FtyWPRQ8sD0vZwTVCf82MiwJswJMimF1VKn5ZbKnoet65dYP-XUi_unUmhnk6CBxjUd8jh9IEPa0eOAII35A8VP5uoPibLHlEZaYwSov2g19WWCU-d8ygk1IJvgI8fIeyFp2eVnKwekXYaviImyVnImhtMPfMau4SaKUTZQJnNBHC_8wa-rWmIqoMMxthnyqgIfHU29gLfUKJL4NuD8Tt__tlBA9TgkdkxuVa0QYdTrlSc2O0tQ7ClEZk79Cswx8s_m_JuyvF6c2gFJ8tLTLBezJV3KfIMNiKlsvkp6KJSQVZq-lAckHQPWCHzVq-_sS9THzemOPVlpNXWqSyE-Uv693AjL8Og6BErir-gl3NAq64p5o1agpYFg0UlVdGeO6Xdmm7icynHTEUyFNxiXdwsLT1eqPlUk1qiaLDNkHZRf1JvHrAckBtxrr1t_HrzdijfZYBhnAUbDS_8DZqOg9Iz_eslnHZnYWG3Cn284D0FopfXud_9lpTpmaqBg6E9mxQ61JkU00R5GH59X9-znkuvf7_3JMFl83MjKdPgoAV6quNfaIJgp29COz6dcj95mpbIdKzCNmhjv3w3dXNtBjY8mBPz3Cpci_CFZQVSeeaGhKoFoOmYOlIyKiJygaqDKSooEXvTxTbbQEGMW61MEip3vGEn-Dqyg7OfbO6rnaL5BgcY3QobKBD74w5WAs; Hm_lpvt_1bcfe93f9c954daa35fa07815202eb80=1589869715'
}


def get_topics(url):
    """ no """
    print(f'[INFO]请求url：{url}')
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.content, 'lxml')
    topics = soup.select('#courseware-list .block-item')
    for index, topic in enumerate(topics):
        title_text = topic.select('.courseware-head .title')[0].get_text()
        title_meta = topic.select('.courseware-meta .status')[0].get_text()
        href = topic.select('.btnPreview')[0].attrs['href']
        if '已发布' in title_meta:
            load_topic_detail(href, title_text)
        else:
            print('暂未生效的获取课件', ' --- ', title_text)


def load_topic_detail(url, title):
    """获取课件内容详情
    ..只获取图像的信息
    ..课件中带有的音频信息不获取
    """
    try:
        print(f'[DETAIL]请求url：{url}')
        course_folder = os.path.join(dest_path, title)
        print(f'课件文件夹路径：===== {course_folder} =====')
        if not os.path.exists(course_folder):
            os.mkdir(course_folder)
        detail_headers = {**headers}
        detail_headers['Host'] = 'common.smartirsecurity.com'
        detail_content = requests.get(url, headers=detail_headers).content
        soup_detail = BeautifulSoup(detail_content, 'lxml')
        ppt_list = soup_detail.select('#panel-content .list-item')
        img_headers = {**detail_headers}
        img_headers['Referer'] = url
        for index, ppt in enumerate(ppt_list, 1):
            img_page_src = ppt.select('a')[0].attrs['href']
            img_page_src = 'http://common.smartirsecurity.com' + img_page_src.replace('gotopage', 'preview')
            img_page_content = requests.get(img_page_src, headers=img_headers).content
            soup_img_page = BeautifulSoup(img_page_content, 'lxml')
            img_src = soup_img_page.select('#viewOriginalImage')[0].attrs['src']
            print('图像地址：', img_src)
            img_name = f'{index}.jpg'
            img_path = os.path.join(course_folder, img_name)
            img_content = requests.get(img_src).content
            with open(img_path, 'wb') as f:
                f.write(img_content)
    except Exception as err:
        print(err)



def main():
    """ no """
    for item in range(1, 11):
        print(f'[LOG] 爬取第 {item} 页的课件内容 。。。')
        url = f'http://course.smartirsecurity.com/coursewaremanage?page={item}&SortBy=1&X-Requested-With=XMLHttpRequest'
        get_topics(url)


if __name__ == '__main__':
    start = time.time()
    main()
    print('[info]耗时：%s' % (time.time()-start))
