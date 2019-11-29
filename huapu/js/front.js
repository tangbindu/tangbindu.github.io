//依赖的事件源
;function extend(subType, superType) {
    subType.prototype = $.extend(subType.prototype, new superType());
    subType.prototype.constructor = subType;
}
//制作事件驱动源
function eventTarget() {}
eventTarget.prototype = {
    constructor: eventTarget,
    handler: function(type, handler) {
        //添加事件对象
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = new Array();
        }
        this.handlers[type] = this.handlers[type].concat(handler);
    },
    removeHandler: function(type, handler) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handler[i] == handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    },
    trigger: function(type) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].call(this, this);
            }
        }
    }
};

var tool={
    isImage:function(name){
        var re=new RegExp(".*?.(jpg|png|gif)","i"); 
        return re.test(name)
    },
    getUrlImageName(url){
        return url.match(new RegExp("[^/]*?.(jpg|png|gif)","i"))[0];
    },
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}


//构造操作对象源－－－－－－－－－－－－－－－－－－－－－－－－－－－－
function PngCut(config) {
    var conf = config || {};
    this.stage = $("#stage");
    this.clip_img_wrap = $("#clip-img-wrap");
    this.receiveImgData = null; //但前裁切图片的imgDate
    this.cut_board = $(".cut_board");
    this.start_cut_btn = $("#start-cut-btn");
    this.protect_rect_btn = $(".protect-rect-btn");
    this.fixed_range = $("#fixed_range");
    this.curImgName=null;
    $.extend(this, conf);
    //初始化裁切交互
    this.init = function() {
        this.fixed_range.bind("change", function() {
            var val = $(this).val();
            if (val % 2 == 1) {
                val++;
            }
            $("#fixed_range_val").text(val + "px")
        })
    };
    this.init.call(this)
}
PngCut.prototype = {
    cut: function(imgData, callback) {
        //使用icon对象裁切,传入图片数据，和参数配置
        var ico = new Icon(imgData, this);
        ico.getRectList(function(list) {
            callback && callback(list);
        })
    },
    receiveImg: function(imgData,imgName) {
        this.curImgName=imgName;
        this.receiveImgData = imgData;
        this.trigger("receiveImg");
    }
};
extend(PngCut, eventTarget)
var pc = new PngCut();




//对图片设置保护区
function img2Canvas(img) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    $(img).before(canvas);
    funNav.removeThumb($(img).attr("sid"));
    $(img).remove();
    return canvas;
}

function canvas2Img(cvs,data) {
    var img = document.createElement("img");
    img.setAttribute("class", "icon-img");
    //取出图片，替换原有的图片
    img.src = cvs.toDataURL("image/png");
    if(data){
        img.src=data;
    }

    var ram = (Math.random() * 100000).toFixed(5);
    ram = ram >> 0;
    var sid = "sid" + ram;
    img.setAttribute("sid", sid);

    $(cvs).before(img);
    $(cvs).remove();
    return img;
}

function setProtectRect(canvas) {
    var ctx = canvas.getContext("2d");
    $(canvas).bind("mousedown", function(event) {
        $(this).unbind("mousemove");
        $(this).unbind("mouseup");
        var hasActive = $(".protect-rect-btn").hasClass("active");
        var x = event.offsetX,
            y = event.offsetY;
        //拉一个矩形区域
        if (hasActive) {
            //存在active
            var width, height, pat;
            $(this).bind("mousemove", function(event) {
                width = event.offsetX - x;
                height = event.offsetY - y;
                //填充图案
                pat = ctx.createPattern(document.getElementById("img-pattern"), "repeat");
                ctx.fillStyle = pat;
                //填充图案
                ctx.fillRect(x, y, width, height);
            })
            $(this).bind("mouseup", function(event) {
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.fillRect(x, y, width, height);
                ctx.closePath();
                $(this).unbind("mousemove")
            })
        }

    })
}


//接受图片后的处理
pc.handler("receiveImg", function() {
    //工作
    pc.stage.parent().addClass("working");
    var icon_img = $("<img src='" + this.receiveImgData + "'/>")[0];
    var icon_img_wrap = document.createElement("div"); //icon容器
    var icon_img_info = document.createElement("div"); //图片信息
    var icon_fun_board = document.createElement("div"); //功能板块
    var icon_img_download = document.createElement("span"); //下载按钮
    var icon_img_base64 = document.createElement("span"); //base64
    var icon_img_delete = document.createElement("span"); //下载按钮
    icon_img_wrap.setAttribute("class", "icon-img-wrap");

    let blob=tool.dataURLtoBlob(this.receiveImgData);
    var volume=0;
    if(blob.size<1024){
        volume=parseInt(blob.size)+"byte" 
    }else if(blob.size<(1024*1024)){
        volume=(blob.size/1024).toFixed(2)+"K"
    }else if(blob.size<(1024*1024*1014)){
        volume=(blob.size/(1024*1024)).toFixed(2)+"M"
    }
   
    //图片
    icon_img.setAttribute("class", "icon-img");
    //图片打标签
    var ram = (Math.random() * 100000).toFixed(5);
    ram = ram >> 0;
    var sid = "sid" + ram;
    icon_img.setAttribute("sid", sid);
    //获取图片名称
    icon_img.setAttribute("name",pc.curImgName);
    //图片信息
    icon_img_info.setAttribute("class", "icon-info");
    setTimeout(function(){
        icon_img_info.innerHTML = "<span class='iconVolume'>"+volume+"</span>"+"<span class='iconSize'>"+icon_img.naturalWidth + "*" + icon_img.naturalHeight+"</span>"+"<span class='iconName'>"+icon_img.getAttribute("name")+"</span>";
    },100)
    //base64
    icon_img_base64.setAttribute("class", "icon-base64");
    icon_img_base64.setAttribute("title", "获取图base64");
    icon_img_base64.innerHTML = "base64"
    //下载，删除
    icon_img_download.setAttribute("class", "icon-download");
    icon_img_download.setAttribute("title", "下载当前icon");
    icon_img_download.innerHTML = "&#xe612;"
    icon_img_delete.setAttribute("class", "icon-delete");
    icon_img_delete.setAttribute("title", "删除当前icon");
    icon_img_delete.innerHTML = "&#xe613;"
    //功能面板
    icon_fun_board.setAttribute("class", "icon-fun-board");
    icon_fun_board.appendChild(icon_img_download);
    icon_fun_board.appendChild(icon_img_base64);
    icon_fun_board.appendChild(icon_img_delete);
    //包装
    icon_img_wrap.appendChild(icon_img);
    icon_img_wrap.appendChild(icon_img_info);
    icon_img_wrap.appendChild(icon_fun_board);
    clip_img_wrap.append(icon_img_wrap);
})

//框选保护区
$(".protect-rect-btn").bind("click", function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
        var img = pc.clip_img_wrap.find(".icon-img.active").eq(0)[0];
        var cvs = img2Canvas(img);
        $(cvs).css("cursor", "crosshair");
        setProtectRect(cvs);
    } else {
        var canvas = pc.clip_img_wrap.find("canvas").eq(0)[0];
        var img=canvas2Img(canvas);
        $(img).addClass("active")
    }
});



//监视icon选择态
function watchActiveIconImg(){
    if (pc.clip_img_wrap.find(".icon-img.active").length == 1 && pc.clip_img_wrap.find("canvas").length == 0) {
        //显示切图面板
        pc.stage.addClass("working-cut-before");
        pc.receiveImgData=pc.clip_img_wrap.find(".icon-img.active").attr("src");
        /*//第一张图改canvas
        var cvs=img2Canvas(icon_img);
        //给canvas绑定事件
        setProtectRect(cvs);*/
     } else {
         pc.stage.removeClass("working-cut-before");
         var cvs=pc.clip_img_wrap.find("canvas");
         $(".protect-rect-btn").removeClass("active")
         if(cvs.length==1){
            canvas2Img(cvs.eq(0)[0],pc.receiveImgData);
            //重新审视
            if (pc.clip_img_wrap.find(".icon-img.active").length == 1 && pc.clip_img_wrap.find("canvas").length == 0) {
                pc.stage.addClass("working-cut-before");
                pc.receiveImgData=pc.clip_img_wrap.find(".icon-img.active").attr("src");
             } 
        }
     }
}

//切图
pc.start_cut_btn.bind("click", function() {
    if (pc.protect_rect_btn.hasClass("active")) {
        pc.protect_rect_btn.trigger("click")
    }
    var cp=pc.clip_img_wrap.find("canvas").eq(0).parent();
    var ip=pc.clip_img_wrap.find(".icon-img.active").eq(0).parent();
    var icon_wrap= cp.length==1 ? cp : ip;
    if (pc.clip_img_wrap.find("img").eq(0).hasClass("active")) {
        pc.clip_img_wrap.find("img").eq(0).trigger("click");
    }
    //获取修改后的图片
    var imgData = icon_wrap.find("img").eq(0).attr("src");
    //获取最初的图片
    var originImg = pc.receiveImgData;
    //获取配置
    var fixed = pc.fixed_range.val();
    //loading
    util.show_g_loading();
    //开始切图
    var ico = new Icon(imgData, {
        fixed: Math.round(fixed / 2)
    });
    ico.init(function() {
        cutIconFromImg(
            icon_wrap,//节点
            originImg, //图片对象
            this.boxes, //切割数据
            "clip-img-wrap" //输出容器
        );
    });
})
//切割icon
var rank = 0;
function cutIconFromImg(icon_wrap,img, boxes, output) {
    util.hide_g_loading();
    pc.stage.removeClass("working-cut-before");
    //清空clip_img_wrap
    //$("#clip-img-wrap").html("");
    //canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var imgDa=ctx.createImageData(1,1);
    imgDa.data[0] = 0;
    imgDa.data[1] = 0;
    imgDa.data[2] = 0;
    imgDa.data[3] = 0;
    var left = 0;
    var top = 0;
    var width = 0;
    var height = 0;
    for (var i = 0; i < boxes.length; i++) {
        left = boxes[i].left;
        top = boxes[i].top;
        width = boxes[i].right - boxes[i].left;
        height = boxes[i].bottom - boxes[i].top;
        cut(i, boxes[i]);
    }
    icon_wrap.remove();
    function cut(i, item) {
        var modify = false;
        canvas.width = width;
        canvas.height = height;
        var imgNode = document.createElement("img");
        imgNode.setAttribute("src", img);
        ctx.drawImage(imgNode, left, top, width, height, 0, 0, width, height);
        var imgName=$("#icon-name-before").val() + (++rank) + '.png';
        if( boxes.length==1){
            imgName=icon_wrap.find("img").attr("name");
        }
        pc.receiveImg(
            canvas.toDataURL("image/png"),
            imgName
        );
    }
}
//舞台
var stage = $("#stage");
//icon容器
var clip_img_wrap = $("#clip-img-wrap");
//前台-拖拽上传
stage[0].addEventListener("dragenter", function(e) {
    e.stopPropagation();
    e.preventDefault();
}, false);
stage[0].addEventListener("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();
}, false);
stage[0].addEventListener("drop", function(e) {
    if(e.dataTransfer && e.dataTransfer.items[0].type.indexOf('text/uri-list') > -1){
        return;
        e.dataTransfer.items[0].getAsString(function (str) {
            if(IsURL(str) && tool.isImage(str)){
                pc.receiveImg(str,tool.getUrlImageName(str));
            }
        })
    }else{
        handleFile(e.dataTransfer.files);
        //获取图片
        function handleFile(files) {
            var i=0;
            var reader = new FileReader();
            function readerFiles(i){
                var file = files[i];
                if(i==files.length){return false;}
                reader.onload = (function(theFile) {
                    var imgData = theFile.srcElement.result;
                    //这里接受图片
                    pc.receiveImg(imgData,file.name);
                    readerFiles(++i);
                })
                reader.readAsDataURL(file);
            }
            readerFiles(i);
        }
    }
    e.stopPropagation();
    e.preventDefault();
}, false);
var pasteNum=0;
function IsURL (str_url) { 
    var strRegex = '^((https|http|ftp|rtsp|mms)?://)' 
    + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
    + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
    + '|' // 允许IP和DOMAIN（域名） 
    + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
    + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
    + '[a-z]{2,6})' // first level domain- .com or .museum 
    + '(:[0-9]{1,4})?' // 端口- :80 
    + '((/?)|' // a slash isn't required if there is no file name 
    + '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
    var re=new RegExp(strRegex); 
    return re.test(str_url);
}
//查找box元素,检测当粘贴时候,
window.addEventListener('paste', function(e) {
    //判断是否是粘贴图片
    if (e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) 
    {
        var that     = this,
            reader   = new FileReader();
            file     = e.clipboardData.items[0].getAsFile();
            reader.onload = (function(theFile) {
                var imgData = theFile.srcElement.result;
                //图片名称
                var imgName="paste"+(pasteNum++)+".png";
                //这里接受图片
                pc.receiveImg(imgData,imgName);
            })
            reader.readAsDataURL(file);
    }else if(e.clipboardData && e.clipboardData.items[0].type.indexOf('text/plain') > -1){
        return;
        e.clipboardData.items[0].getAsString(function (str) {
            if(IsURL(str) && tool.isImage(str)){
                pc.receiveImg(str,tool.getUrlImageName(str));
            }
        })
    }else{
        return;
    }
}, false);
//前台-手动上传
$("#uploadImg").bind("change", function(event) {
    //变化场景
    var file = event.target.files[0];
    //图片数据
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        var imgData = theFile.srcElement.result;
        //这里接受图片
        var imgName=file.name;
        //这里接受图片z
        pc.receiveImg(imgData,imgName); 
    })
    reader.readAsDataURL(file);
})
/*
 *imglist {imglist}  jq_img_list 图片对象列表
 *param {json}  下载的一些配置
 */
function downloadImg(imglist, param) {
    // var conf = {
    //     name: "icon",
    //     sizeType: "odd" // even
    // }
    // conf = $.extend(conf, param);
    if (imglist.length == 1) {
        download(imglist);
    } else if (imglist.length > 1) {
        zipdownload(imglist);
    }
    function dataURIToBlob(dataURI) {
      var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      var blob = new Blob([arr], {type: 'image/png'});
      return blob;
    }
    function download(imglist) {
        var a = document.createElement('a');
        // if(imglist.attr("name")){
            a.setAttribute('download', imglist.attr("name"));
        // }else{
            // a.setAttribute('download', conf.name + (++rank) + '.png');
        // }
        a.href = URL.createObjectURL(dataURIToBlob(imglist.attr("src")));
        a.innerHTML = 'download';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
    };
    //zip download
    function zipdownload(imglist) {
        var zip = new JSZip();
        var img = zip.folder("images");
        rank = 0;
        imglist.each(function() {
            var name=$(this).attr("name");
            var src=$(this).attr("src");
            var imgData=src.substr(src.indexOf(',')+1);
            img.file(name, imgData, { base64: true });

        })
        var content = zip.generate({ type: "blob" });
        // see FileSaver.js
        saveAs(content, "images.zip");
    }
}
//前台-下载全部
$("#icon-download-all").bind("click", function() {
    var imglist = clip_img_wrap.find("img");
    var name = $("#icon-name-before").val();
    downloadImg(
        imglist, {
            "name": $("#icon-name-before").val()
        }
    )
})
//前台-下载单个
stage.on("click", ".icon-download", function() {
    var img = $(this).parent().parent().find("img");
    downloadImg(
        img, {
            "name": $("#icon-name-before").val()
        }
    )
});
//获取base64
stage.on("click", ".icon-base64", function() {
    var base64=$(this).parent().parent().find(".icon-img").attr("src");
    var copyTextarea = document.createElement('textarea');
    copyTextarea.value=base64;
    copyTextarea.style.height="0";
    document.body.appendChild(copyTextarea);
    copyTextarea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? '已经复制到粘贴板' : '获取失败';
        //console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('获取失败');
    }
    $(copyTextarea).remove()
});
//前台-选择-删除-更新预览区
function removeIcon(icon_img){
    for(var i=0;i<icon_img.length;i++){
        var sid = icon_img.eq(i).attr("sid");
        funNav.removeThumb(sid);
        icon_img.eq(i).parent().remove();
    }
    if(pc.stage.find(".icon-img-wrap").length==0){
        pc.stage.parent().removeClass("working");
    }
}
//前台-删除单个
stage.on("click", ".icon-delete", function() {
    removeIcon($(this).parent().parent().find(".icon-img"))
});


//前台-帮助
$("#help").bind("click", function(event) {
    alert("这里有一个简易帮助，待完善")
})


//前台-icon布局
$("#layout-row-button").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
    $("#clip-img-wrap").attr("class", "");
})
$("#layout-table-button").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
    $("#clip-img-wrap").attr("class", "layout-table");
})
//大小排序

$("#layout-rank-button").on("click", function() {
    $(this).addClass("active").siblings().removeClass("active");
    $("#clip-img-wrap").attr("class", "layout-rank");

    var icon_arr=[];
    for(var i=0;i<$("#clip-img-wrap .icon-img-wrap").length;i++){
        icon_arr.push($("#clip-img-wrap .icon-img-wrap").eq(i).clone(true))
    }
    icon_arr.sort(function(a,b){
        return a.find(".icon-img").eq(0)[0].naturalWidth-b.find(".icon-img").eq(0)[0].naturalWidth;
    })
    icon_arr.reverse();
    $("#clip-img-wrap").html("");
    for(var i=0;i<icon_arr.length;i++){
        $("#clip-img-wrap").append(icon_arr[i]);
    }

})
//----------------------------------前台-导航区-----------------------------------
funNav = {
    removeThumb: function(sid) {
        $("#fun-board .nav ul").find("[sid=" + sid + "]").parent().remove();
        this.refreshList();
    },
    addThumb: function(img) {
        var sid=img.attr("sid");
        if($("#fun-board .nav ul").find("[sid=" + sid + "]").length==0)
        {
            var li = $("<li>").append(img);
            $("#fun-board .nav ul").append(li);
            this.refreshList();
        }
    },
    //刷新列表
    refreshList: function() {
        var length = $("#fun-board .nav ul li").length;
        var nav = $("#fun-board .nav")
        if (length <= 9) {
            nav.attr("class", "nav num" + length)
        } else {
            nav.attr("class", "nav numx")
        }
    }
}
function choise_icon(icon_img){
    for(var i=0;i<icon_img.length;i++){
        icon_img.eq(i).addClass("active");
        funNav.addThumb(icon_img.eq(i).clone(false))
        //前台-选择-删除-更新尺寸区
        var size = icon_img.eq(i).parent().find(".iconSize").text();
        var size_w = size.split("*")[0];
        var size_h = size.split("*")[1];
        $(".resize-icon .w").val(size_w);
        $(".resize-icon .h").val(size_h);
    }
    watchActiveIconImg();
}
function unchoise_icon(icon_img){
    for(var i=0;i<icon_img.length;i++){
        icon_img.eq(i).removeClass("active");
        funNav.removeThumb(icon_img.eq(i).attr("sid"))
    }
    watchActiveIconImg();
}
//前台-选择-更新预览区
$("#clip-img-wrap").delegate(".icon-img", "click", function() {
    var hasActive = $(this).hasClass("active");
    if (hasActive == true) {
        unchoise_icon($(this))
    } else {
        choise_icon($(this))
    }
})
//前台-选择全部 ，取消选择
$(".cannel-choise").bind("click", function() {
    $("#clip-img-wrap").find(".icon-img.active").trigger("click");
})
$(".all-choise").bind("click", function() {
    $("#clip-img-wrap").find(".icon-img").trigger("click");
})
$(".iconName").live("click",(event)=>{
    let innerHTML=$(event.currentTarget)[0].innerHTML;
    if(innerHTML.indexOf("input")<0){
        let input=document.createElement("input");
        input.setAttribute("class","inputname");
        let format=document.createElement("span");
        format.innerHTML=".png";
        input.value=innerHTML.split(".")[0];
        $(event.currentTarget)[0].innerHTML="";
        $(event.currentTarget)[0].appendChild(input);
        $(event.currentTarget)[0].appendChild(format);
        input.focus();
        $(input).live("change",(event)=>{
            if($(event.currentTarget).val()!=""){
                $(event.currentTarget).parent().parent().parent().find(".icon-img").attr("name",$(event.currentTarget).val()+".png");
                $(event.currentTarget).parent()[0].innerHTML=$(event.currentTarget).val()+".png";
            }else{
                $(event.currentTarget).parent()[0].innerHTML=$(event.currentTarget).parent().parent().parent().find(".icon-img").attr("name");
            }
        })
    }
})
//文本输入框
$(".input-number").bind("keyup", function() {
    var val = $(this).val();
    var newval = val.replace(/\D/, "")
    if (val != newval)
        $(this).val(newval)
})
//获取需要调整的图片，调整原点，获取尺寸，开始调整
$(".resize-icon-target li").bind("click", function() {
    $(this).addClass("active").siblings().html("").removeClass("active");
    $(this).html("&#xe616;")
})
//调整尺寸
$("#resize-icon-btn").bind("click", function() {
    var resize_Images = $("#clip-img-wrap img.active");
    var origin = $(".resize-icon-target .active").attr("class").slice(7, 10);
    var w = $(".resize-icon .w").val();
    var h = $(".resize-icon .h").val();
    w = w.toString().replace(/\D/, "");
    h = h.toString().replace(/\D/, "");
    resize_Images.each(function() {
        // $(this).parent().find(".icon-info").text(w + "*" + h);
        resizeImage($(this)[0],"clip", {
            "origin": origin,
            "width": w,
            "height": h
        })
    })
})
$("#resize-icon-scale").bind("click", function() {
    var resize_Images = $("#clip-img-wrap img.active");
    var w = $(".resize-icon .w").val();
    var h = $(".resize-icon .h").val();
    w = w.toString().replace(/\D/, "");
    h = h.toString().replace(/\D/, "");
    resize_Images.each(function() {
        resizeImage($(this)[0], "scale",{
            "origin": origin,
            "width": w,
            "height": h
        })
    })
})
//调整尺寸
$("#resize-icon-padding-btn").bind("click", function() {
    var padding = $("#resize-icon-padding-val").val();
    var resize_Images = $("#clip-img-wrap img.active");
    if (padding < 0 || padding > 5000 || resize_Images.length == 0) {
        return false;
    }
    $("#resize-icon-padding-val").val("");
    resize_Images.each(function() {
        w = $(this)[0].naturalWidth - 0 + padding * 2;
        h = $(this)[0].naturalHeight - 0 + padding * 2;
        $(this).parent().find(".icon-info").text(w + "*" + h);
        resizeImage($(this)[0],"clip" ,{
            "origin": "c_c",
            "width": w,
            "height": h
        })
    })
})
//调整尺寸
$("#resize-icon-even").bind("click", function() {
    var resize_Images = $("#clip-img-wrap img");
    if (resize_Images.length == 0) {
        return false;
    }
    resize_Images.each(function() {
        w = $(this)[0].naturalWidth;
        h = $(this)[0].naturalHeight;
        w = w % 2 == 1 ? ++w : w;
        h = h % 2 == 1 ? ++h : h;
        $(this).parent().find(".icon-info").text(w + "*" + h);
        resizeImage($(this)[0],"clip" ,{
            "origin": "c_c",
            "width": w,
            "height": h
        })
    })
})
//get style
function showStyle(){
    $(".style-dialog").addClass("show");
}
function setStyleValue(param){
    var imgs=$("#clip-img-wrap").find("img[name]");
    function showstyle(img){
        var name;
        var src;
        var width;
        var height;
        param.map(function(item){
            if(item=="px"){
                width=$(img).width()+"px;";
                height=$(img).height()+"px;";
            }
            if(item=="rem"){
                width=($(img).width()/100).toFixed(2)+"rem;"
                height=($(img).height()/100).toFixed(2)+"rem;"
            }
            if(item==".png"){
                name=$(img).attr("name").slice(0,$(img).attr("name").indexOf("."));
                src="../img/"+$(img).attr("name");
            }
            if(item=="base64"){
                name=$(img).attr("name").slice(0,$(img).attr("name").indexOf("."));
                src=$(img).attr("src");
            }
        })
        return [
            " ",
            "."+name+"{",
                "    width:"+width,
                "    height:"+height,
                "    background-image:url("+src+")",
                "    background-repeat:no-repeat",
                "    background-size:100% 100%",
            "}"
        ].join("\n");
    }
    var template="{}"
    var styles="";
    var names="";
    for(var i=0;i<imgs.length;i++){
        styles+=showstyle(imgs.eq(i));
        names+=("."+imgs.eq(i).attr("name").slice(0,imgs.eq(i).attr("name").indexOf("."))+"\n");
    }
    $(".style-dialog").find("textarea").val(styles+"\n"+"\n"+"\n"+names); 
}

$(".style-dialog .close").live("click",function(){
    $(".style-dialog").removeClass("show");
})
$("#get-style").live("click", function() {
    showStyle();
    setStyleValue(["px",".png"]);
})
$(".fun-style .min-btn").live("click",function(){
    $(this).addClass("active").siblings().removeClass("active");
    var arr=[];
    $(".fun-style .min-btn.active").each(function(){
        arr.push($(this)[0].innerHTML);
        setStyleValue(arr);
    })
})
//合序列帧 
//水平
$("#composite-frame-h").bind("click", function() {
    compositeFrame("v");
}) 
//垂直
$("#composite-frame-v").bind("click", function() {
    compositeFrame("h");
})
var spriteRank=0;
//合成序列帧
function compositeFrame(type){
    //合成后的信息注入在clipImgWrap上
    var clipImgWrap=$("#clip-img-wrap");
    var imgs=clipImgWrap.find("img");
    if(imgs.length<2){
        alert("舞台上没有图片，或者少于2张")
        return false;
    }
    var compositeFrameWidth=0;
    var compositeFrameHeight=0;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if(type=="v"){
        for(var i=0,il=imgs.length;i<il;i++){
            compositeFrameWidth=Math.max(compositeFrameWidth,imgs.eq(i)[0].naturalWidth);
            compositeFrameHeight+=imgs.eq(i)[0].naturalHeight;
        }
        canvas.width = compositeFrameWidth;
        canvas.height = compositeFrameHeight;
        var imgloc=0;
        for(var i=0,il=imgs.length;i<il;i++){
            ctx.drawImage(
                imgs.eq(i)[0], 
                0, 
                imgloc, 
                imgs.eq(i)[0].width, 
                imgs.eq(i)[0].height
            );
            imgloc+=imgs.eq(i)[0].naturalHeight;
        }

    }else if(type=="h"){
        for(var i=0,il=imgs.length;i<il;i++){
            compositeFrameWidth+=imgs.eq(i)[0].naturalWidth;
            compositeFrameHeight=imgs.eq(i)[0].naturalHeight>compositeFrameHeight ? imgs.eq(i)[0].naturalHeight : compositeFrameHeight;
        }
        canvas.width = compositeFrameWidth;
        canvas.height = compositeFrameHeight;
        var imgloc=0;
        for(var i=0,il=imgs.length;i<il;i++){
            ctx.drawImage(imgs.eq(i)[0], imgloc, 0, imgs.eq(i)[0].width, imgs.eq(i)[0].height);
            imgloc+=imgs.eq(i)[0].naturalWidth;
        }
    }
    clipImgWrap.html("");
    pc.receiveImg(canvas.toDataURL("image/png"),"sprite"+(spriteRank++)+".png"); 
}
//调整图片
/*
 *获取图片
 *获取调整点
 *获取图片新尺寸
 *载入canvas
 *重新输出
 *替换原图片
 */
function resizeImage(img,type, param) {
    var param = param || {};
    var new_width = param.width || img.width;
    var new_height = param.height || img.height;
    var origin = param.origin || "c_c";
    tempImg = new Image();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    tempImg.onload = function() {
        var x = 0;
        var y = 0;
        if(type=="clip"){
            canvas.width = new_width;
            canvas.height = new_height;
            switch (origin) {
                case "l_t":
                    x = 0;
                    y = 0;
                    break;
                case "l_c":
                    x = 0;
                    y = (canvas.height - img.height) / 2; 
                    break;
                case "l_b":
                    x = 0;
                    y = canvas.height - img.height;
                    break;
                case "c_t":
                    x = (canvas.width - img.width) / 2;;
                    y = 0;
                    break;
                case "c_c":
                    x = (canvas.width - img.width) / 2;
                    y = (canvas.height - img.height) / 2;
                    break;
                case "c_b":
                    x = (canvas.width - img.width) / 2;
                    y = canvas.height - img.height;
                    break;
                case "r_t":
                    x = canvas.width - img.width;
                    y = 0;
                    break;
                case "r_c":
                    x = canvas.width - img.width;
                    y = (canvas.height - img.height) / 2;
                    break;
                case "r_b":
                    x = canvas.width - img.width;
                    y = canvas.height - img.height;
                    break;
            }
            $(img).parent().find(".icon-info").text( canvas.width + "*" + canvas.height);
            //绘制的位置调整
            ctx.drawImage(img, x, y, img.width, img.height);
            //取出图片，替换原有的图片
            img.src = canvas.toDataURL("image/png");
        }else if(type=="scale"){
            var c_width = param.width || (param.height/this.height*this.width);
            var c_height = param.height || (param.width/this.width*this.height);
            c_width=Math.ceil(c_width);
            c_height=Math.ceil(c_height);
            $(img).parent().find(".icon-info").text(c_width + "*" + c_height);
            canvas.width=c_width;
            canvas.height=c_height;
            //绘制的位置调整
            ctx.drawImage(img, x, y, c_width, c_height);
            //取出图片，替换原有的图片
            img.src = canvas.toDataURL("image/png");
        }
        canvas=ctx=null;
    }
    tempImg.src = img.getAttribute("src");
}