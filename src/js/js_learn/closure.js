/**
 * 一点关于 this 和 闭包 的学习
 * Created by lixing1 on 2016/12/29.
 */

    //这里没有实现i的数据绑定
var arr = [];
for(var i=0;i<2;i++){
    arr[i] = function(){
        console.log(i);
    }
}
arr[0](); //2
arr[1](); //2


//处理方法一
//立即在循环里面执行了，是可以打印出0,1来，但是没有实现按需打印的问题
var arr = [];
for(var i=0;i<2;i++){
    arr[i] = function(){
        console.log(i);
    }
    arr[i]();
}


//方法二，使用闭包. 成功锁定了i.有余arr里面的i用的是闭包里面的i，而不是for里面的i。同时每个闭包的环境都是独立的
var arr = [];
for(var i=0;i<2;i++){
    arr[i] = (function(){
        return function(){
            console.log(i);
        }
    })(i);
}
arr[0](); //0
arr[1](); //1

//换种写法
var arr = [];
for(var i=0;i<2;i++){
    (function(i){
        arr[i] = function(){
            console.log(i);
        }
    })(i);
}
arr[0](); //0
arr[1](); //1


