/**
 * Created by lixing1 on 2016/11/29.
 */
/**
 * @param id
 * @param value
 * @param parentEle 父元素
 * @constructor
 */
function PlaceFiledEditor(id, value, parentEle){
    this.id = id;
    this.value = value;
    this.parentEle = parentEle;
    this.initValue = value;

    this.initElements();
    this.initEvents();
}

PlaceFiledEditor.prototype = {
    constructor : PlaceFiledEditor,

    /**
     * 初始化所有元素
     */
    initElements: function(){
        this.txtEle = $("<span/>");
        this.txtEle.text(this.value);

        this.textEle = $('<input type="text"/>');
        this.textEle.text(this.value);

        this.btnWrapper = $('<div style="display: inline-block"/>');
        this.saveBtn = $('<input type="button" value="保存"/>');
        this.cancelBtn = $('<input type="button" value="取消"/>');
        this.btnWrapper.append(this.saveBtn).append(this.cancelBtn);

        this.parentEle.append(this.txtEle).append(this.textEle).append(this.btnWrapper);

        this.convertToReadable();
    },
    /**
     * 初始化所有事件
     */
    initEvents: function(){
        var that = this;
        this.txtEle.on('click',function(event){
            that.convertToEditable();
        });

        this.saveBtn.on('click', function(event){
            that.save();
        });

        this.cancelBtn.on('click', function(event){
            that.cancel();
        });
    },
    /**
     * 切换到编辑模式
     */
    convertToEditable: function(){
        this.txtEle.hide();
        this.textEle.show();
        this.textEle.focus();

        if(this.getValue() === this.initValue){
            this.textEle.val("");
        }

        this.btnWrapper.show();
    },
    /**
     * 点击保存
     */
    save: function(){
        this.setValue(this.textEle.val());
        this.txtEle.html(this.getValue().replace(/\n/g, "<br/>"));

        var url = 'id='+ this.id + '&value='+ this.value;
        console.log(url);
        this.convertToReadable();
    },
    cancel:function(){
        this.textEle.val(this.getValue());
        this.convertToReadable();
    },
    /**
     * 切换到查看模式
     */
    convertToReadable: function(){
        this.txtEle.show();
        this.textEle.hide();
        this.btnWrapper.hide();
    },
    setValue: function(value){
        this.value = value;
    },
    getValue: function(){
        return this.value;
    }
};


/**
 * 写了PlaceAreaEditor继承了PlaceFieldEditor，然后复写了initElements方法，改变了text为textarea。
 * @param id
 * @param value
 * @param parentEle
 * @constructor
 */

function PlaceAreaEditor(id, value, parentEle){
    PlaceAreaEditor.superClass.constructor.call(this, id, value, parentEle);
}
//这个继承的方式一定要学会
extend(PlaceAreaEditor, PlaceFiledEditor);

        //这个方法好像就是原型链式继承，最直观的
        /*function PlaceAreaEditor(id, value, parentEle){
            console.log(id ,value,parentEle);
            PlaceFiledEditor.call(this, id, value, parentEle);
            console.log(this)
        }
        PlaceAreaEditor.prototype = PlaceFiledEditor.prototype;   */
        //这样写，加上后面的重写initElements，直接将PlacefieldEditor的原型更改了---看来这种做法还是不行的


//这样写居然是不管用的。马丹，虽然还是不知道为什么
//PlaceAreaEditor.prototype = new PlaceFiledEditor();   //最直观的继承方式

    /**
     * 换种继承方式---原型链式继承---不行，因为这种方法，不能new操作了。本来我就是我继承上面的那一个类的啊。需要初始化的
     */
    /*function extendParent(obj){
        var F = function(){};
        F.prototype = obj;
        return new F();
    }
    PlaceAreaEditor = extendParent(PlaceFiledEditor);*/

        /**
         * 继续换一种继承方式---类式继承     ---这个就可以啊！好神奇。其实方法和下面的extend方法是有点相同的啊
         */
        //对函数原型进行扩展
        /*Function.prototype.extender = function(superClass){
            var F= function(){};
            F.prototype = superClass.prototype;
            this.prototype = new F();
            this.prototype.constructor = this;
            this.superClass = superClass;
            return this;
        };
        function PlaceAreaEditor(id, value, parentEle){
            PlaceAreaEditor.superClass.call(this, id, value, parentEle);
        }
        PlaceAreaEditor.extender(PlaceFiledEditor);*/


PlaceAreaEditor.prototype.initElements = function(){
    this.txtEle = $('<span/>');
    this.txtEle.text(this.value);
    this.textEle = $('<textarea style="width: 350px;height: 75px;"/>');

    this.textEle.text(this.value);
    this.btnWrapper = $('<div>');

    this.saveBtn = $('<input type="button" value="保存"/>');
    this.cancelBtn = $('<input type="button" value="取消"/>');
    this.btnWrapper.append(this.saveBtn).append(this.cancelBtn);
    this.parentEle.append(this.txtEle).append(this.textEle).append(this.btnWrapper);

    this.convertToReadable();

};

/**
 * @param subClass  子类
 * @param superClass   父类
 */
function extend(subClass, superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    //子类的prototyp 指向 F 的 __proto__ , __proto__ 又指向父类的prototype
    subClass.prototype = new F();
    //在子类上存储一个指向父类的prototype属性，便于子类的构造方法中与父类的名称解耦，使用subClass.superClass.constructor.call 代替
    //superClass.call()
    subClass.superClass = superClass.prototype;
}