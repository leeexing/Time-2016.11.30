# css/js 中的动画

1.animation动画监听

-webkit-animation动画其实有三个事件： 
开始事件 webkitAnimationStart 
结束事件 webkitAnimationEnd 
重复运动事件 webkitAnimationIteration

```js
dom.addEventListener("webkitAnimationStart", function(){ //动画开始时事件 
    console.log("start"); 
}, false); 
dom.addEventListener("webkitAnimationEnd", function(){ //动画结束时事件 
    console.log("end"); 
}, false); 
dom.addEventListener("webkitAnimationIteration", function(){ //动画重复运动时的事件
    console.log("end"); //第一遍动画完成输出end
}, false); 
```

2.transition动画监听

this动画只有webkitTransitionEnd这一个事件

```js
dom.addEventListener("webkitTransitionEnd", function(){
    console.log("end");
}, false); 
```


```css
.love {
    display: block;
    width: 100px; height: 100px;
    background: url(http://www.zhangxinxu.com/study/201512/web_heart_animation.png) 0 0 no-repeat;
    background-size: 2900%;
    animation: heart-burst steps(28) 0.8s infinite both;
}//图片背景的动画    
.stop {
    animation-play-state: paused;✅✅✅
}
@keyframes heart-burst {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 100%;
  }
}
```