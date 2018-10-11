# Height

一直以为 $(x).height() 获取到的数据就是容器内容加`padding`的高度。结果最近的一个设置暴露出自己 -- 太年轻
还得学习一下

在jQuery中，获取元素高度的函数有3个，它们分别是height()、 innerHeight()、outerHeight()。

与此相对应的是，获取元素宽度的函数也有3个，它们分别是width()、 innerWidth()、outerWidth()。

**敲重点**

height():其高度范围是所匹配元素的高度height；

innerheight():其高度范围是所匹配元素的高度height+padding；

outerheight():其高度范围是所匹配元素的高度height+padding+border；

outerheight(true)其高度范围是所匹配元素的高度height+padding+border+margin；