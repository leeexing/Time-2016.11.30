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