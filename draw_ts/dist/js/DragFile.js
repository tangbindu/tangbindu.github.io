/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:17:43
 * @FilePath: /draw_ts/src/ts/dragFile.ts
 * @Description:
 */
import EventTarget from "./EventTarget.js";
//event
class DragFile extends EventTarget {
    constructor() {
        super();
        this.init();
    }
    init() {
        //拖拽上传文件
        window.document.addEventListener("dragenter", (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("dragover", (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("drop", (e) => {
            //获取一张图片
            let handleFile = (files) => {
                let i = 0;
                let readerFiles = (file) => {
                    let reader = new FileReader();
                    reader.onload = ((theFile) => {
                        let imgData = theFile.srcElement.result;
                        this.trigger("files", imgData, e);
                    });
                    reader.readAsDataURL(file);
                };
                for (let i = 0; i < files.length; i++) {
                    readerFiles(files[i]);
                }
            };
            handleFile(e.dataTransfer.files);
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }
}
export default DragFile;
//# sourceMappingURL=dragFile.js.map