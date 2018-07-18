# 原生DOM位置

## 原生js获取元素的位置与尺寸的实现方法

### 内高、内宽度：内边距 + 内容框

* clientWidth
* clientHeight

1. 这两个属性大体上显示了元素内容的象素高度和宽度.理论上说这些测量不考虑任何通过样式表加入
元素中的页边距,边框等. 
2. 等于padding+width

```就是当前元素的width、height -- 不包含border```

### 外高度、外宽度：边框 + 内边距 + 内容框

* offsetWidth
* offsetHeight

1. 是元素相对父元素的偏移宽度。等于border+padding+width

```简单点，就是当前元素的设置 box-size：border-box 后元素的实际宽高```

⭐⭐⭐

1. obj.offsetWidth 指 obj 控件自身的绝对宽度，不包括因 overflow 而未显示的部分，也就是其实际占据的宽度，整型，单位像素。

### 上边框、左边框

* clientTop
* clientLeft

1. 这两个返回的是元素周围边框的厚度,如果不指定一个边框或者不定位改元素,他的值就是0.

```说白了，就是获取当前元素的边框大小```

### 元素的大小及其相对于视口的位置

getBoundingClientRect()

* x\y:元素的左上角和父元素左上角的距离
* width/height:边框 + 内边距 + 内容框
* top:元素的上边界和父元素上边界的距离
* left:元素的左边界和父元素左边界的距离
* right:元素的右边界和父元素的左边界的距离
* bottom:元素的下边界和父元素上边界的距离


### 上边偏移量、左边偏移量

* offsetTop
* offsetLeft

⭐⭐⭐

1. obj.offsetTop 指 obj 相对于版面或由 offsetParent 属性指定的父坐标的计算上侧位置，整型，单位像素。
2. offsetParent对象是指元素最近的定位（relative,absolute）祖先元素，递归上溯，如果没有祖先元素是定位的话，会返回null

❗❗❗offsetTop 可以获得 HTML 元素距离上方或外层元素的位置，style.top 也是可以的，二者的区别是：
1. offsetTop 返回的是数字，而 style.top 返回的是字符串，除了数字外还带有单位：px。
2. offsetTop 只读，而 style.top 可读写。
3. 如果没有给 HTML 元素指定过 top 样式，则 style.top 返回的是空字符串。
offsetLeft 与 style.left、offsetWidth 与 style.width、offsetHeight 与 style.height 也是同样道理。

```css
offsetParent属性返回一个对象的引用，这个对象是距离调用offsetParent的元素最近的（在包含层次中最靠近的），并且是已进行过CSS定位的容器元素。 如果这个容器元素未进行CSS定位, 则offsetParent属性的取值为根元素(在标准兼容模式下为html元素；在怪异呈现模式下为body元素)的引用。 当容器元素的style.display 被设置为 "none"时（译注：IE和Opera除外），offsetParent属性 返回 null。
```


$$用法$$

```js
parentObj = element.offsetParent

var page = document.qeurySelector('.page')
var pageParentObj = page.offsetParent

while (pageParentObj !== null) {
  // 做一些操作做
  pageParentObj = pageParentObj.offsetParent
}
```


### 可视区域的大小

* document.documentElement.clientWidth
* document.documentElement.clientHeight

### 页面的实际大小

* document.documentElement.scrollWidth
* document.documentElement.scrollHeight

1. 不管有多少对象在页面上可见,他们得到的是整体.

### 窗口左上角 与 屏幕左上角的 距离

* window.screenX
* window.screenY

### 屏幕的宽高

* window.screen.width
* window.screen.height

### 窗口的内高度、内宽度（文档显示区域 + 滚动条）

* window.innerWidth
* window.innerHeight

### 窗口的外高度、外宽度

* window.outWidth
* window.outHeight

### clientX、pageX、screenX

* screenX:鼠标位置相对于用户屏幕水平偏移量，而screenY也就是垂直方向的，此时的参照点也就是原点是屏幕的左上角。

* clientX:跟screenX相比就是将参照点改成了浏览器内容区域的左上角，该参照点会随之滚动条的移动而移动。

* pageX：参照点也是浏览器内容区域的左上角，但它不会随着滚动条而变动

## 额外

1. 其实 `jQuery` 的 `offset` 方法也是调用了 `getBoundingClientRect` 这个方法


```js
jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},
```

## 参考

* [js获取DOM位置](https://blog.csdn.net/u013861109/article/details/52894283)
