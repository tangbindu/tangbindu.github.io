import tools from "./tools.js";

export default function(imgToCode){
    //前台-拖拽上传
    window.document.addEventListener("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
    window.document.addEventListener("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
    window.document.addEventListener("drop", function(e) {
        handleFile(e.dataTransfer.files);
        //获取图片
        function handleFile(files) {
            var i = 0;
            var reader = new FileReader();
            function readerFiles(i) {
                var file = files[i];
                if (i == files.length) { return false; }
                reader.onload = (function(theFile) {
                    var imgData = theFile.srcElement.result;
                    //这里接受图片
                    const img=new Image();
                    img.onload=()=>{
                        imgToCode.uploadImage={
                            img:img,
                            name:file.name
                        }
                    }
                    img.src=imgData;
                    // readerFiles(++i);
                })
                reader.readAsDataURL(file);
            }
            readerFiles(i);
        }
        e.stopPropagation();
        e.preventDefault();
    }, false);
    let cmd=false;
    let shift=false;
    document.body.onmousewheel = function(event) {
        if(event.deltaY>0){
            //放大
            imgToCode.scaleStage(1+2/75);
        }else{
            //缩小
            imgToCode.scaleStage(1-2/75);
        }
        imgToCode.render()
    };
    document.onkeydown = function (event) {
        // console.log(event.keyCode)
        if (/Mac/.test(navigator.platform)) {
            if(cmd && event.keyCode == 65){
                //cmd+a
                imgToCode.spritesController.selectAll();
                imgToCode.render();
                event.preventDefault();
            }else if(cmd && event.keyCode == 68){
                //cmd+d
                imgToCode.spritesController.reverseSelect();
                imgToCode.render();
                event.preventDefault();
            }else if(cmd && event.keyCode == 67){
                //cmd+c
                imgToCode.spritesController.copyActiveSprites();
                imgToCode.render();
                event.preventDefault();
            }else if(cmd && event.keyCode == 86){
                //cmd+v
                imgToCode.spritesController.pasteActiveSprites();
                event.preventDefault();
            }else if (event.keyCode == 221) {
                //放大
                imgToCode.scaleStage(1+2/75);
                event.preventDefault();
            } else if (event.keyCode == 219) {
                //缩小
                imgToCode.scaleStage(1-2/75);
                event.preventDefault();
            }else if (event.keyCode == 77){
                //draw mode
                imgToCode.executeMode("draw");
                event.preventDefault();
            }else if (event.keyCode == 86){
                //edit mode
                imgToCode.executeMode("edit");
            }else if(event.keyCode == 8){
                //delete
                imgToCode.deleteSprites();
            }else if(event.keyCode == 16){
                //shift
                shift=true;
                imgToCode.pressShiftBtn=true;
            }else if(event.keyCode == 37){
                //left37
            }else if(event.keyCode == 39){
                //right39
            }else if(event.keyCode == 38){
                //right38
            }else if(event.keyCode == 40){
                //bottom40
            }else if(event.keyCode == 91){
                //command
                cmd=true;
                event.preventDefault();
            }else if(event.keyCode==57){
                //布局
            }else if(event.keyCode==32){
                //移动
                imgToCode.pressSpaceBtn=true;
                imgToCode.stage.style.cursor = 'move';
            }else{
                // console.dir(event.keyCode)
            }
        } else {
        }
        imgToCode.render()
    }
    document.onkeyup=function(event){
        imgToCode.pressShiftBtn=false;
        imgToCode.pressSpaceBtn=false;
        imgToCode.stage.style.cursor = 'default';    
        cmd=false;
        shift=false;
        imgToCode.render();
    }
    window.addEventListener("resize",()=>{
        imgToCode.update();
        imgToCode.render();
    })
    //
    // keyboardJS.bind('ctrl + a', function(e) {
    //     e.preventDefault();
    // })
};
