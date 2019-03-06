# Canvas

## 基本知识

### 绘制矩形

```js
fillRect(x, y, width, height)  //绘制一个填充的矩形
strokeRect(x, y, width, height) //绘制一个矩形的边框
clearRect(x, y, width, height) //清除指定矩形区域，让清除部分完全透明。
```

### 绘制路径

```js
beginPath()
// 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
// 相当于你拿起铅笔准备画画了
closePath()
// 闭合路径之后图形绘制命令又重新指向到上下文中。
// 不是每次都需要closePath 来结束绘画 这个接口功能就相当于 你画出两笔后形成一个直角，但你想画出一个封闭的直接三角形使用这个接口，即可把终点和气垫自动连上
stroke()
// 通过线条来绘制图形轮廓。
fill()
// 通过填充路径的内容区域生成实心的图形。
```

```js 有closePath 和没有 closePath 是由区别的
var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.moveTo(20,20);
ctx.lineTo(20,100);
ctx.lineTo(70,100);
// ctx.closePath(); // 有closePath的话，会进行闭合
ctx.stroke();
```

### 动作

```js
moveTo(x,y) // 从哪开始下笔
lineTo(x,y) // 绘制一条从当前位置到指定x以及y位置的直线
arc(x, y, radius, startAngle, endAngle, anticlockwise)
// 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成

arcTo(x1, y1, x2, y2, radius) // 根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。

rect(x, y, width, height) // 绘制一个左上角坐标为（x,y），宽高为width以及height的矩形
```

### 样式

```js
fillStyle = color // 设置图形的填充颜色
strokeStyle = color // 设置图形轮廓的颜色
lineWidth = value // 线条宽度
lineCap = type // 线条末端样式 type == butt，round ，square
lineJoin = type // 线条与线条间接合处的样式 type = round，bevel，miter。默认是miter。

// 虚线
setLineDash 方法和 lineDashOffset 属性来制定虚线样式. setLineDash 方法接受一个数组，来指定线段与间隙的交替；lineDashOffset属性设置起始偏移量.

var ctx = document.getElementById('canvas').getContext('2d');
var offset = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setLineDash([4, 2]);
  ctx.lineDashOffset = -offset;
  ctx.strokeRect(10, 10, 100, 100);
}

function march() {
  offset++;
  if (offset > 16) {
    offset = 0;
  }
  draw();
  setTimeout(march, 20);
}

march();
```

### 图像

> canvas也可以吧已经有的图片 绘制在画板上进行编辑

```js
var img = new Image();   // 创建一个img
img.onload = function(){
  // 执行drawImage语句
}
img.src = 'xxx.png'; // 设置图片地址
// 如需把图片通过src绘制至canvas一定一定要使用img.onload 等待img.src加载完毕再执行渲染至canvas，不然可能渲染空白
```

```js
// 绘制
drawImage(image, x, y) // Image 为 上面的img对象或者 canvas 对象； x和y 是其在目标 canvas画布 里的起始坐标
// 缩放 Scaling
drawImage(image, x, y, width, height) // 这个方法多了2个参数：width 和 height，这两个参数用来控制 当向canvas画入时应该缩放的大小
// 切片
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// 第一个参数和其它的是相同的，其它8个参数最好是参照右边的图解，前4个是定义图像源的切片位置和大小，后4个则是定义切片的目标显示位置和大小
```

**重要**
save()
restore()

```js
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.fillRect(0,0,150,150);   // 使用默认设置绘制一个矩形
  ctx.save();                  // 保存默认状态

  ctx.fillStyle = '#09F'       // 在原有配置基础上对颜色做改变
  ctx.fillRect(15,15,120,120); // 使用新的设置绘制一个矩形

  ctx.save();                  // 保存当前状态
  ctx.fillStyle = '#FFF'       // 再次改变颜色配置
  ctx.globalAlpha = 0.5;
  ctx.fillRect(30,30,90,90);   // 使用新的配置绘制一个矩形

  ctx.restore();               // 重新加载之前的颜色状态
  ctx.fillRect(45,45,60,60);   // 使用上一次的配置绘制一个矩形

  ctx.restore();               // 加载默认颜色配置
  ctx.fillRect(60,60,30,30);   // 使用加载的配置绘制一个矩形
}
```

移动
translate(x, y) // translate方法接受两个参数。x 是左右偏移量，y 是上下偏移量，如右图所示。

旋转 Rotating
rotate(angle) // 这个方法只接受一个参数：旋转的角度(angle)，它是`顺时针`方向的，以弧度为单位的值。

缩放 Scaling
scale(x, y) // scale方法接受两个参数。x,y 分别是横轴和纵轴的缩放因子，它们都必须是正值。值比 1.0 小表示缩小，比 1.0 大则表示放大，值为 1.0 时什么效果都没有
