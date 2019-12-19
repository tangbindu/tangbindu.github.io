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
    function drawShapes(event){
        if (imgToCode.drawShapeType == "rect") {
            let newShape = new Rect(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
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
    }
    window.addEventListener("mousedown", (event) => {
        let startPoint={};
        let endPoint={};
        let mousedown=(event)=>{
            startPoint=endPoint={
                x:event.clientX,
                y:event.clientY
            }
        }
        let mousemove=(event)=>{
            endPoint={
                x:event.clientX,
                y:event.clientY
            }
        }
        let mouseup=(event)=>{
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
        }
        // switch(imgToCode.workMode){
        //     case "draw" : {
        //         drawShapes(event);
        //         break
        //     }
        //     case "edit" : {
        //         editShapes(event);
        //         break
        //     }
        // }
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
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
            } else if (event.keyCode == 86){
                imgToCode.workMode="edit"
            }else if (event.keyCode == 77){
                imgToCode.workMode="draw"
            }
        } else {

        }
    }


//
// keyboardJS.bind('ctrl + a', function(e) {
//     e.preventDefault();
// })
};
