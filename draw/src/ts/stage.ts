/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:58:42
 * @FilePath: /draw/src/ts/stage.ts
 * @Description: 
 */
import tools from "./tools.js";
import ImageSprite from "./ImageSprite.js"
import RectSprite from "./RectSprite.js"
import SelectRectSprite from "./SelectRectSprite.js"
import EventTarget from "./EventTarget.js"
import MouseEvent from "./MouseEvent.js"
import KeyBoardEvent from "./KeyBoardEvent.js"
import Sprite from "./Sprite.js";
import drawGraph from "./drawGraph.js"
import editGraph from "./editGraph.js"
import {Grid,Guidewires} from "./SpriteGraph.js";
import SpritesController from "./SpritesController.js"
import DragFile from "./DragFile.js"

//层级约定
//image 0-10000;
//rect  10000-20000;
//control  20000-30000;
export class Stage extends EventTarget{
  //指canvas组件
  canvas : any;
  //绘图上下文
  ctx : any;
  x: number;
  y: number;
  //stage的width
  width : number;
  //stage的高
  height : number;
  //ratio
  devicePixelRatio: number;
  //scale
  scale: number;
  //鼠标事件
  mouseEvent : any;
  //键盘事件 
  keyBoardEvent: any;
  // dragfile
  dragFile : any;
  //引导线
  guidewires: Sprite;
  //网格
  grid: Sprite;
  //精灵控制器
  spritesController:SpritesController;
  //active sprite 
  // activeSprite : Sprite;
  //backgroundColor
  backgroundColor : string;
  //isNextFrame
  isNextFrame: any;
  //workMode
  workMode: string;
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
    this.scale=config.scale || 1;
    this.devicePixelRatio=Math.floor(window.devicePixelRatio || 2);
    this.x=config.x || 0;
    this.y=config.y || 0;
    this.width=config.width*this.devicePixelRatio || 400;
    this.height=config.height*this.devicePixelRatio || 300;
    this.backgroundColor=config.backgroundColor || "rgba(0,0,0,0)";
    this.canvas=document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.workMode=config.workMode || "draw";
    //尺寸
    this.resize(this.width,this.height);
    //初始化精灵控制器
    this.spritesController=new SpritesController({app:this})
    //初始化网格线
    this.initGrid();
    //初始化引导线
    this.initGuidewires();//引导线条
    //初始化鼠标事件
    this.initMouseEvent();
    //初始化键盘快捷
    this.keyBoardEvent = new KeyBoardEvent(this);
    //初始化拖拽文件
    this.initDragFile();
    // 粘贴的图片
    this.pasteImage();
    //executeMode
    this.executeMode(this.workMode)
    //绘制
    this.render();
  }
  /**
   * initDragFile
   */
  initDragFile(){
    this.dragFile = new DragFile();
    this.dragFile.handler("files",(data,e)=>{
      //假定data为img
      let imgSprite=this.addImageSprite(data,{
        x: this.mouseEvent.curLogicPos.x,
        y: this.mouseEvent.curLogicPos.y,
        zindex:0,
        width:data.width,
        height:data.height,
        useDrag:true
      })
      imgSprite.handler("imgLoaded",()=>{
        let width=0;
        this.spritesController.getSpriteByName("image").forEach(img=>{
          width+=(img.width*1.01);
        })
        imgSprite.x+=(width-imgSprite.width)
      })
    })
  }    
  /**
  * pasteImage
  */
  pasteImage(){
    //查找box元素,检测当粘贴时候,
    document.addEventListener('paste', (e)=> {
      for(let i=0;i<e.clipboardData.items.length;i++){
        //判断是否是粘贴图片
        if (e.clipboardData && e.clipboardData.items[i].type.indexOf('image') > -1) {
          let reader = new FileReader();
          let file = e.clipboardData.items[i].getAsFile();
          reader.onload = ((theFile)=>{
            let imgData = theFile.srcElement.result;
            //假定data为img
            let imgSprite=this.addImageSprite(imgData,{
              x:this.mouseEvent?.curLogicPos?.x || 0,
              y:this.mouseEvent?.curLogicPos?.y || 0,
              zindex:0,
              width:imgData.width,
              height:imgData.height,
              useDrag:true
            })
            imgSprite.handler("imgLoaded",()=>{
              let width=0;
              this.spritesController.getSpriteByName("image").forEach(img=>{
                width+=(img.width+2);
              })
              imgSprite.x+=(width-imgSprite.width)
            })
          })
          reader.readAsDataURL(file);
        } 

      }
    }, false);
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
      //拖动stage
      if (this.keyBoardEvent.pressSpace && this.mouseEvent.leftDown && this.mouseEvent.isMoving) {
        this.x+=this.mouseEvent.moveLogicVector.x;
        this.y+=this.mouseEvent.moveLogicVector.y;
      }
      switch (!this.keyBoardEvent.pressSpace && this.workMode) {
        case "draw":
          drawGraph(this); 
          break;
        case "edit":
          editGraph(this);
          break;
      }
      this.render()
    })
    
    this.mouseEvent.handler("resize",()=>{
      this.resize(
        this.canvas.parentNode.clientWidth*this.devicePixelRatio,
        this.canvas.parentNode.clientHeight*this.devicePixelRatio
      );
    })
  }
  /**
   * moveSprites 精灵
   */
  moveSprites(sprites, moveVector) {
    // 整数移动
    sprites.forEach(sprite => {
      if (sprite.useDrag) {
        sprite.move(moveVector)
      }
    });
    this.render();
  }
  //模式
  executeMode(mode){
    switch (mode) {
      case "draw":
        this.drawMode();
        break;
      case "edit":
        this.editMode();
        break;
    }
    this.render();
    this.workMode=mode;
  }
  //绘图模式
  drawMode() {
    this.spritesController.releaseActiveSprites();
    //显示鼠标标线
    this.guidewires.visible=true;
    this.canvas.style.cursor = 'crosshair';
  }
  //编辑模式
  editMode() {
    //隐藏鼠标标线
    this.guidewires.visible=false;
    this.canvas.style.cursor = 'default';
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
    this.mouseEvent.refresh();
    let lastCurLogicPosX=this.mouseEvent.curLogicPos.x;
    let lastCurLogicPosY=this.mouseEvent.curLogicPos.y;
    this.scale+=scaleVal;
    this.scale=this.scale < .1? .1 : this.scale;
    this.scale=this.scale > 20? 20 : this.scale;
    this.mouseEvent.refresh();
    let newCurLogicPosX=this.mouseEvent.curLogicPos.x;
    let newCurLogicPosY=this.mouseEvent.curLogicPos.y;
    //新坐标
    this.x+=(newCurLogicPosX-lastCurLogicPosX);
    this.y+=(newCurLogicPosY-lastCurLogicPosY);
    this.render();
  }
  //初始化网格
  initGrid(){
    this.grid = new Grid({
      x:0,
      y:0,
      zindex:-30000,
      app:this,
      gap:100
    });
    this.grid.type="app_assist";
    this.grid.allowClick=false;
    return this.addSprite(this.grid);
  }
  //添加引导线
  initGuidewires(){
    this.guidewires = new Guidewires({
      x:0,
      y:0,
      zindex:30000,
      app:this
    });
    this.guidewires.allowClick=false;
    this.guidewires.index=1000000;
    this.guidewires.type="app_assist";
    return this.addSprite(this.guidewires);
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
      this.ctx.clearRect(0, 0, this.width, this.height);
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
    sprite.handler("imgLoaded",()=>{
      this.trigger("addSprite");
      this.render();
    })
    return this.addSprite(sprite);
  }
  /**
   * 添加RectSprite精灵
   */
  addRectSprite(config){
    let sprite=new RectSprite(config);
    return this.addSprite(sprite);
  }
  /**
   * 添加selectSprite精灵
   */
  addSelectRectSprite(config) {
    let sprite = new SelectRectSprite(config);
    return this.addSprite(sprite);
  }
  /**
   * 添加普通精灵
   */
  addSprite(sprite){
    this.spritesController.addSprite(sprite);
    sprite.parent=this;
    this.render();
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
   * 渲染舞台内容
   */
  render(){
    this.isNextFrame && cancelAnimationFrame(this.isNextFrame);
    this.isNextFrame=requestAnimationFrame(()=>{
      //绘制背景
      this.drawBackground();
      //排序
      this.spritesController.sprites.sort((a,b)=>{
        return a.zindex-b.zindex;
      })

      //绘制
      this.spritesController.sprites.forEach(sprite=>{
        //计算定位
        // sprite.calculateRelativePosition();
        sprite.visible && sprite.draw(this.ctx);
      })
    })
  }
}
