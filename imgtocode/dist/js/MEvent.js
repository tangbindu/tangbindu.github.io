import tools from "./tools.js";
//event
class MEvent{
    constructor(ele){
        this.ele=ele;
        this.startPos=null;//开始point
        this.prevPos=null;//上一个point
        this.curPos=null;//当前point
        this.moveVector=null;//vector
        this.totalMoveVector=null;//总移动vector
        this._toNextFrame=null;
        this.isMoving=false;
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
    }
    event(fun){
        this.eventList.push(fun);
    }
    run(type){
        this.type=type;
        if(this.startPos && this.prevPos){
            this.moveVector=[
                this.curPos.x-this.prevPos.x,
                this.curPos.y-this.prevPos.y
            ];
            this.totalMoveVector=[
                this.curPos.x-this.startPos.x,
                this.curPos.y-this.startPos.y
            ];
        }
        // if(this.type=="move"){
        //     this._toNextFrame  && cancelAnimationFrame(this._toNextFrame);
        //     this._toNextFrame=requestAnimationFrame(()=>{
        //         this.eventList.map((item)=>{
        //             item.call(this)
        //         })
        //         this._toNextFrame=false;
        //     })
        // }else{
            this.eventList.map((item)=>{
                item.call(this)
            })
        // }
    }
    mousedown(event){
        this.isMoving=true;
        this.curPos={x:event.clientX,y:event.clientY};
        this.startPos=this.curPos;
        this.prevPos = this.curPos;
        this.run("down")
    }
    mousemove(event){
        this.curPos={x:event.clientX,y:event.clientY};
        this.run("move")
        this.prevPos=this.curPos;
        event.preventDefault();
    }
    mouseup(event){
        this.isMoving=false;
        this.curPos={x:event.clientX,y:event.clientY};
        this.run("up");
        this.startPos=null;
        this.prevPos=null;
        event.preventDefault();
    }
}
export default MEvent;