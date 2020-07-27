import ImageSprite from "./sprite_image.js";
import RectSprite from "./sprite_rect.js";
import eventTarget from "./eventTarget.js";
import MouseEvent from "./mouseEvent.js";
import KeyBoardEvent from "./KeyBoardEvent.js";
import drawGraph from "./drawGraph.js";
import editGraph from "./editGraph.js";
import { Grid, Guidewires } from "./SpriteGraph.js";
import SpritesController from "./spritesController.js";
import DragFile from "./dragFile.js";
//层级约定
//image 0-10000;
//rect  10000-20000;
//control  20000-30000;
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
        this.scale = 1;
        this.devicePixelRatio = Math.floor(window.devicePixelRatio || 2);
        this.x = 0;
        this.y = 0;
        this.width = config.width * this.devicePixelRatio || 400;
        this.height = config.height * this.devicePixelRatio || 300;
        this.backgroundColor = config.backgroundColor || "rgba(0,0,0,0)";
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.workMode = "draw";
        //尺寸
        this.resize(this.width, this.height);
        //初始化精灵控制器
        this.spritesController = new SpritesController({ app: this });
        //初始化网格线
        this.initGrid();
        //初始化引导线
        this.initGuidewires(); //引导线条
        //初始化鼠标事件
        this.initMouseEvent();
        //初始化键盘快捷
        this.keyBoardEvent = new KeyBoardEvent(this);
        //初始化拖拽文件
        this.initDragFile();
        //executeMode
        this.executeMode(this.workMode);
        //绘制
        this.render();
    }
    /**
     * initDragFile
     */
    initDragFile() {
        this.dragFile = new DragFile();
        this.dragFile.handler("files", (data) => {
            let pos = this.mouseEvent.curLogicPos;
            //假定data为img
            let imgSprite = this.addImageSprite(data, {
                x: pos.x,
                y: pos.y,
                zindex: 0,
                width: data.width,
                height: data.height,
                useDrag: true
            });
            imgSprite.handler("imgLoaded", () => {
                let width = 0;
                this.spritesController.getSpriteByName("image").forEach(img => {
                    width += (img.width * 1.01);
                });
                imgSprite.x += (width - imgSprite.width);
            });
        });
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
            //拖动stage
            if (this.keyBoardEvent.pressSpace && this.mouseEvent.leftDown && this.mouseEvent.isMoving) {
                this.x += this.mouseEvent.moveLogicVector.x;
                this.y += this.mouseEvent.moveLogicVector.y;
            }
            switch (this.workMode) {
                case "draw":
                    drawGraph(this);
                    break;
                case "edit":
                    editGraph(this);
                    break;
            }
            this.render();
        });
        this.mouseEvent.handler("click", () => {
        });
        this.mouseEvent.handler("resize", () => {
            this.resize(this.canvas.parentNode.clientWidth * this.devicePixelRatio, this.canvas.parentNode.clientHeight * this.devicePixelRatio);
        });
    }
    /**
     * drag精灵
     */
    dragActiveSprite(activeSprites, moveVector) {
        activeSprites.forEach(sprite => {
            if (sprite.useDrag && !this.keyBoardEvent.pressSpace) {
                sprite.x += moveVector.x;
                sprite.y += moveVector.y;
            }
        });
        this.render();
    }
    //模式
    executeMode(mode) {
        switch (mode) {
            case "draw":
                this.drawMode();
                break;
            case "edit":
                this.editMode();
                break;
        }
        this.render();
        this.workMode = mode;
    }
    //绘图模式
    drawMode() {
        //显示鼠标标线
        this.guidewires.visible = true;
        this.canvas.style.cursor = 'crosshair';
    }
    //编辑模式
    editMode() {
        //隐藏鼠标标线
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
        let lastCurLogicPosX = this.mouseEvent.curLogicPos.x;
        let lastCurLogicPosY = this.mouseEvent.curLogicPos.y;
        this.scale += scaleVal;
        this.scale = this.scale < .1 ? .1 : this.scale;
        this.scale = this.scale > 20 ? 20 : this.scale;
        this.mouseEvent.refresh();
        let newCurLogicPosX = this.mouseEvent.curLogicPos.x;
        let newCurLogicPosY = this.mouseEvent.curLogicPos.y;
        //新坐标
        this.x += (newCurLogicPosX - lastCurLogicPosX);
        this.y += (newCurLogicPosY - lastCurLogicPosY);
        this.render();
    }
    //初始化网格
    initGrid() {
        this.grid = new Grid({
            x: 0,
            y: 0,
            zindex: 30000,
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
            zindex: 30000,
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
        this.spritesController.addSprite(sprite);
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
     * 渲染舞台内容
     */
    render() {
        this.isNextFrame && cancelAnimationFrame(this.isNextFrame);
        this.isNextFrame = requestAnimationFrame(() => {
            //绘制背景
            this.drawBackground();
            //排序
            this.spritesController.sprites.sort((a, b) => {
                return a.zindex - b.zindex;
            });
            //绘制
            this.spritesController.sprites.forEach(sprite => {
                //计算定位
                // sprite.calculateRelativePosition();
                sprite.visible && sprite.draw(this.ctx);
            });
        });
    }
}
//# sourceMappingURL=stage.js.map