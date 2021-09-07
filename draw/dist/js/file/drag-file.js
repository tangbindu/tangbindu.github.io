/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-08 00:07:37
 * @FilePath: /draw/src/ts/drag-file.ts
 * @Description:
 */
import EventTarget from '../tools/event-target.js';
// event
class DragFile extends EventTarget {
    constructor() {
        super();
        this.init();
    }
    init() {
        // 拖拽上传文件
        window.document.addEventListener('dragenter', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener('drop', (e) => {
            // 获取一张图片
            const handleFile = (files) => {
                const readerFiles = (file) => {
                    const reader = new FileReader();
                    reader.onload = (() => {
                        const imgData = reader.result;
                        this.trigger('files', imgData, e);
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
//# sourceMappingURL=drag-file.js.map