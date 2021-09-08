/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-09 01:27:16
 * @FilePath: /draw/src/ts/stage.ts
 * @Description:
 */
import ImageSprite from './sprite/Image-sprite.js';
import RectSprite from './sprite/rect-sprite.js';
import SelectRectSprite from './sprite/select-rect-sprite.js';
import EventTarget from './tools/event-target.js';
import {mouseEvent} from './mouse-event/mouse-event.js';
import KeyBoardEvent from './keyboard-event/key-board-event.js';
import Sprite from './sprite/sprite';
import { grid, guideWire } from './director/director.js';
import { Grid } from './sprite/sprite-graph.js';
import SpritesController from './director/sprites-controller.js';
// import DragFile from './file/drag-file.js';
import {DragFile,pasteImage} from './file/file.js';

// 层级约定
// image 0-10000;
// rect  10000-20000;
// control  20000-30000;
export class Stage extends EventTarget {
  // 指canvas组件
  canvas: any;
  // 绘图上下文
  ctx: any;
  x: number;
  y: number;
  // stage的width
  width: number;
  // stage的高
  height: number;
  // ratio
  devicePixelRatio: number;
  // scale
  scale: number;
  // 鼠标事件
  mouseEvent: any;
  // 键盘事件
  keyBoardEvent: any;
  // dragfile
  dragFile: any;
  // 引导线
  guidewires: Sprite;
  // 网格
  grid: Sprite;
  // 全部精灵
  sprites: Sprite[];
  // 精灵控制器
  spritesController: SpritesController;
  // active sprite
  // activeSprite : Sprite;
  // backgroundColor
  backgroundColor: string;
  // isNextFrame
  isNextFrame: any;
  // workMode
  workMode: string;
  /**
   * 构造
   */
  constructor(config) {
    super();
    // 初始化舞台
    this.init(config);
  }
  /**
   * 初始化
   */
  init(config) {
    config = config || {};
    this.isNextFrame = null;
    this.scale = config.scale || 1;
    this.devicePixelRatio = Math.floor(window.devicePixelRatio || 2);
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || document.body.clientWidth * this.devicePixelRatio;
    this.height = config.height || document.body.clientHeight * this.devicePixelRatio;
    this.backgroundColor = config.backgroundColor || '#2c3448';
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.workMode = config.workMode || 'draw';
    // 尺寸
    this.resize(this.width, this.height);
    // 精灵
    this.sprites = [];
    // 初始化精灵控制器
    this.spritesController = new SpritesController(this);
    // 初始化网格线
    this.grid=grid(this);
    // 初始化引导线
    this.guidewires = guideWire(this);
    // 初始化鼠标事件
    this.mouseEvent = mouseEvent(this);
    // this.initMouseEvent();
    // 初始化键盘快捷
    this.keyBoardEvent = new KeyBoardEvent(this);
    // 初始化拖拽文件
    // this.initDragFile();
    this.dragFile=new DragFile(this)
    // 粘贴的图片
    pasteImage(this);
    // executeMode
    this.executeMode(this.workMode);
    // 绘制
    this.render();
  }
  /**
   * moveSprites 精灵
   */
  moveSprites(sprites, moveVector) {
    // 整数移动
    sprites.forEach((sprite) => {
      if (sprite.useDrag) {
        sprite.move(moveVector);
      }
    });
    this.render();
  }
  // 模式
  executeMode(mode) {
    switch (mode) {
      case 'draw':
        this.drawMode();
        break;
      case 'edit':
        this.editMode();
        break;
    }
    this.render();
    this.workMode = mode;
  }
  // 绘图模式
  drawMode() {
    this.spritesController.releaseActiveSprites();
    // 显示鼠标标线
    this.guidewires.visible = true;
    this.canvas.style.cursor = 'crosshair';
  }
  // 编辑模式
  editMode() {
    // 隐藏鼠标标线
    this.guidewires.visible = false;
    this.canvas.style.cursor = 'default';
  }
  /**
   * 重置尺寸
   * @param {node} container
   * @param {number} ratio
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.render();
  }
  /**
   * 缩放app
   * @param scaleVal
   */
  setScale(scaleVal) {
    this.mouseEvent.refresh();
    const lastCurLogicPosX = this.mouseEvent.curLogicPos.x;
    const lastCurLogicPosY = this.mouseEvent.curLogicPos.y;
    this.scale += scaleVal;
    this.scale = this.scale < .1 ? .1 : this.scale;
    this.scale = this.scale > 20 ? 20 : this.scale;
    this.mouseEvent.refresh();
    const newCurLogicPosX = this.mouseEvent.curLogicPos.x;
    const newCurLogicPosY = this.mouseEvent.curLogicPos.y;
    // 新坐标
    this.x += (newCurLogicPosX - lastCurLogicPosX);
    this.y += (newCurLogicPosY - lastCurLogicPosY);
    this.render();
  }
  /**
   * 更新引导线
   */
  updataGuidewires() {
    this.guidewires.x = this.mouseEvent.curLogicPos.x;
    this.guidewires.y = this.mouseEvent.curLogicPos.y;
    this.render();
  }
  /**
   * 填充颜色
   * @param {color} color
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
  }
  /**
   * 绘制背景颜色
   */
  drawBackground() {
    if (this.backgroundColor) {
      // 清空画布
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
  /**
   * 添加图片精灵
   */
  addImageSprite(imagePath, config) {
    const sprite = new ImageSprite(imagePath, config);
    sprite.handler('imgLoaded', () => {
      this.trigger('addSprite');
      this.render();
    });
    return this.addSprite(sprite);
  }
  /**
   * 添加RectSprite精灵
   */
  addRectSprite(config) {
    const sprite = new RectSprite(config);
    return this.addSprite(sprite);
  }
  /**
   * 添加selectSprite精灵
   */
  addSelectRectSprite(config) {
    const sprite = new SelectRectSprite(config);
    return this.addSprite(sprite);
  }
  /**
   * 添加普通精灵
   */
  addSprite(sprite) {
    this.spritesController.addSprite(sprite);
    sprite.parent = this;
    this.render();
    return sprite;
  }
  /**
   * 获取精灵byid
   */
  getSpriteById(id) {
    const sprite = this.spritesController.getSpriteById(id);
    this.render();
  }
  /**
   * 获取精灵byname
   */
  getSpriteByName(name) {
    const sprites = this.spritesController.getSpriteByName(name);
    this.render();
  }
  /**
   * 移除精灵
   */
  removeSprite(sprite) {
    const res = this.spritesController.removeSprite(sprite);
  }
  /**
   * 渲染舞台内容
   */
  render() {
    this.isNextFrame && cancelAnimationFrame(this.isNextFrame);
    this.isNextFrame = requestAnimationFrame(() => {
      let count=0;
      // 绘制背景
      this.drawBackground();
      // 排序
      this.spritesController.sprites.sort((a, b) => a.zindex - b.zindex);

      // 绘制
      this.spritesController.sprites.forEach((sprite) => {
        // 计算定位
        // sprite.calculateRelativePosition();
        sprite.visible && sprite.draw(this.ctx);
        if(sprite.visible){
          count++;
        }
      });
      document.title=`draw:${count}`;
    });
  }
}
