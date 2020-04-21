import tools from "./tools.js";
import eventTarget from "./eventTarget.js";

//event
class MouseEvent extends eventTarget{
    constructor(ele,ratio,scale,coordinateOrigin){
        super();
        //元素
        this.ele=ele;
        //通用
        this.startPos=null;//开始point
        this.prevPos=null;//上一个point
        this.curPos={x:0,y:0};//当前point
        this.moveVector=null;//vector
        this.totalMoveVector=null;//总移动vector
        // this._toNextFrame=null;
        this.isMoving=false;
        this.downTime=null;
        this.upTime=null;
        //特殊
        this.ratio=ratio || 1;
        this.scale=scale || 1;
        this.coordinateOrigin=coordinateOrigin || {x:0,y:0};
        // this.realPoint=null;
        this.curLogicPos={x:0,y:0};//逻辑像素
        // this.moveLogicVector=null;
        // this.totalMoveLogicVector=null;
        //事件列表
        this.eventList=[];
        this.type=null;
        this.ele.addEventListener("mousedown",(event)=>{
            this.mousedown(event)
        })
        this.ele.addEventListener("mousemove",(event)=>{
            this.mousemove(event)
        })
        this.ele.addEventListener("mouseup",(event)=>{
            this.mouseup(event);
        })
        this.refresh();
    }
    event(fun){
        this.eventList.push(fun);
    }
    refresh(){
        this.curLogicPos=tools.toLogicPixel(
            this.curPos,
            this.ratio,
            this.scale,
            this.coordinateOrigin
        );
        this.startPos=this.curPos;
        this.prevPos = this.curPos;
    }
    run(type){
        this.type=type;
        if(this.startPos && this.prevPos){
            this.moveVector=[
                this.curPos.x-this.prevPos.x,
                this.curPos.y-this.prevPos.y
            ];
            this.moveLogicVector=tools.vectorToPixel(
                this.moveVector,
                this.ratio,
                this.scale
            );
            // this.totalMoveVector=[
            //     this.curPos.x-this.startPos.x,
            //     this.curPos.y-this.startPos.y
            // ];
        }
        this.trigger("all");
    }
    mousedown(event){
        this.downTime=new Date().getTime();
        this.isMoving=true;
        this.curPos={x:event.clientX,y:event.clientY};
        // this.realPoint=tools.toPixel(this.curPos,this.ratio);
        this.curLogicPos=tools.toLogicPixel(
            this.curPos,
            this.ratio,
            this.scale,
            this.coordinateOrigin
        );
        this.startPos=this.curPos;
        this.prevPos = this.curPos;
        this.trigger("down");
        this.run("down");
    }
    mousemove(event){
        this.curPos={x:event.clientX,y:event.clientY};
        // this.realPoint=tools.toPixel(this.curPos,this.ratio);
        this.curLogicPos=tools.toLogicPixel(
            this.curPos,
            this.ratio,
            this.scale,
            this.coordinateOrigin
        );
        this.trigger("move");
        this.run("move");
        this.prevPos=this.curPos;
        event.preventDefault();
    }
    mouseup(event){
        this.curPos={x:event.clientX,y:event.clientY};
        // this.realPoint=tools.toPixel(this.curPos,this.ratio);
        this.curLogicPos=tools.toLogicPixel(
            this.curPos,
            this.ratio,
            this.scale,
            this.coordinateOrigin
        );
        this.trigger("up");
        this.run("up");
        this.upTime=new Date().getTime();
        if(
            (this.upTime-this.downTime)<200 &&
            this.curPos.x==this.startPos.x &&
            this.curPos.y==this.startPos.y
        ){
            this.trigger("click");
        }
        this.startPos=null;
        this.prevPos=null;
        this.isMoving=false;
        event.preventDefault();
    }
}
export default MouseEvent;