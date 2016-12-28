/**
 * Created by lixing1 on 2016/12/21.
 */

var Composite = new Interface("Composite",["add","remove","get"]);
var GalleryItem = new Interface("GalleryItem",["hide","show"]);

var GalleryGroup = function(id){
    this.gallerys = [];
    this.element = document.createElement("div");
    this.element.id = id;
    this.element.className = "gallery-group";
};

GalleryGroup.prototype = {
    add:function(child){
        /**
         * 传进来的child是一个对象，是创建img图像的一个对象
         */
        Interface.checkImplements(child,Composite,GalleryItem);
        this.gallerys.push(child);
        this.element.appendChild(child.getElement());
    },
    remove:function(child){
        console.log(child);
        for(var i=0;i<this.gallerys.length;i++){
            if(this.gallerys[i] === child){
                this.gallerys.splice(i,1);
            }
        }
        console.log(this.gallerys)
    },
    get:function(index){
        return this.gallerys[index];
    },
    hide:function(){
        for(var i=0;i<this.gallerys.length;i++){
            this.gallerys[i].hide();
        }
        this.element.style.display = "none";    //这里是隐藏包裹层
    },
    show:function(){
        this.element.style.display = "block";    //这里是隐藏包裹层
        for(var i=0;i<this.gallerys.length;i++){
            this.gallerys[i].show();
        }
    },
    getElement:function(){
        return this.element;
    }
};

/**
 * 这里是创建img的对象方法
 */
var GalleryImage = function(src){
    this.element = document.createElement("img");
    this.element.src = src;
    this.element.className = "gallery-img";
};
GalleryImage.prototype = {
    add:function(){

    },
    remove:function(){

    },
    get:function(){

    },
    hide:function(){
        this.element.style.display = "none";
    },
    show:function(){
        this.element.style.display = "block";
    },
    getElement:function(){
        return this.element;
    }
}
