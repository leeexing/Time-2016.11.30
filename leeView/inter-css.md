# inter-css

> css杂谈

## Normalize.css

只是一个很小的css文件。但它在默认的HTML元素样式上提供了跨浏览器的高度一致性
`Normalize.css`是一种 `reset css` 的替代方案。

REFER: https://jerryzou.com/posts/aboutNormalizeCss/

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

## 优秀样式收集

### 阴影

```css
.github-btn {
  position: absolute;
  right: 40px;
  bottom: 50px;
  text-decoration: none;
  padding: 15px 25px;
  border-radius: 4px;
  box-shadow: 0px 4px 30px -6px rgba(36, 52, 70, 0.65);
  background: #24292e;
  color: #fff;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 16px;
  transition: all .3s ease-in-out;

  @media screen and (min-width: 500px) {
    &:hover {
      transform: scale(1.1);
      box-shadow: 0px 17px 20px -6px rgba(36, 52, 70, 0.36);
    }
  }

  @media screen and (max-width: 700px) {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: 20px;

    &:active {
      transform: scale(1.1);
      box-shadow: 0px 17px 20px -6px rgba(36, 52, 70, 0.36);
    }
  }
}
```

### vue transition 的name 动画效果

```css
//scale out

.scale-out-enter-active {
  transition: all .35s ease-in-out;
}
.scale-out-leave-active {
  transition: all .35s ease-in-out;
}
.scale-out-enter {
  transform: scale(.55);
  pointer-events: none;
  opacity: 0;
}
.scale-out-leave-to {
  transform: scale(1.2);
  pointer-events: none;
  opacity: 0;
}


//scale in

.scale-in-enter-active {
  transition: all .35s ease-in-out;
}
.scale-in-leave-active {
  transition: all .35s ease-in-out;
}
.scale-in-enter {
  transform: scale(1.2);
  pointer-events: none;
  opacity: 0;
}
.scale-in-leave-to {
  transform: scale(.55);
  pointer-events: none;
  opacity: 0;
}
```

### boxshadow

```css
box-shadow: 0px 55px 75px -10px rgba(76, 70, 124, 0.5);
box-shadow: 0px 55px 105px 10px rgba(76, 70, 124, 0.35);
box-shadow: 0px 15px 35px -5px rgba(50, 88, 130, 0.32);
```

### :before :after

封面效果。主要是阴影效果很好看

```less
&-cover {
  width: 300px;
  height: 300px;
  margin-left: -70px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  border-radius: 15px;
  // transform: perspective(512px) translate3d(0, 0, 0);
  // transition: all .4s cubic-bezier(.125, .625, .125, .875);
  z-index: 1;

  @media screen and (max-width: 576px), (max-height: 500px) {
    margin-top: -70px;
    margin-bottom: 25px;
    width: 290px;
    height: 230px;
    margin-left: auto;
    margin-right: auto;
  }

  &__item {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    position: absolute;
    left: 0;
    top: 0;

    &:before {
      content: "";
      background: inherit;
      width: 100%;
      height: 100%;
      box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
      display: block;
      z-index: 1;
      position: absolute;
      top: 30px;
      transform: scale(0.9);
      filter: blur(10px);
      opacity: 0.9;
      border-radius: 15px;
    }

    &:after {
      content: "";
      background: inherit;
      width: 100%;
      height: 100%;
      box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
      display: block;
      z-index: 2;
      position: absolute;
      border-radius: 15px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
    user-select: none;
    pointer-events: none;
  }
}
```

一个按钮，鼠标滑动上去，有一个背景颜色，同时背景有一个逐渐放大的过程

```less
&__item {
      display: inline-flex;
      font-size: 30px;
      padding: 5px;
      margin-bottom: 10px;
      color: #acb8cc;
      cursor: pointer;
      width: 50px;
      height: 50px;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease-in-out;

      @media screen and (max-width: 576px), (max-height: 500px) {
        font-size: 26px;
        padding: 5px;
        margin-right: 10px;
        color: #acb8cc;
        cursor: pointer;
        width: 40px;
        height: 40px;
        margin-bottom: 0;
      }

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #fff;
        transform: scale(0.5);
        opacity: 0;
        box-shadow: 0px 5px 10px 0px rgba(76, 70, 124, 0.2);
        transition: all 0.3s ease-in-out;
        transition: all 0.4s cubic-bezier(0.35, 0.57, 0.13, 0.88);
      }

      @media screen and (min-width: 500px) {
        &:hover {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }

      @media screen and (max-width: 576px), (max-height: 500px) {
        &:active {
          color: #532ab9;

          &::before {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      }
    &.-xl {
        margin-bottom: 0;
        font-size: 95px;
        // filter: drop-shadow(0 2px 8px rgba(172, 184, 204, 0.3));
        // filter: drop-shadow(0 9px 6px rgba(172, 184, 204, 0.35));
        filter: drop-shadow(0 11px 6px rgba(172, 184, 204, 0.45));  // =》》》》 这个很有趣，也很有效果
        color: #fff;
        width: auto;
        height: auto;
        display: inline-flex;
        @media screen and (max-width: 576px), (max-height: 500px) {
          margin-left: auto;
          font-size: 75px;
          margin-right: 0;
        }
        &:before {
          display: none;
        }
      }

      &.-favorite {
        &.active {
          color: red;
        }
      }
    }
```

### 直接使用属性值来定义样式

一种很有意思的写法.

```css
/* <div v-cloak></div> */
[v-cloak] {
  display: none;
}
[v-cloak] > * {
  display: none;
}
```
