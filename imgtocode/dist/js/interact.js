import tools from "./tools.js";
import {Rect} from "./graph.js";
export default function(imgToCode){
    window.addEventListener("resize", () => {
        imgToCode.refresh();
    })
    window.addEventListener("mousemove", (event) => {
        imgToCode.refresh();
        imgToCode.drawGuidewires(tools.posEvent(event))
    })
    window.addEventListener("mouseend", (event) => {
        imgToCode.refresh();
        imgToCode.drawGuidewires(tools.posEvent(event))
    })
    window.addEventListener("mousedown", (event) => {
        let newShape;
        if (imgToCode.drawShapeType == "rect") {
            newShape = new Rect(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
        }else{
            return;
        }
        imgToCode.shapes.push(newShape);
        const drawing = (event) => {
            newShape.updatePoints(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
        }
        const drawEnd = (event) => {
            newShape.updatePoints(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
            window.removeEventListener("mousemove", drawing);
            window.removeEventListener("mouseup", drawEnd);
            if((newShape.points[2].x-newShape.points[0].x)<10 & (newShape.points[2].y-newShape.points[0].y)<10){
                imgToCode.shapes.pop();
            }
        }
        window.addEventListener("mousemove", drawing);
        window.addEventListener("mouseup", drawEnd);
    })
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
                imgToCode.scale*=(1+5/75);
                imgToCode.gap = 100*imgToCode.ratio*imgToCode.scale;
                event.preventDefault();
            } else if (event.keyCode == 189) {
                imgToCode.scale*=(1-5/75);
                imgToCode.gap = 100*imgToCode.ratio*imgToCode.scale;
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
