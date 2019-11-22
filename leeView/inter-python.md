# inter-python

> python 常用的备忘录

* gunicorn + docker 的使用

## 常用包

### gunicon

结合 supervisor 就另外说了

这里想说的是，单独使用的情况下。需要注意的点。比如在 docker 中就可能单纯的使用 gunicorn

常用

config
-c CONFIG, --config CONFIG

Gunicorn配置文件路径，路径形式的字符串格式，如：

gunicorn -c gunicorn.conf manager:app

bind
-b ADDRESS, --bind ADDRESS

Gunicorn绑定服务器套接字，Host形式的字符串格式。Gunicorn可绑定多个套接字，如：

gunicorn -b 127.0.0.1:8000 -b [::1]:9000 manager:app

workers
-w INT, --workers INT

用于处理工作进程的数量，为正整数，默认为1。worker推荐的数量为当前的CPU个数*2 + 1。计算当前的CPU个数方法：

worker_class
-k STRTING, --worker-class STRTING

要使用的工作模式，默认为sync。可引用以下常见类型“字符串”作为捆绑类：

daemon
--daemon

守护Gunicorn进程，默认False

accesslog
--access-logfile FILE

要写入的访问日志目录

errorlog
--error-logfile FILE, --log-file FILE

要写入错误日志的文件目录。

参考：[Gunicorn-配置详解](https://blog.csdn.net/y472360651/article/details/78538188)

### AES\pyCrypto\pycryptodome

> 安装pyCrypto真是一个坑啊

REFER: https://blog.csdn.net/HH775313602/article/details/78991340

from Crypto.Cipher import AES

## format

### 数字格式化

```python
print("{:.2f}".format(3.1415926));

print("test{:0>4f}".format(3)); # test0003

print("test{:x<4f}".format(3)); # test3xxx
```

```python
3.1415926   {:.2f}    3.14        保留小数点后两位
3.1415926   {:+.2f}   +3.14       带符号保留小数点后两位
-1          {:+.2f}   -1.00       带符号保留小数点后两位
2.71828     {:.0f}    3           不带小数
5           {:0>2d}   05          数字补零 (填充左边, 宽度为2)
5           {:x<4d}   5xxx        数字补x (填充右边, 宽度为4)
10          {:x<4d}   10xx        数字补x (填充右边, 宽度为4)
1000000     {:,}      1,000,000   以逗号分隔的数字格式
0.25        {:.2%}    25.00%      百分比格式
1000000000  {:.2e}    1.00e+09    指数记法
13          {:10d}    13          右对齐  (默认, 宽度为10)
13          {:<10d}   13           左对齐  (宽度为10)
13          {:^10d}   13          中间对齐 (宽度为10)
```

## 继承

我们定义一个class的时候，可以从某个现有的class继承，新的class称为子类（Subclass），而被继承的class称为基类、父类或超类（Base class、Super class）。

继承类的构造方法：

1. 经典类的写法： 父类名称.__init__(self,参数1，参数2，...)
2. 新式类的写法：super(子类，self).__init__(参数1，参数2，....)

```python
class Person(object):
    def __init__(self, name, gender):
        self.name = name
        self.gender = gender

class Student(Person):
    def __init__(self, name, gender, score):
        super(Student, self).__init__(name, gender)
        self.score = score

# 一定要用 super(Student, self).__init__(name, gender) 去初始化父类，否则，继承自 Person 的 Student 将没有 name 和 gender。
```

函数`super(Student, self)`将返回当前类继承的`父类`，即 Person ，然后调用__init__()方法，注意self参数已在super()中传入，在__init__()中将隐式传递，不需要写出（也不能写）。

### 判断类型

> 函数 `isinstance()` 可以判断一个变量的类型，既可以用在Python内置的数据类型如str、list、dict，也可以用在我们自定义的类，它们本质上都是数据类型

`isinstance(p, Person)`

dir()返回的属性是字符串列表，如果已知一个属性名称，要获取或者设置对象的属性，就需要用 `getattr()` 和 `setattr( )` 函数了：

## shutil

### shutil.copytree

> 一定要目录结构一致才行

```py
src = r'E:/Leeing/sd_fls/images/78f9197a-7dcd-11e9-afc0-00155d3e1922/001'
des = r'E:/Leeing/sd_fls/downloads'

def main():
    shutil.copytree(src, des)

# 这样报错
# PermissionError: [Errno 13] Permission denied: 'E:/Leeing/sd_fls/images/78f9197a-7dcd-11e9-afc0-00155d3e1922/001'

# 因为默认是执行了下面的语句
File "C:\Users\lixing1\AppData\Local\Programs\Python\Python36-32\lib\shutil.py", line 315, in copytree
    os.makedirs(dst)
  File "C:\Users\lixing1\AppData\Local\Programs\Python\Python36-32\lib\os.py", line 220, in makedirs
    mkdir(name, mode)
```

```py
src = r'E:/Leeing/sd_fls/images/78f9197a-7dcd-11e9-afc0-00155d3e1922/001'
des = r'E:/Leeing/sd_fls/downloads/随便一个名字都可以'

def main():
    shutil.copytree(src, des)

```

这样没有问题，但是，会将`E:/Leeing/sd_fls/images/78f9197a-7dcd-11e9-afc0-00155d3e1922/001`文件夹下所有的文件都复制到 `随便一个名字都可以` 文件夹下。不符合预期

看需求，还是需要和 src 源目录地址保持一个维度的目录结构才比较好

## argparse

> 脚本参数解析

还有一个选项就是`optparse`

综合比较之后，选择使用 `argparse`

理由如下：
1、可以有位置参数
2、可以有可选参数。兼顾optparse 的功能
3、提供更多的信息给使用者

### 基本使用

```py
import argparse

parser = argparse.ArgumentParse(description='This is a example test')

parser.add_argument('input', help='这是一个位置参数')
parser.add_argument('output', help='这是另一个位置参数')

parser.add_argument('-i', '--imagesrc', dest='imagesrc', help='这是一个可选参数')
parser.add_argument('-s', '--savesrc', dest='savesrc', help='这是另个一个可选参数')

parser.parse_know_args()
```

### add_argument()常用参数

dest：如果提供dest，例如dest="a"，那么可以通过args.a访问该参数
default：设置参数的默认值
action：参数触发的动作
store：保存参数，默认
store_const：保存一个被定义为参数规格一部分的值（常量），而不是一个来自参数解析而来的值。
store_ture/store_false：保存相应的布尔值
append：将值保存在一个列表中。
append_const：将一个定义在参数规格中的值（常量）保存在一个列表中。
count：参数出现的次数
parser.add_argument("-v", "--verbosity", action="count", default=0, help="increase output verbosity")
version：打印程序版本信息
type：把从命令行输入的结果转成设置的类型
choice：允许的参数值
parser.add_argument("-v", "--verbosity", type=int, choices=[0, 1, 2], help="increase output verbosity")
help：参数命令的介绍

## re 正则表达式

### 分组 group

那实际例子说话吧

```py
s = 'background-image: url(http://img01.lavaradio.com/up/png/2018/06/13/17/02/5b20dd8c4d9a3.png!bgmediam0)'

reg = re.compile(r'background-image: url\((.*)\)')

print(re.match(r'background-image: url\((.*)\)', s).group())
print(re.match(r'background-image: url\((.*)\)', s).group(0))
print(re.match(r'background-image: url\((.*)\)', s).group(1))
print(re.match(reg, s).group(1))

# http://img01.lavaradio.com/up/png/2018/06/13/17/02/5b20dd8c4d9a3.png!bgmediam0
```

记住一点：group(0)永远是原始字符串，group(1)、group(2)……表示第1、2、……个子串

groups() 返回一个元组

```py
print(re.match(reg, s).groups())
# ('http://img01.lavaradio.com/up/png/2018/06/13/17/02/5b20dd8c4d9a3.png!bgmediam0',)
```

### re.sub()

Python 的 re 模块提供了re.sub用于替换字符串中的匹配项。

`re.sub(pattern, repl, string, count=0, flags=0)`

```py
phone = "2004-959-559 # 这是一个电话号码"

# 删除注释
num = re.sub(r'#.*$', "", phone)
print ("电话号码 : ", num)

# 移除非数字的内容
num = re.sub(r'\D', "", phone)
print ("电话号码 : ", num)
[python@master test]$ python3 d.py
```

### re.search

扫描整个字符串并返回第一个成功的匹配。

re.search(pattern, string, flags=0)

### re.match

尝试从一个字符串的起始位置匹配一个模式，如果不是起始位置匹配成功的话，则返回None。

re.match(pattern, string, flags=0)

返回值：匹配成功返回匹配对象（group(num=0) / groups() 返回的是一个元组），匹配失败返回None

group(num=0)    匹配的整个表达式的字符串，group() 可以一次输入多个组号，在这种情况下它将返回一个包含那些组所对应值的元组。

groups()            返回一个包含所有小组字符串的元组，从 1 到 所含的小组号。

### findall()

在字符串中找到正则表达式所匹配的所有子串，并返回一个列表，如果没有找到匹配的，则返回空列表。
注意： match 和 search 是匹配一次 findall 匹配所有。

findall(string[, pos[, endpos]])

```py
pattern = re.compile(r'\d+')   # 查找数字
result1 = pattern.findall('runoob 123 google 456')
result2 = pattern.findall('run88oob123google456', 0, 10)

print(result1)
print(result2)
[python@master test]$ python3 a.py
['123', '456']
['88', '12']
```

### re.split()

split 方法按照能够匹配的子串将字符串分割后返回列表，它的使用形式如下：
re.split(pattern, string[, maxsplit=0, flags=0])

```py
re.split('\W+','runoob,runoob,runoob.')
['runoob', 'runoob', 'runoob', '']

re.split('(\W+)',' runoob,runoob,runoob.')
['', ' ', 'runoob', ',', 'runoob', ',', 'runoob', '.', '']

re.split('\W+', ' runoob, runoob, runoob.', 1)
['', 'runoob, runoob, runoob.']

re.split('a', 'hello world')
['hello world']# 对于一个找不到匹配的字符串而言，split 不会对其作出分割
```