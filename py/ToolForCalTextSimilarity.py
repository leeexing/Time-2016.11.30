# -*- coding: utf-8 -*-
"""
计算文本的相似度
 需要有：1）停用词库；2）结巴分词
"""

import codecs
import math

import jieba
from gensim import  corpora,models,similarities


title1 = '钻研业务，勤奋工作是安检职业道德规范的重要内容．'
title11 = '钻研业务，勤奋工作是安检职业道德规范的重要内容。'
title12 = '根据民航安检工作的行业特点，安检职业道德规范的基本内容有（）。'
title2 = '人员应当安检使用仪器对旅客进行安全检查，只有在从严时才可以采用手工对旅客进行安全检查'
title3 = '在安检现场，当某件被怀疑为爆炸物的物品有明显的证据证明是非爆炸物，判断其几乎没有杀伤力时，可不疏散旅客和其他人员，只做适当的警戒。'

title_test = '根据员工的待遇要求，安检工作必须在室内、常温、通风、干燥的环境下进行。'

all_doc = []
all_doc.append(title1)
all_doc.append(title2)
all_doc.append(title3)

stopwords = ['是', '的', '在', '对', '，', '。', '、', '.', '. ', '．']

def remove_stop_words(words):
    ret = [word for word in words if word not in stopwords]
    return ret


def test():
    """ no """

    all_doc_list = []
    for doc in all_doc:
        doc_list = remove_stop_words([word for word in jieba.cut(doc)])
        all_doc_list.append(doc_list)
    # print(all_doc_list)
    doc_test_list = remove_stop_words([word for word in jieba.cut(title_test)])
    # print(doc_test_list)
    dictionary = corpora.Dictionary(all_doc_list)
    corpus = [dictionary.doc2bow(doc) for doc in all_doc_list]
    doc_test_vec = dictionary.doc2bow(doc_test_list)
    # print(doc_test_vec)
    tfidf = models.TfidfModel(corpus)
    # print(tfidf[doc_test_vec])
    index = similarities.SparseMatrixSimilarity(tfidf[corpus], num_features=len(dictionary.keys()))
    sim = index[tfidf[doc_test_vec]]
    print(sim)
    for item in sim:
        print(item, '--')


def GetCOSDistance(array1, array2):
    """ no """
    fenmu = 0
    fenzi1 = 0
    fenzi2 = 0
    for i in range(len(array1)):
        fenmu += (array1[i] * array2[i]);
        fenzi1 += array1[i] * array1[i];
        fenzi2 += array2[i] * array2[i];
    fenzi = math.sqrt(fenzi1) + math.sqrt(fenzi2)
    if fenzi == 0:
        return 0;
    return round(fenmu / fenzi, 4);


def Task(text1, text2):
    str1_cut1 = list(jieba.cut(text1))
    str1_cut2 = list(jieba.cut(text2))

    allSet = [*set(str1_cut1 + str1_cut2)]
    print(allSet)
    allSet = [*set(str1_cut1)]
    for item in set(str1_cut2):
        if item not in str1_cut1:
            allSet.append(item)
    print(allSet)

    # str1OneHot = []
    # str2OneHot = []
    # for value in allSet:
    #     str1OneHot.append(str1_cut1.count(value))
    #     str2OneHot.append(str1_cut2.count(value))

    str1OneHot = list(range(len(allSet)))
    str2OneHot = list(range(len(allSet)))
    allDic = {}
    for i in range(len(allSet)):
        allDic[allSet[i]] = i
    for (key, value) in allDic.items():
        str1OneHot[value] = str1_cut1.count(key)
        str2OneHot[value] = str1_cut2.count(key)



    print(str1OneHot, str2OneHot)
    score = GetCOSDistance(str1OneHot, str2OneHot)
    print(score)

def main():
    """ no """
    # test()
    # Task(title2, title1)
    # Task(title1, title12)
    Task(title12, title1)


if __name__ == '__main__':
    main()
