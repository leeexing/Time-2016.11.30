# inter-less-sass

> 加深学习less的使用

## less

### @import

@import "foo";      // foo.less 导入为less文件
@import "foo.less"; // foo.less 导入为less文件
@import "foo.php";  // foo.php  导入为less文件
@import "foo.css";  // 语句保持原样，导入为css文件

以下选项可用于覆盖此行为。
语法：@import (keyword) "filename";
reference: 使用该less文件但是不输出它
inline: 包括在源文件中输出，但是不作处理
less: 将该文件视为less文件，无论其扩展名为什么
css: 将文件视为css文件，无论扩展名为什么
once: 该文件仅可导入一次 (默认)
multiple: 该文件可以多次导入
optional: 当没有发现文件时仍然编译

### extend 继承

```less
<selector>:extend(<parentSelector>) { }


<selector> {
  &:extend(<parentSelector>);
}

// eg 多个继承

.e:extend(.f, .g) {}
```

**继承所有状态（如伪类选择器）**：

语法： 获得继承名：extend（继承部分名 all）{…}

### Color 函数

lighten(@color, 10%);     // return a color which is 10% *lighter* than @color
darken(@color, 10%);      // return a color which is 10% *darker* than @color

saturate(@color, 10%);    // return a color 10% *more* saturated than @color // TIP: 饱和
desaturate(@color, 10%);  // return a color 10% *less* saturated than @color

fadein(@color, 10%);      // return a color 10% *less* transparent than @color
fadeout(@color, 10%);     // return a color 10% *more* transparent than @color
fade(@color, 50%);        // return @color with 50% transparency

spin(@color, 10);         // return a color with a 10 degree larger in hue than @color
spin(@color, -10);        // return a color with a 10 degree smaller hue than @color

mix(@color1, @color2);    // return a mix of @color1 and @color2

```less
@base: #f04615;

.class {
  color: saturate(@base, 5%);
  background-color: lighten(spin(@base, 8), 25%);
}
```

### 命名空间

有时候，你可能为了更好组织CSS或者单纯是为了更好的封装，将一些变量或者混合模块打包起来, 你可以像下面这样在`#bundle`中定义一些属性集之后可以重复使用:

```less
#bundle {
  .button () {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover { background-color: white }
  }
  .tab { ... }
  .citation { ... }
}

你只需要在 #header a中像这样引入 .button:

#header a {
  color: orange;
  #bundle > .button;
}
```

### 作用域

LESS 中的作用域跟其他编程语言非常类似，首先会从本地查找变量或者混合模块，如果没找到的话会去父级作用域中查找，直到找到为止.

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}

#footer {
  color: @var; // red
}
```

### 运算

```less
@base: 5%;
@filler: @base * 2;
@other: @base + @filler;
```

### 混合 mixin

```less
.mixin (@s, @color) { ... }

.class {
  .mixin(@switch, #888);
}
```

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

// 使用
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

#### 带括号的mixin不会输出

```less
.my-mixin {
  color: black;
}
.my-other-mixin() {    // TIP: 这个没有输出
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}

// output
.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```

### when

```less
@media: mobile;

.mixin (@a) when (@media = mobile) { ... }
.mixin (@a) when (@media = desktop) { ... }

.max (@a, @b) when (@a > @b) { width: @a }
.max (@a, @b) when (@a < @b) { width: @b }

.mixin (@a, @b: 0) when (isnumber(@b)) { ... }
.mixin (@a, @b: black) when (iscolor(@b)) { ... }

// 使用not

.mixin (@b) when not (@b > 0) { ... }

// 使用and

.mixin (@a) when (isnumber(@a)) and (@a > 0) { ... }
```

常见的检测函式：

iscolor
isnumber
isstring
iskeyword
isurl

### maps

```less
#colors() {
  primary: blue;
  secondary: green;
}

.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}

// 输出
.button {
  color: blue;
  border: 1px solid green;
}
```

## sass

### for循环

> 语法

```js
方式1：@for $i from 开始值 through 结束值
方式2：@for $i from 开始值 to 结束值
```

这2种方式是相似的，唯一的区别是：方式1包括结束值，方式2不包括结束值。其中“开始值”和“结束值”都是正整数。

```css 示例
@for $i from 0 to 5 {
  .dog.action-#{$i} {
    transition: all #{$i}s ease .2s;
  }
}

.dog.action-0 {
  transition: all 0s ease 0.2s; }

.dog.action-1 {
  transition: all 1s ease 0.2s; }

.dog.action-2 {
  transition: all 2s ease 0.2s; }

.dog.action-3 {
  transition: all 3s ease 0.2s; }

.dog.action-4 {
  transition: all 4s ease 0.2s; }

```

### 继承

> 注意交叉继承的问题

.meng a {
    font-weight:bold;
}

.long .link {
    @extend a;
}

编译后的CSS代码

.meng a, .meng .long .link, .long .meng .link {
  font-weight: bold;
}

类名“.meng”中的“a”选择器被类名“.long”中的类名“.link”继承了，但是由于没有在同一个父级下，会产生交叉合并的编译结果。这种其实是可以解决的，就是把父级改成相同的即可。若父级不能改的话，那么就乖乖的在写一遍，或者将“.meng a”直接换成类名，继承这个类名也可以。
