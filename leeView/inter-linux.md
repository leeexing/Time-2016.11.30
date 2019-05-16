# inter-linux

## 基本使用

### 文件内容查看

* cat  由第一行开始显示文件内容  : cat [-AbEnTv]
* tac  从最后一行开始显示，可以看出 tac 是 cat 的倒著写！
* nl   显示的时候，顺道输出行号！
* more 一页一页的显示文件内容
* less 与 more 类似，但是比 more 更好的是，他可以往前翻页！
* head 只看头几行   : head [-n number] 文件 | -n ：后面接数字，代表显示几行的意思
* tail 只看尾巴几行 : tail [-n number] 文件

### chmod

> 改变一个或多个文件的存取模式(mode)

chmod 751 file                　　　   给file的属主分配读、写、执行(7)的权限，给file的所在组分配读、执行(5)的权限，给其他用户分配执行(1)的权限
chmod u+x file                　　　   给file的属主增加执行权限

## shell

### 常用语法

1 变量赋值等号左右两边没有空格

```shell
for file in `ls /etc`; do
  echo $file
done

for file in ${ls /etc}; do
  echo $file
  # echo ${file}
done

```

 TIP: - 使用反引号 , 引用变量需要使用 `$` 或者 `${ .. }`

```shell
arr_name=(my name 'is' leeing)
arr_name=(
  my
  name
  is
  leeing
)

echo '获取数组的长度' ${#arr_name[@]} 'or' ${#arr_name[*]}
echo '默认读取的是数组的第一个元素' ${arr_name} # my
echo '需要读取所有元素需要添加@' ${arr_name[@]} # $arr_name[@] 这样是不行的。这样输出只能是 `my[@]`
```

 TIP: - 养成良好习惯。变量引用都使用 `${ .. }` 这种方式

**传递参数**
我们可以在执行 Shell 脚本时，向脚本传递参数，脚本内获取参数的格式为：`$n`。n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，以此类推……

$# 传递到脚本的参数个数
$* 以一个单字符串显示所有向脚本传递的参数。
$@ 与$*相同，但是使用时加引号，并在引号中返回每个参数。
$* 与 $@ 区别：
  相同点：都是引用所有参数。
  不同点：只有在双引号中体现出来。假设在脚本运行时写了三个参数 1、2、3，，则 " * " 等价于 "1 2 3"（传递了一个参数），而 "@" 等价于 "1" "2" "3"（传递了三个参数）。

```shell
./test/sh 1 2 3

for arg in `$*`; do
  echo $arg
done

1 2 3 # 相当于一个参数 '1 2 3'

for arg in `$@`; do
 echo $arg
done

1
2
3 # 相当于三个参数
```

#### 运算符

-eq 检测两个数是否相等，相等返回 true。
-ne 检测两个数是否不相等，不相等返回 true。

! 非运算，表达式为 true 则返回 false，否则返回 true。
-o 或运算，有一个表达式为 true 则返回 true。  ||
-a 与运算，两个表达式都为 true 才返回 true。  &&

-z 检测字符串长度是否为0，为0返回 true。
-n 检测字符串长度是否为0，不为0返回 true。
$ 检测字符串是否为空，不为空返回 true。

```shell
a=10
b=20

if [ $a -lt 100 -a $b -gt 15 ]  # if [[ $a -lt 100 && $b -gt 100 ]]
then
   echo "$a 小于 100 且 $b 大于 15 : 返回 true"
else
   echo "$a 小于 100 且 $b 大于 15 : 返回 false"

#####

a="abc"
b="efg"

if [ -n "$a" ]
then
   echo "-n $a : 字符串长度不为 0"
else
   echo "-n $a : 字符串长度为 0"
```

#### echo

显示变量

```shell
# test/sh
read name
echo "$name it is a test"
```

显示结果定向至文件 `echo "It is a test" > myfile`

原样输出字符串，不进行转义或取变量(用单引号) `echo '$name\"'`  `$name\"`

#### 流程控制

```shell
# if
num1=$[2*3]
num2=$[1+5]
if test $[num1] -eq $[num2]
then
    echo '两个数字相等!'
else
    echo '两个数字不相等!'
fi

for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done

for var in item1 item2 ... itemN; do command1; command2… done;

for loop in 1 2 3 4 5
do
    echo "The value is: $loop"
done

# while 语句

while condition
do
    command
done

int=1
while(( $int<=5 ))
do
    echo $int
    let "int++" # Bash let 命令，它用于执行一个或多个表达式，变量计算中不需要加上 $ 来表示变量
done

# case

case 值 in
模式1)
    command1
    command2
    commandN
模式2）
    command1
    command2
    commandN
    ;;
esac

# continue

while :
do
    echo -n "输入 1 到 5 之间的数字: "
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为 $aNum!"
        ;;
        *) echo "你输入的数字不是 1 到 5 之间的!"
            continue
            echo "游戏结束"
        ;;
    esac
done
```

#### 函数

```shell
# 可以带function fun() 定义，也可以直接fun() 定义,不带任何参数。
demoFun(){
    echo "这是我的第一个 shell 函数!"
}
echo "-----函数开始执行-----"
demoFun
echo "-----函数执行完毕-----"

# 函数参数

funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "第十个参数为 $10 !"
    echo "第十个参数为 ${10} !"
    echo "第十一个参数为 ${11} !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

command > file 将输出重定向到 file。
command >> file 将输出以追加的方式重定向到 file。

#### 文件包含

```shell
# test.sh
url="http://www.runoob.com"

# test2.sh

../test.sh

echo 'test.sh 文件中的一个网址：$url' # ❗这里使用单引号是没有办法输出 url 的。需要使用双引号

echo "test.sh 文件中的一个网址 $url"
```