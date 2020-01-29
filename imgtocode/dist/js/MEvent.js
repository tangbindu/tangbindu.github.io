import tools from "./tools.js";
//event
class MEvent{
    constructor(ele){
        this.ele=ele;
        this.curPos=null;
        this.startPos=null;//开始point
        this.prevPos=null;//上一个point
        this.endPos=null;//结束point
        this.moveVector=null;//vector
        this.totalMoveVector=null;//总移动vector
        this._toNextFrame=null;
        //事件列表
        this.eventList=[];
        this.type=null;
        const move=(event)=>{
            this.mousemove(event)
        }
        const up=(event)=>{
            this.mouseup(event);
            this.ele.removeEventListener("mousemove",move)
            this.ele.removeEventListener("mouseup",up)
        }
        this.ele.addEventListener("mousedown",(event)=>{
            this.mousedown(event)
            this.ele.addEventListener("mousemove",move)
            this.ele.addEventListener("mouseup",up)
        })
    }
    event(fun){
        this.eventList.push(fun);
    }
    run(type){
        this.type=type;
        if(this.type=="move" || this.type=="up"){
            this.moveVector=[
                this.endPos.x-this.prevPos.x,
                this.endPos.y-this.prevPos.y
            ];
            this.totalMoveVector=[
                this.endPos.x-this.startPos.x,
                this.endPos.y-this.startPos.y
            ];
        };
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
        this.startPos=tools.getEventRealPos(event);
        this.curPos=this.startPos;
        this.prevPos = this.startPos;
        this.run("down")
    }
    mousemove(event){
        this.endPos=tools.getEventRealPos(event);
        this.curPos=this.endPos;
        this.run("move")
        this.prevPos=this.endPos;
        event.preventDefault();
    }
    mouseup(event){
        this.endPos=tools.getEventRealPos(event);
        this.curPos=this.endPos;
        this.run("up")
        event.preventDefault();
    }
}
export default MEvent;