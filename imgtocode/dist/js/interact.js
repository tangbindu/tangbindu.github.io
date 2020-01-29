import tools from "./tools.js";
import {Rect} from "./graph.js";
export default function(imgToCode){
    let drawGuidewires=(event)=>{
        let pos=tools.posEvent(event);
        const clientX = pos.x;
        const clientY = pos.y;
        let viewX=(clientX - imgToCode.coordinateOrigin.x)/imgToCode.scale;
        let viewY=(clientY - imgToCode.coordinateOrigin.y)/imgToCode.scale;
        tools.drawGuidewires(
            imgToCode.stageCanvas,
            imgToCode.stageCTX,
            clientX,
            clientY,
            viewX,
            viewY,
            imgToCode.ratio,
            imgToCode.scale
        )
    }
    let editMode=(event,canvas)=>{
        imgToCode.stageCanvas.style.cursor = 'default';
    }
    window.addEventListener("resize", () => {
        imgToCode.draw();
    })
    window.addEventListener("mousemove", (event) => {
        imgToCode.draw();
        imgToCode.workMode=="draw" && drawGuidewires(event);
        imgToCode.workMode=="edit" && editMode(event);
    })
    window.addEventListener("mouseup", ()=>{
        imgToCode.draw();
    });
    
    // window.addEventListener("mousedown", (event) => {
    //     if(imgToCode.workMode=="draw"){
    //         let startPoint={};
    //         let endPoint={};
    //         startPoint={
    //             x:event.clientX,
    //             y:event.clientY
    //         }
    //         imgToCode.mouseEvent("mousedown",startPoint);
    //         let mousemove=(event)=>{
    //             endPoint={
    //                 x:event.clientX,
    //                 y:event.clientY
    //             }
    //             imgToCode.mouseEvent("mousemove",endPoint);
    //         }
    //         let mouseup=(event)=>{
    //             imgToCode.mouseEvent("mouseup",endPoint);
    //             window.removeEventListener("mousemove", mousemove);
    //             window.removeEventListener("mouseup", mouseup);
    //         }
    //         window.addEventListener("mousemove", mousemove);
    //         window.addEventListener("mouseup", mouseup);
    //     }
    // })
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
                event.preventDefault();
            } else if (event.keyCode == 189) {
                imgToCode.scale*=(1-5/75);
                event.preventDefault();
            } else if (event.keyCode == 86){
                //v
                imgToCode.workMode="edit"
            }else if (event.keyCode == 77){
                //m
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
