---
title: inter-python
tag: python
---

> python 常用的备忘录

## 镜像

`-i https://pypi.tuna.tsinghua.edu.cn/simple`

* gunicorn + docker 的使用

## python下使用pip freeze >requirements.txt命令迁移模块

查看安装的包 `pip freeze`

自动会导入到你现在的项目文件夹中 `pip freeze > requirements.txt`

创建一个新的环境是可以导入新环境 `pip install -r requirements.txt`

## 安装

### linux centos7

关于在centos下安装python3.7.0以上版本时报错ModuleNotFoundError: No module named '_ctypes'的解决办法

``` Python
yum install libffi-devel -y
make install
```


## 命名规范

[谷歌命名规范](https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/python_style_rules/)

摘录几条容易犯的错误：

1、不要用空格来垂直对齐多行间的标记, 因为这会成为维护的负担 (适用于:, #, = 等):
2、顶级定义之间空两行, 比如函数或者类定义. 方法定义, 类定义与第一个方法之间, 都应该空一行. 函数或方法中, 某些地方要是你觉得合适, 就空一行.
3、如果一个类不继承自其它类, 就显式的从 object 继承. 嵌套类也一样.
4、TODO 注释应该在所有开头处包含”TODO” 字符串, 紧跟着是用括号括起来的你的名字, email 地址或其它标识符. 然后是一个可选的冒号. 接着必须有一行注释, 解释要做什么；eg：`# TODO(kl@gmail.com): Use a "*" here for string repetition.` and `# TODO(Zeke) Change this to use relations.`
5、命名

```py
module_name, package_name, ClassName, method_name, ExceptionName, function_name, GLOBAL_VAR_NAME, instance_var_name, function_parameter_name, local_var_name.
```

6、所有的顶级代码在模块导入时都会被执行. 要小心不要去调用函数, 创建对象, 或者执行那些不应该在使用 pydoc 时执行的操作

## 常用内置函数

all
any
fiter(function, iterable) -> 过滤 (lamda)
map(function, iterable) -> 会根据提供的函数对指定序列列做映射(lamda)
zip
ord
chr
bytes(str, encoding='utf-8') -> 把字符串转化成bytes类型
frozenset() -> 创建一个冻结的集合. 冻结的集合不能进行添加和删除操作
enumerate
reversed(list) -> 将一个序列翻转, 返回翻转序列的迭代器
slice(start, end, step) -> 列表的切片

**作用域相关**：
locals() 返回当前作用域中的名字
globals() 返回全局作用域中的名字

**和迭代器/生成器相关**：
range() 生成数据
next() 迭代器向下执行一次, 内部实际使⽤用了__ next__()⽅方法返回迭代器的下一个项目
iter() 获取迭代器, 内部实际使用的是__ iter__()⽅方法来获取迭代器

**查看内置属性**：
dir() : 查看对象的内置属性, 访问的是对象中的__dir__()方法

callable() : 用于检查一个对象是否是可调用的. 如果返回True, object有可能调用失败, 但如果返回False. 那调用绝对不会成功
help() : 函数用于查看函数或模块用途的详细说明

`__ import__()` : 用于动态加载类和函数

open() : 用于打开一个文件, 创建一个文件句柄

## 基本类库使用

### concurrent

concurrent.futures是一个非常简单易用的库，主要用来实现**多线程和多进程**的异步并发。

### open

```py
file1 = open（'file'，'mode'）
```

mode:
.r    以只读方式打开文件。这是默认模式。文件必须存在，不存在抛出错误

rb    以二进制格式打开一个文件用于只读。

.'w'：以只写模式打开
    若文件存在，则会自动清空文件，然后重新创建。
    若文件不存在，则新建文件。
    使用这个模式必须要保证文件所在目录存在，文件可以不存在。

.'a'：以追加模式打开
    若文件存在，则会追加到文件的末尾。
    若文件不存在，则新建文件。
    该模式不能使用 read*()方法。

.'r+'： 以文本读写模式打开
    可以写到文件任何位置。
    默认写的指针开始指在文件开头, 因此会覆写。
    可以使用 read*()

.'w+'： 以文本读写模式打开（打开前文件会被清空）
    可以使用 read*()

'a+'： 以文本读写模式打开（写只能写在文件末尾）
    可以使用 read*()

`file.seek(offset[, whence])` 解读
.seek（）指针从哪里开始写入
    offset -- 开始的偏移量，也就是代表需要移动偏移的字节数
    whence：可选，默认值为 0。给offset参数一个定义，表示要从哪个位置开始偏移；0代表从文件开头开始算起，1代表从当前位置开始算起，2代表从文件末尾算起

### getattr 内置函数

函数原型： `getattr(object, name[, default])`:

name:str类型

default:如果不存在name属性,设置default则返回default,不设置返回AttributeError.

与__getattr__的区别:
    __getattr__是类的内置方法,当找不到某个属性时会调用该方法;找到就不会调用.
    getattr与类无关.

```py
class DataProxy(...):

    def __getattr__(self, item):
        return getattr(self.data, item)
```

### importlib 模块

```py
# 根据字符串导入模块
# 通常用来导入包下面的模块
o = importlib.import_module("aa.bb")
s2 = "Person"

# 由字符串找函数、方法、类  利用 反射
the_class = getattr(o, "Person")
p2 = the_class("小黑")
p2.dream()
```

### os.path

os.path.abspath(path)  #返回绝对路径
os.path.split(path     #将path分割成目录和文件名二元组返回
os.path.dirname(path)  #返回path的目录。其实就是os.path.split(path)的第一个元素
os.path.basename(path) #返回path最后的文件名
os.path.exists(path)   #如果path存在，返回True；如果path不存在，返回False
os.path.isabs(path)    #如果path是绝对路径，返回True
os.path.isfile(path)   #如果path是一个存在的文件，返回True。否则返回False
os.path.isdir(path)    #如果path是一个存在的目录，则返回True。否则返回False
os.path.getatime(path) #返回path所指向的文件或者目录的最后存取时间
os.path.getmtime(path) #返回path所指向的文件或者目录的最后修改时间
s.path.join(path1[, path2[, ...]])  #将多个路径组合后返回，第一个绝对路径之前的参数将

### sys.path

> 使用sys.path.append()方法可以临时添加搜索路径，方便更简洁的import其他包和模块。这种方法导入的路径会在python程序退出后失效。

sys.path.append('../)
sys.path.insert(0, '../')

## 常用包

### dateutil

> Python编程：dateutil模块实现月份相加减

``` Python
# pip install python-dateutil

from datetime import datetime, date
from dateutil.relativedelta import relativedelta

now = datetime.now()
print(now)
print(now - relativedelta(months=3))
"""
2019-01-09 18:13:28.791192
2018-10-09 18:13:28.791192
"""

today = date.today()
print(today)
print(today - relativedelta(months=3))

"""
2019-01-09
2018-10-09
"""
```

### traceback

traceback.print_tb(tb[, limit[, file]])
tb: 这个就是traceback object, 是我们通过sys.exc_info获取到的
limit: 这个是限制stack trace层级的，如果不设或者为None，就会打印所有层级的stack trace
file: 这个是设置打印的输出流的，可以为文件，也可以是stdout之类的file-like object。如果不设或为None，则输出到sys.stderr。

traceback.print_exception(etype, value, tb[, limit[, file]])

traceback.print_exc([limit[, file]])

> Python——traceback的优雅处理

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

## 优秀第三方库

### arrow

REFER: https://arrow.readthedocs.io/en/latest/

Python针对日期时间的处理提供了大量的package，类和方法，但在可用性上来看非常繁琐和麻烦

第三方库Arrow提供了一个合理的、人性化的方法来创建、操作、格式转换的日期，时间，和时间戳，帮助我们使用较少的导入和更少的代码来处理日期和时间。

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

1、%s、%d
2、format

```py
name = 'python'
age = 30
print('hello, {}, you are {}'.format(name, age))
```

3、f-String格式化（3.6版本，向上兼容）。建议使用

```py
name = 'python'
age = 30
print(f'hello, {name}, you are {age}')
```

这种方式比较简单，实用。f 或者 F 都可以。

**打印更好看**：

```py
print(f'更加好看：{name:*<10}') # name在左边
print(f'更加好看：{name:*>10}') # name在右便
print(f'更加好看：{name:*^10}') # name在中间
print(f'更加好看：{name:.2f}')  # 保留小数点后两位
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

## 魔术方法

1、__call__ 允许一个类的实例像函数一样被调用

``` Python
class Person(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __call__(self, *args):
        print(args)
        # return self

p = Person('lee', 10)
print(p)
p(89, 90)
```

2、__getitem__ 定义获取容器中指定元素的行为，相当于self[key]

3、__getattr__ ()：当用户试图访问一个不存在属性时触发；

4、__getattribute__()： 当一个属性（无论存在与否）被访问时触发；

## shutil & makedirs

### mkdir vs makedirs

1.mkdir( path [,mode] )
    作用：创建一个目录，可以是相对或者绝对路径，mode的默认模式是0777。
    如果目录有多级，则创建最后一级。如果最后一级目录的上级目录有不存在的，则会抛出一个OSError。

 2.makedirs( path [,mode] )
    作用： 创建递归的目录树，可以是相对或者绝对路径，mode的默认模式也是0777。
    如果子目录创建失败或者已经存在，会抛出一个OSError的异常，Windows上Error 183即为目录已经存在的异常错误。如果path只有一级，与mkdir一样。

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

## 装饰器

### wraps

> 作用是避免装饰函数自身信息的丢失

```py
from functools import wraps

def decorator(func):
    @wraps(func)
    def inner_function():
        pass
    return inner_function

@decorator
def func():
    pass

print(func.__name__)

# 如果不加@wraps，那么这里的输出就是一个 inner_function，而正确的应该是 func
```

### 带参数的装饰器

```py 自己项目中的代码

from functools import wraps

from app.public.enumtype import UserTypeEnum


def user_type_required(*args, **kwargs):
    """用户类型权限装饰器"""

    if len(args) > 0:
        auth_user_types = args[0]
    else:
        auth_user_types = kwargs.get('user_type')
    is_types_list = isinstance(auth_user_types, list)

    def auth_wrapper(fn):

        @wraps(fn)
        def wrapper(*arg, **kw):
            self = arg[0]
            identity = self.get_user()
            user_type = identity.get('usertype')
            auth_validate = user_type in auth_user_types if is_types_list else user_type == auth_user_types
            if not auth_validate:
                return self.Response.return_false_data(msg='权限不足', status=403)
            return fn(*arg, **kw)

        return wrapper

    return auth_wrapper
```

对于类方法来说，都会有一个默认的参数self，它实际表示的是类的一个实例，所以在装饰器的内部函数wrapper也要传入一个参数

### 类装饰器

```py
class Decorator(object):
    def __init__(self, f):
        self.f = f
    def __call__(self):
        print("decorator start")
        self.f()
        print("decorator end")

@Decorator
def func():
    print("func")

func()

'''
decorator start
func
decorator end
'''
```

这个看着也挺厉害的的亚子

基于类实现的装饰器
装饰器函数其实是这样一个接口约束，它必须接受一个callable对象作为参数，然后返回一个callable对象。在Python中一般callable对象都是函数，但也有例外。只要某个对象重载了__call__()方法，那么这个对象就是callable的。重载__call__些魔法方法一般会改变对象的内部行为，让一个类对象拥有了被调用的行为。

__带参数的类装饰器__:

```py
class logging(object):
    def __init__(self, level='INFO'):
        self.level = level

    def __call__(self, func):  # 接受函数
        def wrapper(*args, **kwargs):
            print('[{level}]: enter function {func}()'.format(
                level=self.level,
                func=func.__name__))
            func(*args, **kwargs)

        return wrapper  # 返回函数

@logging(level='INFO')
def say(something):
    print('say {}'.format(something))

say('love you.')
print(say.__name__)  # wrapper -> 只要在 wrapper 上面再加上 @wraps(func) 得到的就是 say 这个原本装饰函数的函数名
```

### 多个装饰器

多个装饰器执行的顺序就是从最后一个装饰器开始，执行到第一个装饰器，再执行函数本身

### 注意事项

1、不确定的代码执行顺序。最好不要在装饰器函数之外添加逻辑功能，否则这个装饰器就不受你控制了
2、多层装饰器。使用场景较小

## 图像JPG to PNG

```py
im = Image.open('./demo.png')
out = im.convert('RGB')
out.save('./test.t.jpg')
# out.save('./test.t.jpg', quality=95)
# out.save('./test.t.jpg', quality=95, dpi=(300.0, 300.0))
```

`imObj.save(image_name, quality=95)` 参数解释

quality参数： 保存图像的质量，值的范围从1（最差）到95（最佳）
默认值为75，使用中应尽量避免高于95的值; 100会禁用部分JPEG压缩算法，并导致大文件图像质量几乎没有任何增益。

`imObj.save(new_name, quality=95, subsampling=0)` 参数解析

subsampling参数：子采样，通过实现色度信息的分辨率低于亮度信息来对图像进行编码的实践
可能的子采样值是0,1和2，对应于4：4：4,4：2：2和4：1：1（或4：2：0？）。

经过实践将值设为0便可以满足图片大小增大的需求

`imObj.save(image_name, dpi=(300.0, 300.0))` 参数解释

dpi 图像像素

## 面试题

1、python中 __name__ 的含义及作用
答：每一个py脚本在运行的时候，都有一个 __name__ 属性，如果程序作为模块引入，则 __name__ 属性被设置为模块名。如果脚本程度独立运行，则 __name__ 自动设置为 __mian__ 利用 __name__ 可以控制py的运行方式

2、简述函数式编程
答：回答一下 reduce、map、filter、all、any这些内置函数

3、如何捕获异常，常用的异常机制有哪些？
答：traceback是一个比较好的库。
    * try...except...finally
    * assert
    * with

4、装饰器有什么用，简单讲一下你在工作中什么时候用到装饰器，解决了什么问题
答：装饰器本质上是一个Python函数，它可以让其他函数在不需要做任何代码变动的前提下增加额外功能，装饰器的返回值也是一个函数对象。
    它经常用于有切面需求的场景，比如：插入日志、性能测试、事务处理、缓存、权限校验等场景。
    有了装饰器，就可以抽离出大量与函数功能本身无关的雷同代码并继续重用。

5、简述 __new__ 和 __init__ 的区别
答：创建一个新的实例时调用new，初始化一个实例时调用 init
    new 方法会返回所构造的对象，init则不会
    new 函数必须以 cls 作为第一个参数，init 则是以 self作为第一个参数
    _new__是开辟疆域的大将军，而__init__是在这片疆域上辛勤劳作的小老百姓，只有__new__执行完后，开辟好疆域后，__init__才能工作

``` Python
class A:
    pass

class B(A):
    def __new__(cls):
        print("__new__方法被执行")
        return super().__new__(cls)
    def __init__(self):
        print("__init__方法被执行")

b = B()

class F1(object):
　　#重写__new__方法，返回这个重写的__new__方法
    def __new__(cls, *args, **kwargs):
        return 123

obj=F1() #实例化对象是谁取决于__new__方法,__new__返回什么就是什么
print(obj,type(obj))  #打印结果：123 <class 'int'>
```

```py
# 创建单例
class Singleton(object):
    def __init__(self,*args,**kwargs):
        pass

    @classmethod
    def get_instance(cls, *args, **kwargs):
        # 利用反射,看看这个类有没有_instance属性
        if not hasattr(Singleton, '_instance'):
            Singleton._instance = Singleton(*args, **kwargs)

        return Singleton._instance


s1 = Singleton()  # 使用这种方式创建实例的时候,并不能保证单例
s2 = Singleton.get_instance()  # 只有使用这种方式创建的时候才可以实现单例
# 注意,这样的单例模式在单线程下是安全的,但是如果遇到多线程,就会出现问题.如果遇到多个线程同时创建这个类的实例的时候就会出现问题.

# 推荐的做法是：
import threading

class Singleton(object):
    _instance_lock = threading.Lock()

    def __init__(self, *args, **kwargs):
        pass

    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            with Singleton._instance_lock:
                if not hasattr(cls, '_instance'):
                    Singleton._instance = super().__new__(cls)

            return Singleton._instance


obj1 = Singleton()
obj2 = Singleton()
print(obj1, obj2)
```

6、Python中的@property有什么作用?如何实现成员变量的只读属性？
答：

7、Django中间件与装饰器的区别
Django中的中间件是一个轻量级、底层的插件系统，可以介入Django的请求和响应处理过程，修改Django的输入或输出。中间件的设计为开发者提供了一种无侵入式的开发方式，增强了Django框架的健壮性。

8、WSGI
（Web Server Gateway Interface），翻译为Python web服务器网关接口，
即Python的Web应用程序（如Flask）和Web服务器(如Nginx)之间的一种通信协议。也就是说，如果让你的Web应用在任何服务器上运行，就必须遵循这个协议。

那么实现WSGI协议的web服务器有哪些呢？
就比如uWSGI与gunicorn。两者都可以作为Web服务器。可能你在许多地方看到的都是采用Nginx + uWSGI（或gunicorn）的部署方式。实际上，直接通过uWSGI或gunicorn直接部署也是可以让外网访问的，那你可能会说，那要Nginx何用？
首先浏览器发起 http 请求到 nginx 服务器，Nginx 根据接收到请求包，进行 url 分析,判断访问的资源类型.
如果是静态资源，直接读取静态资源返回给浏览器.
如果请求的是动态资源就转交给 uwsgi服务器，uwsgi 服务器根据自身的 uwsgi 和 WSGI 协议，找到对应的 Django 框架，Django 框架下的应用进行逻辑处理后，将返回值发送到 uwsgi 服务器，然后 uwsgi 服务器再返回给 nginx，最后 nginx将返回值返回给浏览器进行渲染显示给用户。

1.uWSGI 是一个 Web 服务器，它实现了 WSGI 协议、uwsgi、http 等协议。Nginx 中
HttpUwsgiModule 的作用是与 uWSGI 服务器进行交换。WSGI 是一种 Web 服务器网关接口。它是一个 Web 服务器（如 nginx，uWSGI 等服务器）与 web 应用（如用 Flask 框架写的程序）通信的一种规范。
要注意 WSGI / uwsgi / uWSGI 这三个概念的区分。
WSGI 是一种通信协议。
uwsgi 是一种线路协议而不是通信协议，在此常用于在 uWSGI 服务器与其他网络服务器的数据通信。
uWSGI 是实现了 uwsgi 和 WSGI 两种协议的 Web 服务器。

9、只接受关键字参数的函数

> 将强制关键字参数放到某个*参数或者单个*后面就能达到这种效果

``` Python
def recv(maxsize, *, block):
    'Receives a message'
    pass

recv(1024, True) # TypeError
recv(1024, block=True) # Ok
```

10、减少可调用对象的参数个数

> 如果需要减少某个函数的参数个数，你可以使用 functools.partial()

``` Python
def spam(a, b, c, d):
    print(a, b, c, d)

from functools import partial
>>> s1 = partial(spam, 1) # a = 1
```

11、让对象支持上下文管理协议

> 为了让一个对象兼容 with 语句，你需要实现 __enter__() 和 __exit__() 方法。

```py
from socket import socket, AF_INET, SOCK_STREAM

class LazyConnection:
    def __init__(self, address, family=AF_INET, type=SOCK_STREAM):
        self.address = address
        self.family = family
        self.type = type
        self.sock = None

    def __enter__(self):
        if self.sock is not None:
            raise RuntimeError('Already connected')
        self.sock = socket(self.family, self.type)
        self.sock.connect(self.address)
        return self.sock

    def __exit__(self, exc_ty, exc_val, tb):
        self.sock.close()
        self.sock = None
```

12、python 根据字典的键值进行排序

``` Python
# 利用key排序
d = {'d1':2, 'd2':4, 'd4':1,'d3':3,}
for k in sorted(d):
    print(k,d[k])

# 利用value排序：__getitem_
d = {'d1':2, 'd2':4, 'd4':1,'d3':3,}
for k in sorted(d,key=d.__getitem__):
    print(k,d[k])

# 反序：reverse=True
d = {'d1':2, 'd2':4, 'd4':1,'d3':3,}
for k in sorted(d,key=d.__getitem__,reverse=True):
    print(k,d[k])

# 对dict_items进行排序
d = {'d1':2, 'd2':4, 'd4':1,'d3':3,}
res = sorted(d.items(),key=lambda d:d[1],reverse=True)
    print(res)
```

**列表排序**：
使用lambda函数对list排序foo = [-5,8,0,4,9,-4,-20,-2,8,2,-4]，
输出结果为[0,2,4,8,8,9,-2,-4,-4,-5,-20]，正数从小到大，负数从大到小

``` Python
foo = [-5,8,0,4,9,-4,-20,-2,8,2,-4]

# 正数从小到大，负数从大到小
print(
    list(
        sorted(foo, key=lambda x: (x < 0, abs(x)))
    )
)

# 大于零的从小到大，小于零的 从小到大
print(
    list(
        sorted(foo, key=lambda x: (x < 0, (-abs(x if x < 0 else abs(x)))))
    )
)
```

**个人理解**：使用 `x < 0` 这个条件进行排序，按理返回的都是 正数为 false，负数为 True。转化为 `int` 类型就是 01.然后按01的大小进行排序
然后第二个排序条件是 `abs(x)` 先转为正数，然后再按照其大小, 从小到大进行排序

sorted函数也可以进行多级排序，例如要根据第二个域和第三个域进行排序，可以这么写：
sorted(students, key=operator.itemgetter(1,2))

即先跟句第二个域排序，再根据第三个域排序。
