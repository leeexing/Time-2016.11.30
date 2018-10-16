# -*- coding: utf-8 -*-
import re

# !可以好好理解 贪婪模式和非贪婪模式 的区别
text = 'Computer says "no." Phone says "yes."'
strpat = re.compile(r'\".*\"')
strpat2 = re.compile(r'\".*?\"')
print(
    strpat.findall(text),
    strpat2.findall(text),
    text.find('no'),
    sep='\n'
)

# !正确理解 分组和非捕获组 的区别
text_d = 'Today is 11/27/2012. PyCon starts 3/13/2013.'
datepat = re.compile(r'(\d+)/(\d+)/(\d+)')
datepat2 = re.compile(r'(\d+)/(?:\d+)/(\d+)') # -这里
print(
    datepat.findall(text_d),
    datepat2.findall(text_d),
)

# !跨行匹配，综合运用非捕获组
# * ():捕获组；(?:...):非捕获组
comment = re.compile(r'/\*(.*?)\*/')
comment1 = re.compile(r'/\*(.*?)\*/', re.DOTALL)
comment2 = re.compile(r'/\*((.|\n)*?)\*/')
comment3 = re.compile(r'/\*(?:(.|\n)*?)\*/')
comment4 = re.compile(r'/\*((?:.|\n)*?)\*/') # -👍(?:.|\n) 指定了一个非捕获组 (也就是它定义了一个仅仅用来做匹配，而不能通过单独捕获或者编号的组)
text_c = '/* this is a comment */'
text_c2 = '''/* this is a
    multiline comment */
'''
print(
    comment.findall(text_c),
    comment2.findall(text_c2),
    comment1.findall(text_c2),
    sep='\n'
)