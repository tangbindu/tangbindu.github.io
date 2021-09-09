/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-09 21:11:38
 * @FilePath: /draw/src/ts/stage.ts
 * @Description:
 */
// 精灵
import Sprite from './sprite/sprite.js';
import Stage from './stage/stage.js';
// import ImageSprite from './sprite/Image-sprite.js';
// import RectSprite from './sprite/rect-sprite.js';
// import SelectRectSprite from './sprite/select-rect-sprite.js';
// import EventBus from './tools/event-target.js';
// import { mouseEvent } from './mouse-event/mouse-event.js';
// import KeyBoardEvent from './keyboard-event/key-board-event.js';
// 历史
// import { rememberStage } from './history/activity-history.js';
import {
  grid,
  // guideWire,
  // SpritesController,
} from './director/director.js';
// import {
//   DragFile,
//   pasteImage,
// } from './file/file.js';

// 层级约定
// image 0-10000;
// rect  10000-20000;
// control  20000-30000;
export class Drawboard {
  // 全部精灵
  public sprites: Sprite[];
  // 全部精灵
  public stage: Stage;
  // 网格
  public grid: Sprite;
  constructor() {
    // 初始化舞台
    this.init();
  }
  /**
   * 初始化
   */
  init() {
    // 精灵
    this.sprites = [];
    // stage
    this.stage = new Stage({});
    // 初始化网格线
    this.grid = grid(this.stage);
  }
}
