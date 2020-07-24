import ImageSprite from "./sprite_image.js";
import RectSprite from "./sprite_rect.js";
import eventTarget from "./eventTarget.js";
import MouseEvent from "./mouseEvent.js";
import KeyBoardEvent from "./KeyBoardEvent.js";
import { Grid, Guidewires } from "./SpriteGraph.js";
import SpritesController from "./spritesController.js";
export class Stage extends eventTarget {
    /**
     * 构造
     */
    constructor(config) {
        super();
        //初始化舞台
        this.init(config);
    }
    /**
     * 初始化
     */
    init(config) {
        config = config || {};
        this.isNextFrame = null;
        this.spriteList = [];
        this.scale = 1;
        this.devicePixelRatio = Math.floor(window.devicePixelRatio || 2);
        this.x = 0;
        this.y = 0;
        this.width = config.width * this.devicePixelRatio || 400;
        this.height = config.height * this.devicePixelRatio || 300;
        this.backgroundColor = config.backgroundColor || "rgba(0,0,0,0)";
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resize(this.width, this.height);
        //初始化网格线
        this.initGrid();
        //初始化引导线
        this.initGuidewires(); //引导线条
        //初始化鼠标事件
        this.initMouseEvent();
        //初始化键盘快捷
        this.keyBoardEvent = new KeyBoardEvent(this);
        //初始化精灵控制器
        this.spritesController = new SpritesController({ app: this });
        //绘制
        this.render();
    }
    /**
     * 初始化MouseEvent
     */
    initMouseEvent() {
        this.mouseEvent = new MouseEvent({
            element: this.canvas,
            app: this
        });
        this.mouseEvent.handler("mixMouseEvent", () => {
            if (this.mouseEvent.eventType == "mousedown") {
                //选择精灵
                this.mousedownSprite();
            }
            else if (this.mouseEvent.eventType == "mousemove") {
                this.updataGuidewires();
                //drag精灵
                this.activeSprite && this.dragActiveSprite(this.activeSprite, this.mouseEvent.moveLogicVector);
            }
            else if (this.mouseEvent.eventType == "mouseup") {
                //释放精灵
                this.releaseSprite();
            }
            //拖动stage
            if (this.keyBoardEvent.pressSpace && this.mouseEvent.leftDown && this.mouseEvent.isMoving) {
                this.x += this.mouseEvent.moveLogicVector.x;
                this.y += this.mouseEvent.moveLogicVector.y;
                this.render();
            }
        });
        this.mouseEvent.handler("click", () => {
            this.clickSprite();
        });
    }
    /**
     * drag精灵
     */
    dragActiveSprite(activeSprite, moveVector) {
        if (activeSprite.useDrag && !this.keyBoardEvent.pressSpace) {
            activeSprite.x += moveVector.x;
            activeSprite.y += moveVector.y;
            this.activeSprite.trigger("dragging");
            this.render();
        }
    }
    /**
     * 释放精灵
     */
    releaseSprite() {
        this.activeSprite = null;
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
        this.scale += scaleVal;
        this.scale = this.scale < .1 ? .1 : this.scale;
        this.scale = this.scale > 10 ? 10 : this.scale;
        // this.spritesController.setAllSpriteScale(this.scale);
        this.render();
    }
    //初始化网格
    initGrid() {
        this.grid = new Grid({ x: 0,
            y: 0,
            app: this,
            gap: 100
        });
        this.grid.index = -1000000;
        this.grid.type = "tool";
        this.grid.allowClick = false;
        return this.addSprite(this.grid);
    }
    //添加引导线
    initGuidewires() {
        this.guidewires = new Guidewires({
            x: 0,
            y: 0,
            app: this
        });
        this.guidewires.allowClick = false;
        this.guidewires.index = 1000000;
        this.guidewires.type = "tool";
        return this.addSprite(this.guidewires);
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
            //清空画布
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        else {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
    /**
     * 添加图片精灵
     */
    addImageSprite(imagePath, config) {
        let sprite = new ImageSprite(imagePath, config);
        sprite.handler("imgLoaded", () => {
            this.trigger("addSprite");
            this.render();
        });
        return this.addSprite(sprite);
    }
    /**
     * 添加RectSprite精灵
     */
    addRectSprite(config) {
        let sprite = new RectSprite(config);
        return this.addSprite(sprite);
    }
    /**
     * 添加普通精灵
     */
    addSprite(sprite) {
        this.spriteList.push(sprite);
        sprite.parent = this;
        this.render();
        return sprite;
    }
    /**
     * 获取精灵byid
     */
    getSpriteById(id) {
        let sprite = this.spritesController.getSpriteById(id);
        console.dir(sprite);
        this.render();
    }
    /**
     * 获取精灵byname
     */
    getSpriteByName(name) {
        let sprites = this.spritesController.getSpriteById(name);
        console.dir(sprites);
        this.render();
    }
    /**
     * 移除精灵
     */
    removeSprite(sprite) {
        let res = this.spritesController.removeSprite(sprite);
        console.log(res);
    }
    /**
     * mousedown精灵
     */
    mousedownSprite() {
        let pos = this.mouseEvent.curLogicPos;
        let sprite = this.spritesController.getSpriteByPoint(this.ctx, {
            x: pos.x + this.x,
            y: pos.y + this.y
        });
        this.activeSprite = sprite;
        // this.activeSprite && this.activeSprite.trigger("mousedown")
        this.render();
    }
    /**
     * click精灵
     */
    clickSprite() {
        let pos = this.mouseEvent.curLogicPos;
        let sprite = this.spritesController.getSpriteByPoint(this.ctx, {
            x: pos.x,
            y: pos.y
        });
        console.log(pos);
        sprite && console.dir(sprite);
        this.render();
    }
    /**
     * 渲染舞台内容
     */
    render() {
        this.isNextFrame && cancelAnimationFrame(this.isNextFrame);
        this.isNextFrame = requestAnimationFrame(() => {
            //绘制背景
            this.drawBackground();
            //排序
            this.spriteList.sort((a, b) => {
                return a.zindex - b.zindex;
            });
            //绘制
            this.spriteList.forEach(sprite => {
                //计算定位
                // sprite.calculateRelativePosition();
                // sprite.x+=this.x;
                // sprite.y+=this.y;
                sprite.visible && sprite.draw(this.ctx);
                // sprite.x-=this.x;
                // sprite.y-=this.y;
            });
        });
    }
}
//# sourceMappingURL=stage.js.map