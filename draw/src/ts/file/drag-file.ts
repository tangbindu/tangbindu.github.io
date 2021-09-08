/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-09 00:51:33
 * @FilePath: /draw/src/ts/drag-file.ts
 * @Description:
 */
import EventTarget from '../tools/event-target.js';

// event
class DragFile extends EventTarget {
  constructor(stage) {
    super();
    this.handler('files', (data) => {
      // 假定data为img
      const imgSprite = stage.addImageSprite(data, {
        x: stage.mouseEvent.curLogicPos.x,
        y: stage.mouseEvent.curLogicPos.y,
        zindex: 0,
        width: data.width,
        height: data.height,
        useDrag: true,
      });
      imgSprite.handler('imgLoaded', () => {
        let width = 0;
        stage.spritesController.getSpriteByName('image').forEach((img) => {
          width += (img.width * 1.01);
        });
        imgSprite.x += (width - imgSprite.width);
      });
    });
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
        for (let i = 0;i < files.length;i++) {
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
