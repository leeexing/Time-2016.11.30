---
title: hadoop学习
tag: linux
---

## 虚拟机

### 配置静态 ip

vim /etc/sysconfig/network-scripts/ifcfg-en016777736

IPADDR=100.100.0.3

### 停掉 NetworkManage

systemctl stop NetworkManager.service
systemctl disable NetworkManager.service
systemctl is_enabled NetworkManager.service

systemctl is_restarat NetworkManager

### 关掉防火墙

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

### 克隆

完整克隆.

需要修改 ip 地址 和 hostname 就可以了。

### 快照

快照管理

快照里面也可以进行克隆

## 准备工作

### 防火墙关闭

### 创建一个一般用户

useradd hadoop
passwd leeing123

### 在/opt目录下创建 software、module文件夹

mkdir /opt/software /opt/module
chown hadoop:hadoop /opt/software /opt/module

### 把这个用户加入到 sudoers

vim /etc/sudoers

hadoop ALL=(ALL) NOPASSWD:ALL

:wq!

### 设置hosts

vim /etc/hosts

100.100.0.5 hadoop01
100.100.0.6 hadoop02
100.100.0.7 hadoop03
100.100.0.8 hadoop04

## 命令备忘录

``` Python
rpm -qa | grep java
rpm -qa | grep java | xargs sudo rpm -e
rpm -qa | grep java | xargs sudo rpm -e --nodeps

```

[jdk下载地址](https://www.oracle.com/cn/java/technologies/javase-jdk8-downloads.html)

解压

```py
tar -zxvf java.xxx.tar.gz -C /opt/module
z: 压缩编码 gz
x: 解压
v: 信息
f: 指定一个文件

-C：一定要是大写   统一将所有的安装包解压安装到一个文件中
```

配置环境变量

``` Python
vim /etc/profile
sudo vim /etc/profile  # 非root账号，需要使用sudo

export JAVA_HOME=/opt/module/jdk_xxx
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tool.jar

# export: 将环境变量提升为全局变量

source /etc/profile # 生效

同理。配置hadoop环境变量
export HADOOP_HOME=/opt/module/hadoop-3.2.1
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin  # 多一个sbin

# sbin 是可执行脚本
# bin 可执行的二进制文件
# etc 配置文件
# share hadoop 最核心的地方

source /etc/profile

hadoop version
```

单节点运行

``` Python
vim /opt/module/hadoop.xxx/etc/hadoop/hadopp_env.sh

export JAVA_HOME= /opt/module/jdk1.8.0_231

bin/hadoop

# 然后

mkdir input
cp etc/hadoop/*.xml input
ls input/
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'
cat output/*

# 还可以执行其他的统计命令 例如 wordcount
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar wordcount wcinput wcoutput
```

伪分布式运行模式

``` Python
# 第一步

vim etc/hadoop/core-site.xml

<configuration>
<!-- 指定HDFS中的NameNode的地址-->
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://hadoop01:9000</value>
    </property>

<!-- 指定Hadoop运行时产生文件的存储目录 -->
    <property>
        <name>hadoop.tem.dir</name>
        <value>/opt/module/hadoop-3.2.1/data/tmp</value>
    </property>
</configuration>

# 第二步
vim etc/hadoop/hdfs-site.xml


<configuration>
    <!-- 指定HDFS副本的数量 -->
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>

# 单一节点最多启动一份副本

bin/hdfs namenode -format

有下面输出则成功
#  INFO common.Storage: Storage directory /opt/module/hadoop-3.2.1/data/tmp/dfs/name has been successfully formatted.

# 接着：
 hadoop-daemon.sh start namenode
WARNING: Use of this script to start HDFS daemons is deprecated.
WARNING: Attempting to execute replacement "hdfs --daemon start" instead.

> jps

8452 NameNode
8582 Jps


hadoop01:9870   namenode
hadoop01:9000    datanode

# 50070  是3以前的模块
```

**注意** 不能一直格式化 namenode 。格式化namenode会产生新的集群id，导致namenode和datanode的集群id不一致，集群找不到以前的数据。
所以，格式 namenode的时候，一定要先删除data数据和log日志，然后再格式化namenode

**VERSION存储的地方**：cat data/tmp/dfs/name/current/VERSION

**当前数据存储在什么地方**：data/tmp/dfs/data/current/

### 启动yarn 运行mapreduce

``` Python
vim etc/hadoop/yarn-env.sh

export JAVA_HOME=/opt/module/jdk

# next
vim etc/hadoop/yarn-site.xml

<configuration>

<!-- Site specific YARN configuration properties -->
<!--Reducer获取数据的方式 -->
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
<!-- 指定YARN的ResourceManager的地址 -->
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>hadoop01</value>
    </property>
</configuration>


# next
vim etc/hadoop/mapred-env.sh

# JAVA_HOME
export JAVA_HOME=/opt/module/jdk1.8.0_231

# next
vim etc/hadoop/mapred-site.xml


<configuration>
<!-- 指定MP运行再YARN上  -->
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>

# next 启动集群
启动前，须保证 namenode和datanode都已经启动

启动resourceManager

yarn --daemon start resourcemanager

启动nodeManager

yarn --daemon start nodemanager

# 浏览器访问
http://hadoop01:8088/cluster

可以访问，表示成功
```

### 操作hdfs

``` Python
hadoop fs -put wcinput /  # 使用fs将 wcinput 文件夹 上传到根目录

# next
在浏览器中 'http://hadoop01:9870/explorer.html#/' utilities中可以查看到刚才上传的文件

# next
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar wordcount /wcinput /wcoutput

如果报错。查看[错误: 找不到或无法加载主类 ](https://blog.csdn.net/hongxiao2016/article/details/88919176)

# 然后查看
hadoop fs -cat /wcoutput/*
```

## 完全分布式

### 自动化脚本工具

``` Python 不对
hadoop102~104自动配置网络脚本
#!/bin/bash
id=$1
sudo sed -i "s/192.168.220.200/192.168.220.$id/" /etc/sysconfig/network-scripts/ifcfg-eth0
sudo sed -i "s/hadoop200/hadoop$id/" /etc/sysconfig/network
sudo sed -i "s/hadoop200/hadoop$id/" /etc/sysconfig/network

file=/etc/udev/rules.d/70-persistent-net.rules

#firstly get numbers of matched lines
nu=$(grep -c SUBSYSTEM $file)
#secondly judge if the line number equals 8
#if not , it means the file is not modified and need be modified
if 【 $nu -ne 1 】
then
sed -i '8d' $file
fi

sed -i 's/eth1/eth0/' $file
reboot
```

```sh
#!/bin/bash
#1 获取输入参数个数，如果没有参数，直接退出
pcount=$#
if ((pcount==0)); then
echo no args;
exit;
fi

#2 获取文件名称
p1=$1
fname=`basename $p1`
echo fname=$fname

#3 获取上级目录到绝对路径
pdir=`cd -P $(dirname $p1); pwd`
echo pdir=$pdir

#4 获取当前用户名称
user=`whoami`

#5 循环
for ((host=2; host<4; host++)); do
  echo -------- hadpoop0$host --------
  rsync -av $pdir/$fname $user@hadoop0$host:$pdir
done


# -P 追踪软连接到真实的目录
```

然后可以将该文件放到 /bin 目录下。任何地方都可以调用

```py
sudo cp xsync /bin
```

### scp

```py
cp -r source destination

# 远程拷贝
scp -r hadoop01:/opt/module/hadoop-3.2.1 hadoop02:/opt/module

```

### rsync 远程同步工具

源和目标不能同时为远程端

```py
rsync -av source destination

-a 归档拷贝 （完完全全一样的拷贝：包括文件的权限，内容，文件的时间戳）
-v 显示复制过程

rsync -av hadoop01:/opt/module/jdk1.8.0_231 /opt/module # 在hadoop02 主机上。这是主动拉取过来
rsync -av /opt/module/jdk1.8.0_231 hadoop02:/opt/module
```

### 内容分发

``` Python
cd /opt/module
xsync hadoop-3.2.1
xsync jdk1.8.0_231

cd /etc
sudo xsync profile # 环境变量

然后再执行脚本是命令生效
source /etc/profile
```

### 集群配置

DN：datanode
NN: namenode
2NN: second namenode
RM: resourcemanager
NM：nodemanager
