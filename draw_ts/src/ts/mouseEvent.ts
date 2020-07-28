import tools from "./tools.js";
import eventTarget from "./eventTarget.js";

function getVertexPosition(el) {
    let currentTarget = el
    let top = 0
    let left = 0
    while (currentTarget !== null) {
        top += currentTarget.offsetTop
        left += currentTarget.offsetLeft
        currentTarget = currentTarget.offsetParent
    }
    return { top, left }
}

export interface vec2 {
    x: number;
    y: number;
}
export interface point {
    x: number;
    y: number;
}

//event
class MouseEvent extends eventTarget{
    //元素
    element : any;
    //通用
    startPos : point;//开始point
    previousPos : point;//上一个point
    currentPos : point;//{x:0,y:0};//当前point
    currentCanvasPos: point;// 当前canvas位置，也是真实像素位置了
    moveVector : vec2;//[0,0];//vector
    moveLogicVector : vec2;//[0,0];//vector
    totalMoveVector : vec2;// [0,0];//总移动vector
    totalLogicMoveVector : vec2;// [0,0];//总逻辑移动vector
    eventType : string;
    isMoving : boolean;
    leftDown : boolean;
    //时间
    _mousedownTime : any;
    _mouseupTime : any;
    offsetTop: number;
    app: any;
    curLogicPos: point; //逻辑像素
    /**
     * 构造
     * @param {html node} element
     */
    constructor(config){
        super();
        //元素
        this.element=config.element;
        //app
        this.app=config.app;
        //通用
        this.startPos=null;//开始point
        this.previousPos=null;//上一个point
        this.currentPos={x:0,y:0};//当前point
        this.currentCanvasPos={x:0,y:0};//当前point
        this.moveVector={x:0,y:0};//vector
        this.totalMoveVector={x:0,y:0};//总移动vector
        this.moveLogicVector={x:0,y:0};//logic vector
        this.totalLogicMoveVector={x:0,y:0};//总逻辑移动vector
        this.eventType=null;
        this.isMoving=false;
        this.leftDown=false;
        //时间
        this._mousedownTime=null;
        this._mouseupTime=null;
        //初始化
        this.init();
        //
        this.offsetTop=0;
    }
    /**
     * init
     */
    init(){
        //常规鼠标事件
        this.element.addEventListener("mousedown",(event)=>{
            this.eventType="mousedown";
            this.mousedown(event)
        })
        this.element.addEventListener("mousemove",(event)=>{
            this.eventType="mousemove"
            this.mousemove(event)
        })
        this.element.addEventListener("mouseup",(event)=>{
            this.eventType="mouseup"
            this.mouseup(event);
        })
        //滚轮
        document.body.onmousewheel = (event)=>{
            if(event.deltaY>0){
                //放大
                this.app.setScale(event.deltaY/1200);
            }else{
                //缩小
                this.app.setScale(event.deltaY/1200);
            }
        };
        //鼠标引起的尺寸变化
        window.addEventListener("resize",()=>{
            this.trigger("resize");
        })
        
    }
    /**
     * 工具方法，转换clientX到canvas pixel
     */
    toCanvasPixel(pos){
        return {
            x:pos.x/this.element.clientWidth*this.element.width,
            y:pos.y/this.element.clientHeight*this.element.height
        }
    }
    /**
     * mousedown
     */
    mousedown(event){
        this.offsetTop=getVertexPosition(this.element).top;
        this.currentPos={
            x:event.clientX,
            y:event.clientY-this.offsetTop
        };
        // this.currentPos=this.toCanvasPixel(this.currentPos);
        this.startPos=this.currentPos;
        this.previousPos = this.currentPos;
        this.trigger("mousedown");
        this.detailMixEvent("mousedown");
    }
    /**
     * mousemove
     */
    mousemove(event){
        this.currentPos={
            x:event.clientX,
            y:event.clientY-this.offsetTop
        };
        // this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("mousemove");
        this.detailMixEvent("mousemove");
        this.previousPos=this.currentPos;
    }
    /**
     * mouseup
     */
    mouseup(event){
        this.trigger("mouseup");
        this.detailMixEvent("mouseup");
        this.startPos=null;
        this.previousPos=null;
        this.currentPos=null;
        event.preventDefault();
    }
    /**
     * 处理混合情况
     */
    detailMixEvent(type){
        if(type=="mousedown"){
            this.isMoving=false;
            this._mousedownTime=new Date().getTime();
            this.leftDown=true;
        }else if(type=="mousemove"){
            this.isMoving=true;
            if(this.previousPos){
                this.moveVector={
                    x:this.currentPos.x-this.previousPos.x,
                    y:this.currentPos.y-this.previousPos.y
                };
            }
            if(this.startPos){
                this.totalMoveVector={
                    x:this.currentPos.x-this.startPos.x,
                    y:this.currentPos.y-this.startPos.y
                };
            }
        }else if( type=="mouseup"){
            this._mouseupTime=new Date().getTime();
            if((this._mouseupTime-this._mousedownTime)<400 && !this.isMoving){
                // this.eventType="click"
                this.trigger("click")
            }
            this.isMoving=false;
            this.leftDown=false;
        }
        this.currentCanvasPos=tools.toPixel(
            this.currentPos,
            this.app.devicePixelRatio
        )
        this.curLogicPos=tools.toLogicPixel(
            this.currentPos,
            this.app.devicePixelRatio,
            this.app.scale,
            this.app.x,
            this.app.y
        );
        this.moveLogicVector=tools.toLogicVector(
            this.moveVector,
            this.app.devicePixelRatio,
            this.app.scale
        )
        this.totalLogicMoveVector=tools.toLogicVector(
            this.totalMoveVector,
            this.app.devicePixelRatio,
            this.app.scale
        )
        this.trigger("mixMouseEvent");
    }
    refresh(){
        this.curLogicPos=tools.toLogicPixel(
            this.currentPos,
            this.app.devicePixelRatio,
            this.app.scale,
            this.app.x,
            this.app.y
        );
        this.startPos=this.currentPos;
        this.previousPos = this.currentPos;
    }
}
export default MouseEvent;