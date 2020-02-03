import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class Image extends Sprite{
    constructor(pos) {
        super(pos)
        this.name = null;//绘图的名字 rect line等
        this.points = [];//绘图的点
        this.posStart = pos;//起始点
        this.posEnd = pos;//结束点
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,0.5)';
        this.fillStyle = 'rgba(0,255,0,0.2)';
        this.font = '12px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
        // this.active=false;
    }
    //更新点
    updatePoints(pos) {
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        this.drawPath(ctx);
        this.fill(ctx);
        this.stroke(ctx);
        this.drawText(ctx);
        ctx.restore();
    }
    //绘制路径
    drawPath(){
        this.isFill && this.fill(ctx);
    }
    //判断点击
    isInPath(ctx,pos) {
        if(ctx.isPointInPath(pos.x, pos.y)){
            this.active=true;
            return true;
        }
    }
}

export {Image};