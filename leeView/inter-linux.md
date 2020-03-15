# inter-linux

## 重要

gunicorn 版本一定要安装 19.9.0. 免得报错。一些问题还不好解决

## 服务器扩容

REFER: [AWS EC2扩容](https://www.jianshu.com/p/d07becb150f4)

## 查看端口占用情况

ss -lntpd | grep :22

## 关闭防火墙

CentOS7版本后防火墙默认使用firewalld，因此在CentOS7中关闭防火墙使用以下命令，

```sh
//临时关闭
# systemctl stop firewalld
//禁止开机启动
# systemctl disable firewalld
Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.

当然，如果安装了iptables-service，也可以使用下面的命令，

# yum install -y iptables-services
//关闭防火墙
# service iptables stop
Redirecting to /bin/systemctl stop  iptables.service
//检查防火墙状态
# service iptables status
```

## Linux集群分发脚本xsync

1.scp（secure copy）安全拷贝
2.rsync 远程同步工具
3.xsync集群分发脚本

scp定义：scp可以实现服务器与服务器之间的数据拷贝（from server1 to server2）

``` Python
scp    -r          $pdir/$fname              $user@hadoop$host:$pdir/$fname
命令   递归     要拷贝的文件路径/名称    目的用户@主机:目的路径/名称
```

在hadoop101上，将hadoop101中/opt/module目录下的软件拷贝到hadoop102上：

`[zxy@hadoop101 /]$ scp -r /opt/module root@hadoop102:/opt/module`

在hadoop103上，将hadoop101服务器上的/opt/module目录下的软件拷贝到hadoop103上：

`[zxy@hadoop103 opt]$sudo scp -r zxy@hadoop101:/opt/module root@hadoop103:/opt/module`

将hadoop101中/etc/profile文件拷贝到hadoop104的/etc/profile上：

`[zxy@hadoop101 ~]$ sudo scp /etc/profile root@hadoop104:/etc/profile`

**注意：**拷贝过来的配置文件别忘了source一下/etc/profile，

rsync主要用于备份和镜像，具有速度快、避免复制相同内容和支持符号链接的优点。

把hadoop101机器上的/opt/software目录同步到hadoop102服务器的root用户下的/opt/目录

`[zxy@hadoop101 opt]$ rsync -av /opt/software/ root@hadoop102:/opt/software`

### 3.xsync集群分发脚本

> 循环复制文件到所有节点的相同目录下

rsync命令原始拷贝：`rsync -av /opt/module root@hadoop103:/opt/`

``` shell
#!/bin/sh
# 获取输入参数个数，如果没有参数，直接退出
pcount=$#
if((pcount==0)); then
        echo no args...;
        exit;
fi
# 获取文件名称
p1=$1
fname=`basename $p1`
echo fname=$fname
# 获取上级目录到绝对路径
pdir=`cd -P $(dirname $p1); pwd`
echo pdir=$pdir
# 获取当前用户名称
user=`whoami`
# 循环
for((host=3; host<=4; host++)); do
        echo $pdir/$fname $user@slave$host:$pdir
        echo ==================slave$host==================
        rsync -rvl $pdir/$fname $user@slave$host:$pdir
done
#Note:这里的slave对应自己主机名，需要做相应修改。另外，for循环中的host的边界值
```

最后chmod 777 xsync给文件添加执行权限即可。
使用xsync filename就能将filename分发到集群中的各个节点中。

## 设置程序开机自启

```shell
# 以 nginx 为例
cd /usr/lib/systemd/system

vim nginx.service

# nginx.service
[Unit]
Description=nginx service
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target

# 再执行
systemctl daemon-reload
systemctl enable nginx.service
systemctl start nginx.service
```

之后，我们执行 `systemctl reload nginx.service` 就是相当于执行 `/usr/local/nginx/sbin/nginx -s reload`

## 添加删除用户

```js
useradd testuser
passwd testuser
// 说明：新创建的用户会在 `/home` 下创建一个用户目录testuser

usermod --help  修改用户这个命令的相关参数
userdel testuser  删除用户testuser
rm -rf testuser  删除用户testuser所在目录
```

### 备忘

> 虚拟机上的用户密码

```sh
useradd hadoop
passwd leeing123
```

## 基本使用

### 全家桶安装

1. wget
2. mongodb
3. nginx
4. python
5. supervisor
6. virtualenvwrapper
7. mysql
8. git
9. iptables

### 文件内容查看

* cat  由第一行开始显示文件内容  : cat [-AbEnTv]
* tac  从最后一行开始显示，可以看出 tac 是 cat 的倒著写！
* nl   显示的时候，顺道输出行号！
* more 一页一页的显示文件内容
* less 与 more 类似，但是比 more 更好的是，他可以往前翻页！
* head 只看头几行   : head [-n number] 文件 | -n ：后面接数字，代表显示几行的意思
* tail 只看尾巴几行 : tail [-n number] 文件

### 显示文件夹大小

```shell
du -h --max-depth=1 /usr/local/tomcat_8888/
```

### chmod

> 改变一个或多个文件的存取模式(mode)

chmod 751 file                　　　   给file的属主分配读、写、执行(7)的权限，给file的所在组分配读、执行(5)的权限，给其他用户分配执行(1)的权限
chmod u+x file                　　　   给file的属主增加执行权限

### 环境变量 ~/.bashrc 、~/.profile

**区别**：

/etc/*和~/.*区别：

/etc/profile，/etc/bashrc 是系统全局环境变量设定

~/.profile，~/.bashrc是用户家目录下的私有环境变量设定

~/.profile与~/.bashrc的区别:

都具有个性化定制功能

~/.profile可以设定本用户专有的路径，环境变量等，它只在登入的时候执行一次

~/.bashrc也是某用户专有设定文档，可以设定路径，命令别名，每次shell script的执行都会使用它一次

#### Unix/Linux有两个profile文件

1./etc/profile：是全局profile文件，设置后会影响到所有用户

2./home/username/.profile或.bash_profile是针对特定用户的，可以针对用户，来配置自己的环境变量。

注意：profile是unix上才有的；bash_profile是Linux下有的(Linux下，用户目录没有.profile文件)
/home/username/.profile或.bash_profile，都是隐藏文件，需要使用ls -a才能看到。

**执行顺序**：
Bash登陆(login)的时候，Profile执行的顺序

1)先执行全局Profile, /etc/profile

接着bash会检查使用者的HOME目录中，是否有 .bash_profile 或者 .bash_login或者 .profile，若有，则会执行其中一个，执行顺序为：

.bash_profile 最优先 > .bash_login其次 > .profile 最后

总之，就是全局或者局部，他们之间有调用关系及调用优先级

### 设置环境变量（推荐）

例如：python 代替 python3

**方法一：**
从bash转换命令，python转化成python3。

、将数据写入.bashrc文件
echo alias python=python3 >> ~/.bashrc

2、使环境变量生效
source ~/.bashrc

**方法二：**
从源头更改python的链接文件，推荐这种方法。
查看已安装的python版本和链接情况：
ll /usr/bin/python*

1、删除原有的Python连接文件
sudo rm /usr/bin/python

2、建立指向Python3.X的连接
ln -s /usr/bin/python3 /user/bin/python

3、把路径/usr/bin/加入环境变量PATH中（一般情况下不需要这一步！）
PATH=/usr/bin:$PATH

## mysql

启动：

```js
mysql -u root -p
```

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