# inter-python

> python 常用的小技巧和函数

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

## todo