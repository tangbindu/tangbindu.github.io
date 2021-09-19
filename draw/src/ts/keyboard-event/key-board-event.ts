/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-08 00:07:39
 * @FilePath: /draw/src/ts/key-board-event.ts
 * @Description:
 */
import EventBus from '../tools/event-target.js';
import tools from '../tools/tools.js';

// event
class KeyBoardEvent extends EventBus {
  app: any;
  pressCmd: boolean;
  pressShift: boolean;
  pressSpace: boolean;
  constructor(app) {
    super();
    this.app = app;
    this.pressCmd = false;
    this.pressShift = false;
    this.pressSpace = false;
    this.init();
  }
  init() {
    const { app } = this;
    document.onkeydown = (event) => {
      if (/Mac/.test(navigator.platform)) {
        if (this.pressCmd && event.keyCode === 65) {
          // 全选 ctrl+a
          app.spritesController.selectAll();
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 68) {
          // 全部取消选择  ctrl+s
          app.spritesController.cancelSelect();
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 67) {
          // 复制
          app.spritesController.copyActiveSprites();
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 86) {
          // 粘贴
          // app.spritesController.pasteActiveSprites();
          // event.preventDefault();
        // 组合adjustSize
        } else if (this.pressCmd && event.keyCode === 37) {
          // left37
          // app.spritesController.moveSprites({x:-1,y:0})
          app.spritesController.adjustSpritesSize({ width: tools.toInt(tools.expandValue(-1)), height: 0 });
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 39) {
          // right39
          app.spritesController.adjustSpritesSize({ width: tools.toInt(tools.expandValue(1)), height: 0 });
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 38) {
          // top38
          // app.spritesController.moveSprites({x:0,y:-1})
          app.spritesController.adjustSpritesSize({ width: 0, height: tools.toInt(tools.expandValue(-1)) });
          event.preventDefault();
        } else if (this.pressCmd && event.keyCode === 40) {
          // bottom40
          app.spritesController.adjustSpritesSize({ width: 0, height: tools.toInt(tools.expandValue(1)) });
          event.preventDefault();
        // 组合adjustSize
        } else if (this.pressCmd && event.keyCode === 80) {
          // ctrl+p
          app.spritesController.packSprites();
          event.preventDefault();
        } else if (event.keyCode === 221) {
          // 放大
          app.setScale(5 / 120);
          event.preventDefault();
        } else if (event.keyCode === 219) {
          // 缩小
          app.setScale(-5 / 120);
          event.preventDefault();
        } else if (event.keyCode === 77) {
          // draw mode m
          app.executeMode('draw');
          event.preventDefault();
        } else if (event.keyCode === 86) {
          // edit mode v
          app.executeMode('edit');
        } else if (event.keyCode === 8) {
          // 删除
          app.spritesController.deleteSprites();
        } else if (event.keyCode === 16) {
          // shift
          this.pressShift = true;
          event.preventDefault();
        } else if (event.keyCode === 37) {
          // left37
          app.spritesController.moveSprites({ x: tools.toInt(tools.expandValue(-1)), y: 0 });
        } else if (event.keyCode === 39) {
          // right39
          app.spritesController.moveSprites({ x: tools.toInt(tools.expandValue(1)), y: 0 });
        } else if (event.keyCode === 38) {
          // top38
          app.spritesController.moveSprites({ x: 0, y: tools.toInt(tools.expandValue(-1)) });
        } else if (event.keyCode === 40) {
          // bottom40
          app.spritesController.moveSprites({ x: 0, y: tools.toInt(tools.expandValue(1)) });
        } else if (event.keyCode === 91) {
          // command
          this.pressCmd = true;
          event.preventDefault();
        } else if (event.keyCode === 57) {
          // 布局
        } else if (event.keyCode === 32) {
          // 移动
          this.pressSpace = true;
          app.canvas.style.cursor = 'move';
        } else {
          // console.dir(event.keyCode)
        }
      } else {
      }
      // onkeydown render
      app.render();
    };
    document.onkeyup = () => {
      this.trigger('keyup');
      app.canvas.style.cursor = 'default';
      this.pressCmd = false;
      this.pressShift = false;
      this.pressSpace = false;
      // onkeyup render
      app.render();
    };
  }
}
export default KeyBoardEvent;


// adjustSize
