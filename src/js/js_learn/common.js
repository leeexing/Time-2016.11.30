/**
 *  常用的一些js 小功能函数
 * Created by lixing1 on 2016/12/29.
 */

    /*
        如何判断是个对象时一个数组
     */
    var arr = [12];
    typeof arr ; // Object

    //利用object的属性 constructor
    arr.constructor.name ; // Array

    //判断是否是数组的一个实例
    arr instanceof Array;

    // 利用对象object原型链上的 toString 方法
    console.log(   Object.prototype.toString.call(arr) === "[Object Array]");
//推荐方法3

/**
 * 首先我定义了一个变量var arr = [0,1,2,3,4,5];我现在想模拟push方法在这个数组的5后面加东西，我们应该怎么做？
 */
var arr2 = [0,1,2,3,4,5];
function Push(){
    for(var i;i<arguments.length;i++){
        arr[arr.length] = arguments[i];
    }
}

Array.prototype.Push = function(){
    for(var i;i<arguments.length;i++){
        this[this.length] = arguments[i];
    }
};
//把里面的arr修改成this，this表示谁调用就是谁


//3、如果有数字，把他们添加到数组中，并且如果是连续的数字那么把它们添加到一起
function strToArr(str){
    var num = '';
    var result = [];
    for(var i=0;i<str.length;i++){
        if(!isNaN(+str[i])){
            num += str[i];
            if(isNaN(+str[i+1])){
                result.push(num);
                num = '';
            }
        }
    }
    return result;
}

//给字符串加千分符，每三位加一个，
function addThousands(str){
    var first = str.length%3;
    var result = [];
    var hash = str.substring(first);
    if(first !==0){
        result.push(str.substring(0,first))
    }
    var s = '';
    for(var i=0;i<hash.length;i++){
        s += hash[i];
        if(i%3 === 2){
            result.push(s);
            s = '';
        }
    }
    console.log(result.join(","));
}

/*
 字符串中间部分变成*或指定的符号，默认保留前3位和后3位，字符长度不够时优先保留后面的字符
 */
function encodePhone(str,startNum,endNum,mask){

}