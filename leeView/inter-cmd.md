# inter-cmd

## 基本使用

```js
@echo off
REM sleep 10s ping -n 10 127.0>nul
REM start your program, if the path has space
start "" "D:\Program Files (x86)\test\wlantest.exe"
REM exit this cmd
exit
```

### @echo

@echo off
关闭回显

@echo on
打开回显

当然，“echo off”也是命令，
它本身也会显示，
如果连这条也不显示，
就在前面加个“@”。

@echo off并不是DOS程序中的，
而是DOS批处理中的。
DOS在运行批处理时，
会依次执行批处理中的每条命令，
并且会在显示器上显示，
如果你不想让它们显示，
可以加一个“echo off”

pause
使显示器停下，并显示“请按任意键继续_ _ _”

1． 作为控制批处理命令在执行时是否显示命令行自身的开关
ECHO [ON|OFF]
如果想关闭“ECHO OFF”命令行自身的显示，则需要在该命令行前加上“@”。
2． 显示当前ECHO设置状态
ECHO
3． 输出提示信息
ECHO 信息内容

**建立新文件或增加文件内容**
ECHO 文件内容＞文件名    将字符串写入文件中，若已有数据将`先清空后写入`。
ECHO 文件内容＞＞文件名  将字符串写入文件中，若已有数据将`追加到末尾`。

### REM

> rem是批处理中的注释。rem后面的是说明，不执行。

rem 在 WINDOWS 系统中的批处理文件（*.bat）中的作用是注释语句。例如：rem this is a test file。以便提高批处理文件的可读性，它在运行批处理文件时，不参与指令的执行。

### pause

pause命令：行此句会暂停

### start

> Start启动单独的“命令提示符”窗口来运行指定程序或命令。如果在没有参数的情况下使用，start 将打开第二个命令提示符窗口。

语法
start ["title"] [/dPath] [/i] [/min] [/max] [{/separate | /shared}] [{/low | /normal | /high | /realtime | /abovenormal | belownormal}] [/wait] [/b] [FileName] [parameters]

```js
start "" "D:\Program Files (x86)\test\wlantest.exe"
```

```js ping1.bat
@echo off
ping www.sina.com.cn
ping www.baidu.com
```

然后执行，应该可以看到两条ping命令依次在同一窗口运行。

```js ping2.bat
@echo off
start /wait ping www.sina.com.cn
start /wait ping www.baidu.com

// 执行后应该可以看到两条ping命令依次在不同的窗口中运行。如果去掉/wait参数呢？有兴趣可以自己看看。
```

【start与直接exe】

start D:\Softwares\BaiduYun\baiduyun.exe
上面这个命令是启动程序之后返回bat
去掉start之后的命令
D:\Softwares\BaiduYun\baiduyun.exe
这个命令在启动程序之后一直等待程序结束，程序结束之后才会返回。

【路径中的空格】

如果路径中有空格，你会发现第一个命令不报错，
只需要改为这个样子：
start "" "D:\Softwares\BaiduYun\baiduyun.exe"
如果不加前面的""，那么会进入cmd模式。。

### 其他常用命令

Del：删除文件
Copy：复制文件
Xcopy：复制文件夹
Md：创建文件夹
rd：删除文件夹
ren：重命名文件(夹)
move：移动文件(夹)
find：字符串查找
findstr：字符串查找增强，可以进行模式匹配搜索