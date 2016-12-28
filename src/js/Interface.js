/**
 * Created by lixing1 on 2016/11/29.
 */

var Interface = function(name){
    if(arguments.length != 2) throw new Error("创建接口不符合标准，必须有两个参数，第二个参数是接口的方法");
    this.name = name;
    this.methods = [];
    var methods = arguments[1];
    for(var i=0; i<methods.length;i++){
        this.methods.push(methods[i]);
    }
};

Interface.checkImplements = function(obj){
    if(arguments.length < 2) throw new Error("要检查的接口必须传入接口对象的参数，参数的个数必须大于2");
    for(var i= 1;i<arguments.length;i++){
        var intObj = arguments[i];
        if(intObj.constructor != Interface) throw new Error(intObj + '接口的对象不正确');
        var cmethods = intObj.methods;
        for(var j = 0;j<cmethods.length;j++){
            if(!obj[cmethods[j]] || typeof obj[cmethods[j]] != "function"){
                throw new Error("必须实现"+intObj.name+"的"+cmethods[j] + "这个方法");
            }
        }
    }
};
