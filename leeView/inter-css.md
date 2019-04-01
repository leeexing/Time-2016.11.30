# inter-css

## New Tech

> css3中的新技术

### progress JPEG

photoshop 生成。 有个选择是保存为jpeg时 “连续”

## border-radius

不同于padding和margin的“上、右、下、左”的顺序，border-radius采用的是左上角、右上角、右下角、左下角的顺序

与padding和margin一样，border-radius同样可以省略部分值，省略时同样是采用对角线相等的原则

```css
.test {
  border: 1px solid red;
  border-radius: 50px 0;
}
```

// 表示 `左上` 和 `右下`

### 使用px表示数值的情况

在使用px来表示圆角值的时候，圆角的弧度一般都是一个圆形的部分弧形，具体呈现的显示效果我是按如下方法与预估和理解的：

假设一个长200px，高150px的div对象，设置它的border-radius的值为30px，那么实际呈现的圆角，其实就是一个`以30px为半径的圆顶格放置`在四个边角后所呈现的弧度

### 使用%表示数值的情况

使用%来表示圆角值的时候，如果对象的宽和高是一样的，那判断方法与第一点一致，只不过想象的时候，需要将宽高乘以百分数换算一下

如果宽高不一致，那产生的效果，其实就是以对象的宽高乘以百分数后得到的值r1和r2，作为两条半径绘制出来的椭圆产生的弧度

### border-radius完整结构形式（扩展了解一下，个人感觉好像用不到）

```css
border-radius: 1-4 length|% / 1-4 length|%;
```

我们平时的写法其实都是简写，平时我们写的border-radius : 50px，其实完整的写法应该是

```css
border-radius : 50px 50px 50px 50px / 50px 50px 50px 50px;
```

“/”前的四个数值表示圆角的水平半径，后面四个值表示圆角的垂直半径，什么是水平半径和垂直半径呢

**根据水平半径和垂直半径的值，可以形成一个椭圆或者圆形**，然后再根据这个去给元素设置圆角的弧度

## 多边框

> box-shadow, outline,outline-offset

```css
div:nth-of-type(2){
  width: 200px; height: 120px;
  background: #efebe9;
  border: 5px solid #B4A078;
  outline: #B4A078 dashed 1px;
  outline-offset: -10px;
  margin-bottom: 20px;
}
```

## 内圆角

> box-shadow, outline

We know that box-shadow will stick to the border-radius rounded edges, but the stroke outline will not fit the rounded edge border-radius, we can combine them.
Using box-shadow to fill the gap created by the stroke outline to perform the effect we want.

```css
div{
  width: 209px;
  margin: 29px auto;
  padding: 8px 16px;
  border-radius: 8px;
  background: #f4f0ea;
  // 重点
  outline: 6px solid #b4a078;
  box-shadow: 0 0 0 5px #b4a078;
}
```

## 斑马背景

> gradient, linear-gradient, radial-gradient, repeating-linear-gradient

Linear gradient linear-gradient is a very important module of CSS3, but in real development, they are not commonly used

```css
<div class="progress-outer">  <!--better extension-->
  <div class="progress-enter">
    <div class="progress-bg"></div>
  </div>
  <!-- <span>60%</span> -->
</div>

.progress-outer {
  width: 60%; height: 12px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}
.progress-enter {
  height: inherit;
  background: rgba(180, 160, 120, .2);
}
.progress-bg {
  width: 60%; height: inherit;
  border-radius: 6px;
  background: repeating-linear-gradient(-45deg, #D9CFBB  25%, #C3B393 0, #C3B393 50%,
                  #D9CFBB 0, #D9CFBB 75%, #C3B393 0);
  background-size: 16px 16px;
  animation: panoramic 20s linear infinite;
}
@keyframes panoramic{
  to {
    background-position: 200% 0;
  }
}
```

### 购物券

```css
.coupon-card {
  width: 200px;
  height: 120px;
  background-image: radial-gradient(circle at 100px -8px, transparent 20px, #b4a078 21px);
}
```

## clip-path

## 基本概念

### 文档流