import tools from "./tools.js";
export default function(imgToCode){
    //鼠标标线
    let editMode=(event,canvas)=>{
        imgToCode.stageCanvas.style.cursor = 'default';
    }
    window.addEventListener("resize", () => {
        imgToCode.draw();
    })
    window.addEventListener("mousemove", (event) => {
        let point;
        let LogicPoint;
        //处理引导线 start
        point=tools.toPixel(
            {x:event.clientX,y:event.clientY},
            imgToCode.ratio
        );
        LogicPoint=tools.toLogicPixel(
            {x:event.clientX,y:event.clientY},
            imgToCode.ratio,
            imgToCode.scale,
            imgToCode.coordinateOrigin
        );
        imgToCode.guidewires.x=point.x;
        imgToCode.guidewires.y=point.y;
        imgToCode.guidewires.viewX=LogicPoint.x;
        imgToCode.guidewires.viewY=LogicPoint.y;
        // 处理引导线 end
        switch(imgToCode.workMode){
            case "draw":
                imgToCode.guidewires.visible=true
            break;
            case "edit":
                imgToCode.guidewires.visible=false
            break;
        }
        // imgToCode.draw();
    })
    window.addEventListener("mouseup", ()=>{
        // imgToCode.draw();
    });
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
                        imgToCode.designImage={
                            src:img,
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

    document.onkeydown = function (event) {
        if (/Mac/.test(navigator.platform)) {
            if (event.keyCode == 187) {
                //+ 放大
                imgToCode.scale*=(1+5/75);
                event.preventDefault();
            } else if (event.keyCode == 189) {
                //- 缩小
                imgToCode.scale*=(1-5/75);
                event.preventDefault();
            }else if (event.keyCode == 77){
                //m
                imgToCode.workMode="draw"
                event.preventDefault();
            }else if (event.keyCode == 86){
                //v
                imgToCode.workMode="edit"
                event.preventDefault();
            }
        } else {

        }
    }


//
// keyboardJS.bind('ctrl + a', function(e) {
//     e.preventDefault();
// })
};
