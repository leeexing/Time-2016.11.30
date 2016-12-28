/**
 * 组合模式
 * Created by lixing1 on 2016/12/23.
 */

var Composite = new Interface("Composite",["add","remove","get"]);
var FormItem = new Interface("FormItem",["save"]);

var CompositeForm = function(id,method,action){
    this.element = document.createElement("form");
    this.element.id = id;
    this.element.method = method || "post";
    this.element.action = action || "#";
    this.fields = [];
};

CompositeForm.prototype.add = function(field) {
    //首先检查传进来的元素是否符合接口要求
    Interface.checkImplements(field, Composite,FormItem);
    this.fields.push(field);
    this.element.appendChild(field.getElement());
};

CompositeForm.prototype.remove = function(field){
    for(var i=0;i<this.fields.length;i++){
        if(this.fields[i] === field){
            this.fields.splice(i,1);
        }
    }
};

CompositeForm.prototype.get = function(index){
    return this.fields[index];
};

CompositeForm.prototype.save = function(){
    for(var i=0;i<this.fields.length;i++){
        this.fields[i].save();
    }
};

CompositeForm.prototype.getElement = function(){
    return this.element;
};

//用于继承的方法
function extend(sub,sup){
    var F = function(){};
    F.prototype = sup.prototype;
    sub.prototype = new F();
    sub.supClass = sup.prototype;
}

var Field = function(id){
    this.id = id;
    this.element;
};
//这是一个总的、抽象的类，还有具体的子类---input、textarea、select等
Field.prototype = {
    add:function(){
    },
    remove:function(){
    },
    get:function(){
    },
    save:function(){
        alert(this.getValue());
        //这里可以自由发挥
    },
    getElement:function(){
        return this.element;
    },
    getValue:function(){
        throw new Error("抽象方法，由子类实现获取值");
    }
};

var InputFeild = function(id,text,type){
    Field.call(this,id);    //继承父类的方法
    this.input = document.createElement("input");
    this.input.type = type || "text";
    this.input.id = id;
    this.textLabel = document.createElement("label");
    this.textLabel.appendChild(document.createTextNode(text));
    this.element = document.createElement("div");
    this.element.className = "input-field";
    this.element.appendChild(this.textLabel);
    this.element.appendChild(this.input);
};
extend(InputFeild,Field);
InputFeild.prototype.getValue = function(){
    return this.input.value;
};

var TextAreaField = function(id,text){
    Field.call(this,id);    //继承父类的方法
    this.textArea = document.createElement("textarea");
    this.textArea.id = id;
    this.textLabel = document.createElement("label");
    this.textLabel.appendChild(document.createTextNode(text));
    this.element = document.createElement("div");
    this.element.className = "textarea-field";
    this.element.appendChild(this.textLabel);
    this.element.appendChild(this.textArea);
};
extend(TextAreaField,Field);
TextAreaField.prototype.getValue = function(){
    return this.textArea.value;
};

var SelectField = function(id,text,opts){
    Field.call(this,id);    //继承父类的方法
    this.select = document.createElement("select");
    this.select.id = id;
    this.textLabel = document.createElement("label");
    this.textLabel.appendChild(document.createTextNode(text));
    for(var i=0;i<opts.length;i++){
        var o = document.createElement("option");
        o.value = opts[i];
        o.appendChild(document.createTextNode(opts[i]));
        this.select.appendChild(o);
    }
    this.element = document.createElement("div");
    this.element.className = "select-field";
    this.element.appendChild(this.textLabel);
    this.element.appendChild(this.select);
};
extend(SelectField,Field);
SelectField.prototype.getValue = function(){
    return this.select.options[this.select.selectedIndex].value;
};

var Btn = function(id,text,classname){
    this.element = document.createElement("a");
    this.element.id = id;
    this.element.appendChild(document.createTextNode(text));
    this.element.className = classname;
};
Btn.prototype.getElement = function(){
    return this.element;
};

var Select = function(id,value,opts){
    this.opts = opts || {};
    //this.element = document.createElement("input");
    this.value = value;
    this.parentEle = this.opts.parentEle;

    this.initElement();
    this.initEvent();
};
Select.prototype = {
    initElement: function(){
        this.txtEle = $("<span/>");
        this.txtEle.text(this.value);

        this.textEle = $("<input/>");
        this.textEle.val(this.value);

        this.ulEle = $("<ul/>");
        for(var i=0;i<this.opts.data.length;i++){
            this.ulEle.append($("<li class='option-item'>"+this.opts.data[i]+"</li>"));
        }
        this.parentEle.append(this.txtEle);
        this.parentEle.append(this.textEle);
        this.parentEle.append(this.ulEle);

        this.converToRead();
    },
    initEvent:function(){
        var that = this;
        this.txtEle.on("click",function(){
            that.convertToEditable();
        });
        this.ulEle.on("click","li",function(){
            that.select($(this));
        });
    },
    convertToEditable:function(){
        this.txtEle.hide();
        this.textEle.show();
        this.ulEle.show();
    },
    converToRead:function(){
        this.txtEle.show();
        this.textEle.hide();
        this.ulEle.hide();
    },
    setValue:function(value){
        this.value = value;
    },
    getValue:function(){
        return this.value;
    },
    select:function(liObj){
        console.log(liObj.text());
        this.value = liObj.text();
        this.save();
        this.converToRead();
    },
    save:function(){
        this.txtEle.text(this.getValue());
        this.textEle.val(this.getValue())
    }
};

var DragBox = function(id,opts){
    this.element = $("<div/>");
    this.element.attr("id",id);
    this.opts = opts || {};
    this.flag = false;
    this.positions = [];

    this.initElement();
    this.initEvent();
};
DragBox.prototype = {
    initElement:function(){
        this.headEle = $("<div class='head'/>");
        this.headBtn = $('<a class="reset">众神归位</a>');
        this.headEle.append(this.headBtn);
        this.positions.push({x:this.headEle.offsetLeft,y:this.headEle.offsetTop});

        this.body = $("<div class='drag-body'/>");
        this.dragIS = $('<p class="isdrag"></p>');
        this.dragX = $('<p class="drag-x"></p>');
        this.dragY = $('<p class="drag-y"></p>');
    },
    initEvent:function(){
        var that = this;
        this.headBtn.on("click",function(e){
            e.stopPropagetion();
            that.reset();
        });
        this.headEle.on("mousedown",function(e){
            this.flag = true;
            var obj = {};
            obj.x = e.clientX - that.headEle.offfsetX;
            obj.y = e.clientY - that.headEle.offfsetY;
            that.positions.push(obj);
            $(this).mousemove(function(e){

            });
            return false;
        }).on("mouseup",function(){
            that.flag = false;
            $(this).off("mousemove");
        });

    },
    reset:function(){

    }
};

/**
 * 数组求和求最大值
 */
Array.prototype.sum = function(){
    for(var sum=i=0;i<this.length;i++) sum += this[i];
    return sum;
};
Array.prototype.max = function(){
    for (var i= 0,max=Number.MIN_VALUE;i<this.length;i++){
        this[i] > max && (max = this[i]);
    }
    return max;
};
var arr = [12,45,78,89,56,23,46,79];
//console.warn(arr.join("+") + " = " + arr.sum());
//console.warn(arr.join("|") + " the max is " + arr.max());