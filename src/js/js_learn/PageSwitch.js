/*
	学习如何更加高效简洁的编写 jQuery 插件
 */

(function($){
	"use strict";

	/*说明:获取浏览器前缀*/
	/*实现：判断某个元素的css样式中是否存在transition属性*/
	/*参数：dom元素*/
	/*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
	var _prefix = (function(dom){
		var aprefix = ['webkit', 'moz', 'o', 'ms'],
			props = "";
		for(var i in aprefix){
			props = aprefix[i] + "Transition";
			if(dom.style[props] !== undefined){
				return "-" + aprefix[i].toLowerCase() + "-";
			}
		}
		return false;
	})(document.createElement(pageSwitch));

	//定义要实现的类；利用闭包
	var pageSwitch = (function(){
		function PageSwitch(element, options){
			this.settings = $.extend(true, $.fn.pageSwitch.defaults, options || {});
			this.element = element;	//应该传入一个jQuery对象进来
			this.init();	// 初始化事件
		}
		PageSwitch.prototype = {
			init: function(){
				var that = this;
				this.selectors = this.settings.selectors;
				this.section = this.element.find(this.selectors.section);

				this.direction = this.settings.direction == "vertical" ? true : false;
				this.pagesCount = this.pagesCount();
				this.index = (this.settings.index > 0 && this.settings.index < this.pagesCount) ? this.settings.index : 0;

				if (!this.direction || this.index) {
					this._initLayout();
				}

				if (this.settings.pagination) {
					this._initPaging();
				}

				this._initEvent();

			},
			pagesCount: function(){
				return this.section.length;
			},
			_initLayout: function(){
				var that = this;
				//非垂直方向，则使用水平方向布局
				if(!this.direction){
					var width 	  = (this.pagesCount * 100) + "%",
						cellWidth = (100 / this.pagesCount).toFixed(2) + "%";
					this.sections.width(width);
					this.section.width(cellWidth).css("float", "left");
				}

				//如果初始设置不为零，则滑动到该页
				if(this.index){
					this._scrollPage(true);
				}
			},
			/*说明： 主要针对横屏情况进行页面布局*/
			_initPaging: function(){
				var pageClass = this.selectors.page.substring(1);
				this.activeClass = this.selectors.active.substring(1);

				//构造分页按钮
				var pageHtml = "<ul class" + pageClass + ">";
				for(var i=0; i< this.pagesCount; i++){
					pageHtml += "<li></li>";
				}
				pageHtml += "</ul>";
				this.element.append(pageHtml);
				var pages = this.element.find(this.selectors.page);
				this.pageItem = page.find("li");	//为什么这里要单独出来，是有原因的。其他的方法里面会用到
				this.pageItem.eq(this.index).addClass(this.activeClass);

				if (this.direction) {
					this.element.addClass("vertical");
				} else {
					this.element.addClass("horizontal");
				}
			},
			_initEvent: function(){
				var that = this;
				/*说明：需要兼容IE 和 火狐浏览器*/
				this.element.on("mousewheel DOMMouseScroll", function(e){
					e.preventDefault();
					/*说明：originalEvent 上面帮=绑定了所有的原生事件和属性
						> 0 ,向上滚动， < 0 ,向下滚动
					*/
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					if (that.canScroll) {
						if(delta > 0 && (that.index && !that.settings.loop || that.settings.loop)){
							that.prev();
						} else if (detal < 0 && (that.index > 0 && that.index < that.pagesCount && !that.settings.lopp || that.settings.loop)){
							that.next();
						}
					}
				});
				/*说明：绑定分页点击事件*/
				this.element.on("click", that.settings.page + " li", function(){
					that.index = $(this).index();
					that._scrollPage();
				});

				if (this.settings.keyboard) {
					$(window).keydown(function(e){
						var keyCode = e.keyCode;
						if (keyCode == 37 || keyCode == 38) {
							that.prev();
						} else if (keyCode == 39 || keyCode == 40) {
							that.next();
						}
					});
				}

				/*
					说明：绑定窗口改变时间
						  为了不频繁调用resize的回调方法，做了延迟处理	
				 */
				var resizeId;
				$(window).resize(function(){
					clearTimeout(resizeId);
					resizeId = setTimeout(function(){
						var currentHeight = that.switchLength();
						var offset = that.settings.direction ? that.section.eq(that.index).offset().top : that.section.eq(that.index).offset().left;
						if (Math.abs(offset) > currentHeight/2 && that.index < (that.pagesCount-1)) {
							that.index++;
						}
						if(that.index){
							that._scrollPage();
						}
					},500);
				});

				/*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
				if (_prefix) {
					this.sections.on("transitonend webkitTransitionEnd oTransitionEnd mozTransitionEnd", function(){
						that.canScroll = true;
						if(that.settings.callback && $.type(that.settings.callback) === "function") {
							that.settings.callback();
						}
					});
				}
			},
			prev: function(){
				if(this.index > 0){
					this.index--;
				} else if(this.settings.loop){
					this.index = this.pagesCount - 1;
				}
				this._scrollPage();
			},
			next: function(){
				if (this.index < this.pagesCount) {
					this.index++;
				} else if(this.settings.loop){
					this.index = 0;
				}
				this._scrollPage();
			},
			_scrollPage: function(init){
				var that = this;
				var dest = this.section.eq(this.index).position();
				if(!dest) return;	//不知道这句是用来干嘛的，因为index不可能超出某个范围啊

				this.canScroll = false;
				if (_prefix) {
					var translate = this.direction ? "transltaY(-" +dest.top+"px)" : "translateX(-"+dest.left+"px)";
					this.sections.css(_prefix + "transition", "all " + that.settings.duration + "ms " + that.settings.easing);
					this.sections.css(_prefix + "transform", translate);
				} else {
					var animateCss = this.direction ? {top : -dest.top} : {left : -dest.left};
					this.sections.animate(animateCss, that.settings.duration , function(){
						if(that.settings.callback && $.type(that.settings.callback) === "functionn"){
							that.settings.callback();
						}
						that.canScroll = true;
					});
				}

				if (this.settings.pagination && !init) {
					this.pageItem.eq(this.index).addClass(this.activeClass).siblings().removeClass(this.activeClass);
				}
			}

		};
		return PageSwitch;
	})();


	//插件扩展；$.fn = $.prototype
	$.fn.pageSwitch = function(options){
		return this.each(function(){
			var that = this,
				instance = that.data("PageSwitch");
			if (!instance) {
				that.data("PageSwitch",(instance = new PageSwitch(options)));
			}
			if($.type(options) === "string") {
				that.data("PageSwitch")[options]();//我写的，是有问题的啊
				return instance[options]();
			}
		});
	};

	//使用的静态方法的形式将默认参数经行了设置
	$.fn.pageSwitch.defaults = {
		selectors:{
			sections: ".sections",
			section: ".section",
			page: ".pages",
			active: ".active"
		},
		index: 0,
		easing: "ease",
		duration: 500,
		loop: false,
		pagination: true,
		keyboard: true,
		direction: "vertical",
		callback: ""
	};
	//初始化
	$(function(){
		$("[data-PageSwitch]").pageSwitch();
	});

})(jQuery);