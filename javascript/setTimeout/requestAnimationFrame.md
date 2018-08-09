# window.requestAnimationFrame

也可这个方法原理其实也就跟setTimeout/setInterval差不多，通过递归调用同一方法来不断更新画面以达到动起来的效果
但它优于setTimeout/setInterval的地方在于它是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，
并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。

requestAnimationFrame()函数就是针对动画效果的API，你可以把它用在DOM上的风格变化或画布动画或WebGL中

## 基本语法

可以直接调用，也可以通过window来调用，接收一个函数作为回调，返回一个ID值，通过把这个ID值传给window.cancelAnimationFrame()可以取消该次动画。

```js
requestAnimationFrame(callback)//callback为回调函数
```