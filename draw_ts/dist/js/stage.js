import tools from "./tools.js";
import ImageSprite from "./sprite_image.js";
import RectSprite from "./sprite_rect.js";
import eventTarget from "./eventTarget.js";
import MouseEvent from "./mouseEvent.js";
import { Grid, Guidewires } from "./SpriteGraph.js";
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
        this.devicePixelRatio = Math.floor(window.devicePixelRatio || 2);
        this.width = config.width * this.devicePixelRatio || 400;
        this.height = config.height * this.devicePixelRatio || 300;
        this.coordinateOrigin = { x: 0, y: 0 }; //坐标轴原点
        this.backgroundColor = config.backgroundColor || "rgba(0,0,0,0)";
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resize(this.width, this.height);
        this.initGrid(); //网格
        this.initGuidewires(); //引导线条
        //initMouseEvent
        this.initMouseEvent(this.canvas);
        this.render();
    }
    /**
     * 初始化MouseEvent
     */
    initMouseEvent(view) {
        this.mouseEvent = new MouseEvent(view);
        this.mouseEvent.handler("mixMouseEvent", () => {
            if (this.mouseEvent.eventType == "mousedown") {
                //选择精灵
                this.touchSprite(this.mouseEvent.currentPos);
            }
            else if (this.mouseEvent.eventType == "mousemove") {
                this.updataGuidewires();
                //drag精灵
                this.activeSprite && this.dragActiveSprite(this.activeSprite, this.mouseEvent.moveVector);
            }
            else if (this.mouseEvent.eventType == "mouseup") {
                //释放精灵
                this.releaseSprite();
            }
        });
        this.mouseEvent.handler("click", () => {
            this.clickSprite(this.mouseEvent.currentPos);
        });
    }
    /**
     * touch精灵
     */
    touchSprite(pos) {
        this.spriteList.forEach(sprite => {
            if (sprite.isInPath(this.ctx, pos) && sprite.allowClick) {
                this.activeSprite = sprite;
            }
        });
        this.activeSprite && this.activeSprite.trigger("mousedown");
        this.render();
    }
    /**
     * click精灵
     */
    clickSprite(pos) {
        let clicksprite = null;
        this.spriteList.forEach(item => {
            if (item.isInPath(this.ctx, pos) && item.allowClick) {
                clicksprite = item;
            }
        });
        clicksprite && clicksprite.trigger("click");
        this.render();
    }
    /**
     * drag精灵
     */
    dragActiveSprite(activeSprite, moveVector) {
        if (activeSprite.useDrag) {
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
    }
    //初始化网格
    initGrid() {
        let grid = new Grid({ x: 0,
            y: 0,
            app: this,
            gap: 100
        });
        grid.index = -1000000;
        grid.type = "tool";
        grid.allowClick = false;
        this.spriteList.push(grid);
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
        this.spriteList.push(this.guidewires);
    }
    //更新
    updataGuidewires() {
        this.guidewires.x = tools.toInt(this.mouseEvent.currentPos.x);
        this.guidewires.y = tools.toInt(this.mouseEvent.currentPos.y);
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
        this.spriteList.push(sprite);
        sprite.handler("imgLoaded", () => {
            this.trigger("addSprite");
            this.render();
        });
        return sprite;
    }
    /**
     * 添加RectSprite精灵
     */
    addRectSprite(config) {
        let sprite = new RectSprite(config);
        this.spriteList.push(sprite);
        this.render();
        return sprite;
    }
    /**
     * 添加普通精灵
     */
    addSprite(sprite) {
        this.spriteList.push(sprite);
        return sprite;
    }
    /**
     * 移除精灵
     */
    removeSprite(sprite) {
        this.spriteList.forEach((item, index) => {
            if (item == sprite) {
                this.spriteList.splice(index, 1);
                this.trigger("removeSprite");
                item.trigger("remove");
                this.render();
                sprite = null;
            }
        });
    }
    /**
     * 获取精灵byid
     */
    getSpriteById(id) {
        return this.spriteList.filter(item => {
            if (item.id == id) {
                return item;
            }
        })[0];
    }
    /**
     * 获取精灵byname
     */
    getSpriteByName(name) {
        return this.spriteList.filter(item => {
            if (item.name == name) {
                return item;
            }
        });
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
                sprite.calculateRelativePosition();
                sprite.visible && sprite.draw(this.ctx);
            });
        });
    }
}
//# sourceMappingURL=stage.js.map