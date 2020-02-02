import tools from "./tools.js";
export default function(imgToCode){
    window.addEventListener("resize", () => {
        imgToCode.resize();
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
