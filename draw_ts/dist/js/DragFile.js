import eventTarget from "./eventTarget.js";
//event
class DragFile extends eventTarget {
    constructor(app) {
        super();
        this.app = app;
        this.init();
    }
    init() {
        let app = this.app;
        //拖拽上传文件
        window.document.addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("drop", function (e) {
            handleFile(e.dataTransfer.files);
            //获取一张图片
            function handleFile(files) {
                var i = 0;
                var reader = new FileReader();
                function readerFiles(i) {
                    var file = files[i];
                    if (i == files.length) {
                        return false;
                    }
                    reader.onload = (function (theFile) {
                        var imgData = theFile.srcElement.result;
                        //这里接受图片
                        const img = new Image();
                        img.onload = () => {
                            app.uploadImage = {
                                img: img,
                                name: file.name
                            };
                        };
                        img.src = imgData;
                    });
                    reader.readAsDataURL(file);
                }
                readerFiles(i);
            }
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }
}
export default DragFile;
//# sourceMappingURL=DragFile.js.map