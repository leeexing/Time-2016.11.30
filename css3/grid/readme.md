# [Grid](https://juejin.im/entry/5894135c8fd9c5a19507f6a1)

## 1、启用网格容器 

我们使用display属性来定义一个网格容器，它的grid值决定了容器展现为块级还是内联形式。一旦启用网格容器，它的所有子元素都进入grid文档流，称为网格子项

    display: grid | inline-grid | subgrid

1. grid：定义一个块级的网格容器
1. inline-grid：定义一个内联的网格容器
1. subgrid：定义一个继承其父级网格容器的行和列的大小的网格容器，它是其父级网格容器的一个子项。

Tips: column, float, clear和vertical-align对网格容器没有效果。

每一块表示一个网格子项（网格单元），4个（任意数量）网格子项组成了网格区域。

## 2、网格容器的属性

### 2.1 grid-template-columns/grid-template-rows

    grid-template-columns: <track-size> ... | <line-name> <track-size> ...;

    grid-template-rows: <track-size> ... | <line-name> <track-size> ...;

1. <track-size>：定义网格单元的宽高，其单位可以是一个长度(如px、em、rem、vw、vh)或百分比，也可以是网格中自由空间的份数(单位为fr)。
1. <line-name>：定义网格线的名称，它不是必须值。可以一个你选择的任意名字，当没有显示设定时，它的名字以数字表示。

实例： 当你在轨迹值中间留空格，网格线将被自动以数字命名：

```css
container {

  grid-template-columns: 40px 50px auto 50px 40px;

  grid-template-rows: 25% 100px auto;

}
```

当然，我们还可以给网格线指定一个名字：

```css
.container{

  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];   

  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];  

}
```

Tips:
1. 网格线命名时必须加上中括号
2. 一根网格线还可以有多个名字，以空格隔开，中括号包裹

如果你定义了容器的重复部分，你可以使用repeat()方法来生成多个相同值

```css
.container{

  grid-template-columns: repeat(3, 20px [col-start]) 5%;  

}

/* 等价于 */

.container{

  grid-template-columns: 20px [col-start] 20px [col-start] 20px [col-start] 5%;  

}
```

### 特殊单元：fr

> fr单元允许你将网格容器中的自由空间设置为一个份数：

```css
.container{

  grid-template-columns: 1fr 1fr 1fr;

}
```

在上面的代码中，将网格容器的每个子项设置为三分之一。

Tips: 自由空间是在固定子项确定后开始计算的

```css
.container{

  grid-template-columns: 1fr 50px 1fr 1fr;

}
```

在上面的代码中，自由空间是fr单位的总和但不包括50px

### 2.2、grid-template-areas

grid-template-areas可以配合 grid-area定义一个显式的网格区域。grid-template-areas定义网格区域，然后使用grid-area调用声明好的网格区域名称来放置对应的网格项目