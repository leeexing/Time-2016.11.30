/**
 * 匿名函数的学习与理解
 * Created by lixing1 on 2016/12/29.
 */

/*function(){     //不能直接使用。匿名函数必须依附一个变量。
    console.log(1);
}*/
// 报错


//如果将匿名函数放入到表达式中并且后面加上小括号会自动执行这个函数
(function(){
    console.log("追梦子");
})();
// 追梦子


//匿名函数后面加括号会执行这个函数。
var a = function(){
    console.log("自执行函数");
}();
// 自执行函数


/*匿名函数不只是可以依附于一个变量，也可以依附于一个对象的属性。*/
var a = {
    fn:function(){
        console.log(1);
    }
};
a.fn(); //1


/*
同样的匿名函数当做一个对象的属性时也可以自调用。*/
var a = {
    fn:function(){
        console.log("追梦子");
    }()
}; //追梦子


/*对于表达式函数同样也可以传递参数*/
(function(a){
    console.log(a);
})(10) //10

/*如果将一个自执行的匿名函数并且没有返回值，赋值给一个变量那么这个变量的值就是undefined。
因为这个函数在赋值之前已经执行完了，而这个函数没有返回值，所以就是undefined，
如果有返回值，那么这个变量的值就是那个匿名函数的返回值。*/
var a = function(b){
    console.log(b);
}(10); //10
console.log(a); //undefined

var a = function(b){
    return b;
}(10);
console.log(a); //10


/*再说一句*/

(function(){
    //....
})();
//第一个括号是个运算符，它会返回这个匿名函数，然后最后一个小括号会执行这个函数。

/*总结也就是说只要是表达式就可以直接执行它，并且不需要函数名，那么我们还可以这样调用它。*/
-function(){
    console.log(1);
}()
