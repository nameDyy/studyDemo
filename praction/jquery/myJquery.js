// 1. 立即执行函数封装整个Jquery的作用域
(function(window){

    var document = window.document;

    // 2. 无New式的构造过程
    var myJquery = function(selector,context) {
        return new myJquery.fn.init(selector,context)
    }

    myJquery.fn = myJquery.prototype = {
        init: function(selector,context) {

            //3. 类数组对象结构
            var domElements = document.querySelectorAll(selector)
            this.length = domElements.length
            
            for(var i = 0,length=domElements.length;i<length;i++){
                this[i] = domElements[i]
            }
            this.selector = selector;
            this.context = context || document;

            return this
        },
        constructor: myJquery
    }

    myJquery.prototype.init.prototype = myJquery.fn

    // 4. 链式调用
    // myJquery.fn.val = function (value) {
    //     this[0].value = value
    //     return this
    // }

    // myJquery.fn.setColor = function ( color ) {
    //     this[0].style.color = color
    //     return this
    // }
    
    // 5.1 插件接口
    myJquery.fn.extend = function (extendObj) {
        Object.assign(this,extendObj)
    };

    // 5.2 增加插件
    // myJquery.fn.extend ({
    //     consoleVal: function() {
    //         alert(this[0].value)
    //     }
    // })

    (function(){
        var event = {
            addEventHander: function(type,fn) {
                if(document.addEventListener) {
                    this[0].addEventListener(type,fn)
                }else {
                    this[0].attchEvent('on'+type,fn)
                }
            },
            click:function(fn) {
                this.addEventHander('click',fn)
            }
        }
    
        myJquery.fn.extend(event)
    })()


    var dom={
        append:function(str){
            if(typeof str === 'string') {
                this[0].innerHTML = str
            } else if( str.nodeType ) {
                this[0].appendChild(str)
            } 
        },
        prepend: function(str) {
            if(typeof str === 'string'){
                var tempDiv = document.createElement('div');
                this[0].insertBefore(tempDiv,this[0].firstChild);
                tempDiv.outerHTML = str
                
                // innerHTML outerHTML  替换
                // 获取  写入

            }else{
                this[0].insertBefore(str,this[0].firstChild);
            }
        },
        after:function(str){
            // 在每个匹配的元素之后插入内容
            if(typeof str === 'string') {
                var divDom=document.createElement('div');
                this[0].appendChild(divDom)
                divDom.outerHTML=str;
            } else if( str.nodeType ) {
                // this[0].parentNode.appendChild(str)
                this[0].appendChild(str)
            } 
        },
        before:function(str){
            if(typeof str === 'string') {
               
            } else if( str.nodeType ) {
                this[0].prentNode.insertBefore(str,this[0])
            } 
        },
        empty:function(){
            this[0].innerHTML="";
        },
        html:function(){
           return this[0].innerHTML
        },
        text:function(){
           return this[0].innerText
        }
    }
    myJquery.fn.extend(dom)



    window.$$ = myJquery;

    // UMD格式
})(window)