# inter-python

> python 常用的小技巧和函数

## 常用包

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
