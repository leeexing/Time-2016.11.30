# -*- coding: utf-8 -*-
"""
爬取智慧查验考题库
"""

import re
import time
import json
# import pymongo
import requests
from queue import Queue
from multiprocessing import Process, Pool
from bs4 import BeautifulSoup


# client = pymongo.MongoClient('localhost', 27017)
# db_topic = client['smartirsecurity']['topic']


reg_topic_type = re.compile(r'【(\w+)】')
type_list = ['', '单选题', '多选题', '判断题']

list_topic = []


def get_topics(url):
    """ no """
    global list_topic

    print(f'[INFO]请求url：{url}')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
        'host': 'course.smartirsecurity.com',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'charset': 'utf8',
        'Cookie': '__RequestVerificationToken=lZ1XpmFLpSkcniCHJWmCV4twZnHV7YP-06IDhCt9t5lkUXF_AAaIXmG3Edmv64p-uJEl0s6nmsj6m0TiocNyLIY5Y5FtvGMdPVM75vKd5OI1; Hm_lvt_1bcfe93f9c954daa35fa07815202eb80=1582788051; ASP.NET_SessionId=lrm1i1h3ptcsvyzi5sk4ffeq; .AspNet.ApplicationCookie=15JAfztGcfHO9RNn7e44YAzCKufLKEU9YpZNQkKyoumX8P5XXhdM8kWLxsI-BM5O_2NxU9TJcEwp4w-tH_pm7Ok7r3cQWoFIuwIXaYJdzf2qPp-Q93Mk-WXRkKIufzLSWK_Ri0D9h-_PAcfGwmhNOW1qqA-D_J6LCRjOONpJwTXqHZVcxdmx79adKJOWmCA7w_ahGLFGASdx4O5k2T878KZwjul1PtXZ1obCBJ5Qp6IJg3fJih7rJeagV_recwP1oTG2ZgyWLRvcZ-SWFbeVmOCGdkub7Zxw4Q6NqwoiuZtlsFKFoXii3PZ2WkNfhUGg9Ed4zF-cI3Gd02qIzOb8lLk5EdxS2EyJKdnTvx54D2aXtL68TiCYh-8cw5RswQlEii3KRhJa9V60maQYK-iDAFgF0EsxpF4q8oPJmeTF5E89eZr8lEDJg9gBC6To3XzmgG4P14L5OkWw1SrDSlohsOEVyMduKp8b-gRcccF12xDEvb80k8D_5J-JyQkQjG8K-k5zb2AT_RqL4IJOTwADR-pXw-lizpeuLHEisuCliQrZY7SvZnzkh3NwHyGUI1ncZLTobvkL5Oy2nKBYdEWpR6RM4EHLSggojsrHChdAwqS8YTeFWXKkt8ZIInuKiTU-a3xL_xKwGq3JXQwRk7AImgsNK7a7WUiEW2Yr0_jEtZM2TKn64NnCXl1wUD1Iid2BXcmVIRynS88Do8o7_LBldbGwlv62Y0Af1VB8IpYoAZPvEVX4wG1T48km43uHYUm16qRzt8Hm2dS0QkcWakblqUeZyLlweUtt98AYi1Nqy0oS5CIYpZVGfaphzZaRwOwWK8Rko3oJV752DRwJhAMwnUeZd_UeSA8EpSs6f6wlc96b9rn-7WeNeKouALvffldf9B_AtZHbpdTgyePihfQ0as0MtUX9MQx8qk9BNfvZrJcD9uGesaVNba4AHNO4o69p; Hm_lpvt_1bcfe93f9c954daa35fa07815202eb80=1583050896'
    }
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.content, 'lxml')
    topics = soup.select('#container .block-item')
    for topic in topics:
        title_text = topic.select('.question-head .title')[0].get_text()
        obj = {
            'number': int(topic.attrs['data-id']),
            'difficulty': topic.select('.difficulty')[0].get_text()[3],
            'importance': topic.select('.importance')[0].get_text()[3:],
            'accuracy': topic.select('.accuracy')[0].get_text()[4:],
            'source': topic.select('.question-meta-secondary p span')[3].get_text()[3:],
            'identity': topic.select('.question-head .identity')[0].get_text(),
            'type': type_list.index(reg_topic_type.match(title_text).groups()[0]),
            'title': re.sub(reg_topic_type, '', title_text),
            'detail_href': 'http://course.smartirsecurity.com' + topic.select('.question-head a')[0].attrs['href'],
        }
        category_list = topic.select('.ul-categories li')
        category = []
        for item in category_list:
            category.append(item.get_text())
        obj['category'] = category
        detail_content = requests.get(obj['detail_href'], headers=headers).content
        print(f'[DETAIL]请求url：{obj["detail_href"]}')
        list_option = []
        soup_detail = BeautifulSoup(detail_content, 'lxml')
        options = soup_detail.select('.question-answer-info li')
        for item in options:
            options_obj = {
                'title': item.select('.option-text')[0].get_text(),
                'tag': item.select('.code')[0].get_text(),
                'isRight': 'checked' in item.select('label')[0].attrs['class'],
            }
            list_option.append(options_obj)
        obj['options'] = list_option
        obj['analysis'] = soup_detail.select('.editor-style')[0].get_text().strip()
        obj['industry'] = soup_detail.select('.detail-list-info dl dd')[-1].get_text()
        # 写入数据库
        # db_topic.insert_one(obj)

        # list_topic.append(obj)

    # print(list_topic)




def main():
    """ no """
    url_list = [f'http://course.smartirsecurity.com/questionmanage/questions?page={item}&SortBy=1&X-Requested-With=XMLHttpRequest' for item in range(1, 30)]
    # 创建并启动线程
    with Pool(8) as pool:
        pool.map(get_topics, url_list)
        pool.close()
        pool.join()


if __name__ == '__main__':
    start = time.time()
    main()
    print('[info]耗时：%s' % (time.time()-start))
