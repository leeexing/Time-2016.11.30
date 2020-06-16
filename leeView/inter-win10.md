---
title: window
tag: win10
---

## 删除 winsxs 文件夹中过多的垃圾文件

dism.exe /online /Cleanup-Image /StartComponentCleanup

## 启动Chrome浏览器后图标变成空白的解决办法

在桌面上新建一个txt文件，将下列内容复制进去

```shell
taskkill /f /im explorer.exe
attrib -h -i %userprofile%\AppData\Local\IconCache.db
del %userprofile%\AppData\Local\IconCache.db /a
start explorer
```

然后将后缀改为.bat，运行该文件即可
