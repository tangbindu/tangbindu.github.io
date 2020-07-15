import tools from "./tools.js";
import ImageSprite from "./sprite_image.js"
import RectSprite from "./sprite_rect.js"
import eventTarget from "./eventTarget.js"
import MouseEvent from "./mouseEvent.js"
import KeyBoardEvent from "./KeyBoardEvent.js"
import Sprite from "./sprite.js";
import {Grid,Guidewires} from "./SpriteGraph.js";
import SpritesController from "./spritesController.js"
export class Stage extends eventTarget{
    //指canvas组件
    canvas : any;
    //绘图上下文
    ctx : any;
    //stage的width
    width : number;
    //stage的高
    height : number;
    //ratio
    devicePixelRatio: number;
    //scale
    scale: number;
    //render内容列表
    spriteList : Array<Sprite>;
    //鼠标事件
    mouseEvent : any;
    //键盘事件 
    keyBoardEvent: any;
    //引导线
    guidewires: Sprite;
    //网格
    grid: Sprite;
    //精灵控制器
    spritesController:SpritesController;
    //active sprite 
    activeSprite : Sprite;
    //backgroundColor
    backgroundColor : string;
    //isNextFrame
    isNextFrame: any;
    //coordinateOrigin
    coordinateOrigin: any;
    /**
     * 构造
     */
    constructor(config){
        super();
        //初始化舞台
        this.init(config);
    }
    /**
     * 初始化
     */
    init(config){
        config = config || {};
        this.isNextFrame=null;
        this.spriteList=[];
        this.scale=1;
        this.devicePixelRatio=Math.floor(window.devicePixelRatio || 2);
        this.width=config.width*this.devicePixelRatio || 400;
        this.height=config.height*this.devicePixelRatio || 300;
        this.coordinateOrigin={x:0,y:0};//坐标轴原点
        this.backgroundColor=config.backgroundColor || "rgba(0,0,0,0)";
        this.canvas=document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resize(this.width,this.height);
        //初始化网格线
        this.initGrid();
        //初始化引导线
        this.initGuidewires();//引导线条
        //初始化鼠标事件
        this.initMouseEvent();
        //初始化键盘快捷
        this.keyBoardEvent = new KeyBoardEvent(this);
        //初始化精灵控制器
        this.spritesController=new SpritesController(this.spriteList)
        //绘制
        this.render();
    }
    /**
     * 初始化MouseEvent
     */
    initMouseEvent(){
        this.mouseEvent=new MouseEvent({
            element:this.canvas,
            app:this
        });
        this.mouseEvent.handler("mixMouseEvent",()=>{
            if(this.mouseEvent.eventType=="mousedown"){
                //选择精灵
                this.mousedownSprite();
            }else if(this.mouseEvent.eventType=="mousemove"){
                this.updataGuidewires();
                //drag精灵
                this.activeSprite && this.dragActiveSprite(this.activeSprite,this.mouseEvent.moveLogicVector);
            }else if(this.mouseEvent.eventType=="mouseup"){
                //释放精灵
                this.releaseSprite();
            }
            //拖动stage
            if (this.keyBoardEvent.pressSpace && this.mouseEvent.leftDown && this.mouseEvent.isMoving) {
                this.coordinateOrigin.x+=this.mouseEvent.moveLogicVector.x;
                this.coordinateOrigin.y+=this.mouseEvent.moveLogicVector.y;
                this.render();
            }
        })
        this.mouseEvent.handler("click",()=>{
            this.clickSprite();
        })
    }
    /**
     * drag精灵
     */
    dragActiveSprite(activeSprite,moveVector){
        if(activeSprite.useDrag && !this.keyBoardEvent.pressSpace){
            activeSprite.x+=moveVector.x
            activeSprite.y+=moveVector.y
            this.activeSprite.trigger("dragging")
            this.render();
        }
    }
    /**
     * 释放精灵
     */
    releaseSprite(){
        this.activeSprite=null;
    }
    /**
     * 重置尺寸
     * @param {node} container 
     * @param {number} ratio 
     */
    resize(width,height){
        this.width=width;
        this.height=height;
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        this.render();
    }
    /**
     * 缩放app
     * @param scaleVal 
     */
    setScale(scaleVal){
        this.scale+=scaleVal;
        this.spritesController.setAllSpriteScale(this.scale);
        this.render();
    }
    //初始化网格
    initGrid(){
        this.grid = new Grid({x:0,
            y:0,
            app:this,
            gap:100
        });
        this.grid.index=-1000000;
        this.grid.type="tool";
        this.grid.allowClick=false;
        this.spriteList.push(this.grid);
    }
    //添加引导线
    initGuidewires(){
        this.guidewires = new Guidewires({
            x:0,
            y:0,
            app:this
        });
        this.guidewires.allowClick=false;
        this.guidewires.index=1000000;
        this.guidewires.type="tool";
        this.spriteList.push(this.guidewires);
    }
    /**
     * 更新引导线
     */
    updataGuidewires(){
        this.guidewires.x=this.mouseEvent.curLogicPos.x;
        this.guidewires.y=this.mouseEvent.curLogicPos.y;
        this.render()
    }
    /**
     * 填充颜色
     * @param {color} color 
     */
    setBackgroundColor(color){
        this.backgroundColor=color;
    }
    /**
     * 绘制背景颜色
     */
    drawBackground(){
        if(this.backgroundColor){
            //清空画布
            this.ctx.clearRect( 0, 0, this.width, this.height);
            this.ctx.fillStyle=this.backgroundColor;
            this.ctx.fillRect(0,0,this.width,this.height);
        }else{
            this.ctx.clearRect( 0, 0, this.width, this.height);
        }
    }
    /**
     * 添加图片精灵
     */
    addImageSprite(imagePath,config){
        let sprite=new ImageSprite(imagePath,config);
        this.spriteList.push(sprite)
        sprite.handler("imgLoaded",()=>{
            this.trigger("addSprite");
            this.render();
        })
        return sprite;
    }
    /**
     * 添加RectSprite精灵
     */
    addRectSprite(config){
        let sprite=new RectSprite(config);
        this.spriteList.push(sprite)
        this.render();
        return sprite;
    }

    /**
     * 添加普通精灵
     */
    addSprite(sprite){
        this.spriteList.push(sprite)
        return sprite;
    }
    /**
     * 获取精灵byid
     */
    getSpriteById(id){
        let sprite=this.spritesController.getSpriteById(id);
        console.dir(sprite)
        this.render();
    }
    /**
     * 获取精灵byname
     */
    getSpriteByName(name){
        let sprites=this.spritesController.getSpriteById(name);
        console.dir(sprites)
        this.render();
    }
    /**
     * 移除精灵
     */
    removeSprite(sprite){
        let res=this.spritesController.removeSprite(sprite);
        console.log(res)
    }
    /**
     * mousedown精灵
     */
    mousedownSprite(){
        let pos=this.mouseEvent.currentCanvasPos;
        console.log(pos.x,this.coordinateOrigin.x)
        let sprite=this.spritesController.getSpriteByPoint(this.ctx,{
            x:pos.x+this.coordinateOrigin.x,
            y:pos.y+this.coordinateOrigin.y
        });
        this.activeSprite=sprite
        console.dir(sprite)
        // this.activeSprite && this.activeSprite.trigger("mousedown")
        this.render();
    }
    /**
     * click精灵
     */
    clickSprite(){
        let pos=this.mouseEvent.currentCanvasPos;
        let sprite=this.spritesController.getSpriteByPoint(this.ctx,{
            x:pos.x+this.coordinateOrigin.x,
            y:pos.y+this.coordinateOrigin.y
        });
        console.dir(sprite)
        this.render();
    }
    /**
     * 渲染舞台内容
     */
    render(){
        this.isNextFrame && cancelAnimationFrame(this.isNextFrame);
        this.isNextFrame=requestAnimationFrame(()=>{
            //绘制背景
            this.drawBackground();
            //排序
            this.spriteList.sort((a,b)=>{
                return a.zindex-b.zindex;
            })

            //绘制
            this.spriteList.forEach(sprite=>{
                //计算定位
                sprite.calculateRelativePosition();
                sprite.x+=this.coordinateOrigin.x;
                sprite.y+=this.coordinateOrigin.y;
                sprite.visible && sprite.draw(this.ctx);
                sprite.x-=this.coordinateOrigin.x;
                sprite.y-=this.coordinateOrigin.y;
            })
        })
    }
}