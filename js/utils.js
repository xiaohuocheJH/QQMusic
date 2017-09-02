/**
 * Created by 冷寒 on 2017/1/4.
 */
var utils=(function (){
    //字符串转化为数组
    function toArray(likeAry) {
        try{
            return Array.prototype.slice.call(likeAry);
        }catch(e){
            var ary=[];
                for(var i=0;i<likeAry.length;i++){
                    ary.push(likeAry[i]);
            }
            return ary;
        }
    }
    //从字符串中解析出json对象
    function jsonParse(jsonstr) {
        return "JSON"in window?JSON.parse(jsonstr):eval('('+jsonstr+')');
    }
    //获取随机数
    function getRandom(n,m){
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    //获取上一级哥哥节点
    function prev(ele) {
        if(typeof ele.previousElementSibling !== 'undefined'){
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while (pre && pre.nodeType !=1){
            pre=pre.previousElementSibling;
        }
        return pre;
    }
    //获取所有的哥哥节点
    function prevAll(ele) {
        var ary=[];
        var pre=prev(ele);
        while(pre){
            ary.push(pre);
            pre=prev(pre)
        }
        return ary;
    }
    //获取下一个节点
    function  next(ele) {
        var next=ele.nextSibling;
        while(next&&next.nodeType!=1){
            next=next.nextSibling;
        }
        return next;
    }
    //获取下面所有节点
    function nextAll(ele) {
        var ary=[];
        var nex=next(ele);
        while(nex){
            ary.push(nex);
            nex=next(nex)
        }
        return ary;
    }
    //获取所有的兄弟节点
    function siblings(ele) {
        return prevAll(ele).concat(nextAll(ele));
    }
    //获取相邻的两个节点
    function sibling(ele) {
        var ary=[];
        var pre=prev(ele);
        var nex=next(ele);
        pre&&ary.push(pre);
        nex&&ary.push(nex);
        return ary;
    }
    //元素索引
    function index(ele) {
        return prevAll(ele).length;
    }
    //获取所有子节点
    function children(ele,tagName){
        var childs = ele.childNodes;
        var ary = [];
        for(var i = 0; i < childs.length; i++){
            if(childs[i].nodeType == 1){
                ary.push(childs[i]);
            }
        }

        if(typeof tagName == "string"){
            for( i = 0; i < ary.length; i++ ){
                // 'SPAN'  'DIV'
                if(ary[i].nodeName !== tagName.toUpperCase()){
                    ary.splice(i,1);
                    i--;
                }
            }
        }
        return ary;
    }
    //获取浏览器窗口的各种值
    function win(attr,val) {
        if(typeof val!=='undefined'){
            document.documentElement[attr]=val;
            document.body[attr]=val;
            return;
        }
        return document.documentElement[attr]||document.body[attr];
    }
    //计算偏移量
    function offset(ele) {
    var par=ele.offsetParent;
    var l=0,t=0;
    l+=ele.offsetLeft;
    t+=ele.offsetTop;
    while(par){
        if(window.navigator.userAgent.indexOf('MSIE 8')===-1){
            t+=par.clientTop;
            l+=par.clientLeft;
        }
        l+=par.offsetLeft;
        t+=par.offsetTop;
        par=par.offsetParent;
    }
    return {left:l,top:t};
}
    //获取样式
    function getCss(ele,attr) {
        var value=null;
        if(window.getComputedStyle){
            value=window.getComputedStyle(ele)[attr];
        }else {
            if(attr==='opacity'){
                value=ele.currentStyle['filter'];
                var reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                value=reg.test(value)? reg.exec(value)[1]/100:1;
            }else{
                value=ele.currentStyle[attr];
            }
        }
        reg=/^-?\d+(\.\d+)?(px|em|rem|deg)?$/;
        if(reg.test(value)){
            value=parseFloat(value)
        }
       return value;
    }
    //设置样式
    function setCss(ele,attr,val) {
        if(attr=='opacity'){
            ele.style.opacity=val;
            ele.style.filter='alpha(opacity='+val*100+')';
            return;
        }
        if(attr=='float'){
            ele.style.cssFloat=val;
            ele.style.styleFloat=val;
            return;
        }
        var reg=/^(width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val+='px';
            }
        }
        ele.style[attr]=val;
    }
    //淡入
    function fadeIn(ele) {//淡入
        window.clearInterval(ele.timer);
        ele.timer=window.setInterval(function () {
            var val=utils.getCss(ele,'opacity');
            if(val>=1){
                window.clearInterval(ele.timer);
                return;
            }
            val+=0.01;
            utils.setCss(ele,'opacity',val)
        },20);
    }
    //单张图片加载入
    function singleDeLayLoad(img) {
        var tempimg=document.createElement('img');
        tempimg.src=img.getAttribute('real');
        tempimg.onload=function () {
            img.src=this.src;
            fadeIn(img);
        };
        tempimg=null;
        img.isloaded=true;
    }
    //判断className是否存在
    function hasClass(ele,className) {
        var reg=new RegExp('(^| +)'+className+'( +|$)');
        return reg.test(ele.className)
    }
    //添加className(如果出现过不动作，未出现在className内加一个"' '+className")
    function addClass(ele,className) {
        var ary=className.replace(/(^ +| +$)/g,'').split(/ +/);
        for(var i=0;i<ary.length;i++){
            var cur=ary[i];
            if(!hasClass(ele,cur)){
                ele.className+=' '+cur;
            }
        }
    }
    //去掉字符串前后的空格
    String.prototype.trim=function () {
            return this.replace(/(^ +| +$)/g,'')
        };
    //去掉className
    function removeClass(ele,className) {
        var ary=className.replace(/(^ +| +$)/g,'').split(/ +/);
        for(var i=0;i<ary.length;i++){
            var cur=ary[i];
            var reg=new RegExp('(^| +)'+className+'( +|$)','g');
            ele.className=ele.className.replace(reg,' ');
        }
    }
    //如果存在就添加，不存在就书删除
    function toggleClass(ele,className) {
        var ary=className.replace(/(^ +| +$)/g,'').split(/ +/);
        if(hasClass(ele,className)){
            removeClass(ele,className)
        }else {
            addClass(ele,className)
        }
    }
    //.getElementsByClassName()
    function getElesByClass(className,context) {
        context=context||document;
        if(context.getElementsByClassName){
            return context.getElementsByClassName(className)
        }
        var tags=context.getElementsByTagName('*');
        var classAry=className.replace(/(^ +| +$)/g,'').split(/ +/);
        var ary=[];
        for(var i=0;i<tags.length;i++){
            var curTag=tags[i];
            var tagIsOk=true;
            for(var j=0;j<classAry.length;j++){
                var curClass=classAry[j];
                var reg=new RegExp('(^| +)'+curClass+'( +|$)');
                if(!reg.text(curTag.className)){
                    tagIsOk=false;
                    break;
                }
            }
            if(tagIsOk){
                ary.push(curTag)
            }
        }
        return ary;
    }
    //时间格式化
    function formatTime(s) {
        var min=Math.floor(s/60);
        var sec=Math.floor(s-min*60);
        min<10?min='0'+min:void 0;
        sec<10?sec='0'+sec:void 0;
        return min+':'+sec;
    }
    return {
        toArray:toArray,//字符串转化为数组
        jsonParse:jsonParse,//从字符串中解析出json对象
        getRandom: getRandom,//获取随机数
        prev:prev,//获取上一级哥哥节点
        prevAll:prevAll,//获取所有的哥哥节点
        next:next,//获取下一个节点
        nextAll:nextAll,//获取下面所有节点
        children:children,//获取所有子节点
        win:win,//获取浏览器窗口的各种值
        offset:offset,//计算偏移量
        getCss:getCss,//获取样式
        setCss:setCss,//设置样式
        fadeIn:fadeIn,//淡入
        singleDeLayLoad:singleDeLayLoad,//单张图片加载入
        hasClass:hasClass,//判断className是否存在
        addClass:addClass,//添加className(如果出现过不动作，未出现在className内加一个"' '+className")
        //trims:trims,//去掉字符串前后的空格
        removeClass:removeClass,//去掉className
        toggleClass:toggleClass,//如果存在就添加，不存在就书删除
        siblings:siblings,//获取所有的兄弟节点
        sibling:sibling,//获取相邻的两个节点
        index:index,//元素索引
        getElesByClass:getElesByClass,//.getElementsByClassName()
        formatTime:formatTime,//时间格式化
    }
})();

//


