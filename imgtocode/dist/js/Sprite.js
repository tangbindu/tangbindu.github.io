import tools from "./tools.js";
// 绘图 
class Sprite {
    //构造
    constructor(pos) {
        this.type=null;
        this.id=null;
        this.className=[];
        this.style=null;
        this.x = pos.x;
        this.y = pos.y;
        this.w=0;
        this.h=0;
        this.index=100;
        this.active=false;
    }
    //移动
    move(vector){
        this.x+=vector[0];
        this.y+=vector[1];
    }
}
export default Sprite;