"""
作用域

在Python中，当引用一个变量的时候，对这个【变量的搜索】是按照
本地作用域(Local)、
嵌套作用域(Enclosing function locals)、
全局作用域(Global)、
内置作用域(builtins模块)
的顺序来进行的，
即所谓的LEGB规则。

然而当在一个【函数内部为一个变量赋值】时，并不是按照上面所说LEGB规则来首先找到变量，之后为该变量赋值。在Python中，在函数中为一个变量赋值时，有下面这样一条规则

“当在函数中给一个变量名赋值是(而不是在一个表达式中对其进行引用)，Python总是🔹创建或改变本地作用域的变量名🔹，除非它已经在那个函数中被声明为全局变量. ”
"""

x = 99
def func():
    x = 88
func()
print(x)

y = 100
def func_y():
    global y
    y = 101
func_y()
print(y)

def func_z():
    z = 520
    def foo():
        z = 521
    foo()
    print(z)
func_z()

def func_e():
    count = 0
    def foo():
        nonlocal count
        count = 12
    foo()
    print(count)
func_e()

"""
使用global关键字修饰的变量之前可以并不存在，而使用nonlocal关键字修饰的变量在嵌套作用域中必须已经存在
"""
