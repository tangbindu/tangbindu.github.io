import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class Graph extends Sprite{
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
        this.font = '10px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
        // this.active=false;
    }
    //更新点
    updatePoints(pos) {
    }
    //绘制图形精灵
    draw(ctx,ratio,scale,coordinateOrigin) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        this.drawPath(ctx,ratio,scale,coordinateOrigin);
        this.fill(ctx);
        this.stroke(ctx,ratio,scale,coordinateOrigin);
        this.drawText(ctx,ratio,scale,coordinateOrigin);
        ctx.restore();
    }
    //绘制文本
    drawText(ctx,ratio,scale,coordinateOrigin){
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        let loc=this.x+","+this.y;
        let size=this.w+"x"+this.h
        let center=tools.getCenterFromRect(this);
        let fontSizeRatio=(this.points[1].x-this.points[0].x+44)/750;
        ctx.font = Math.min(ratio*10*scale,ratio*10*fontSizeRatio*scale)+'px STHeiti, SimHei';
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        ctx.fillText(
            loc, 
            (this.points[0].x+5)*scale+coordinateOrigin.x, 
            (this.points[0].y+5)*scale+coordinateOrigin.y
        );
        ctx.font = ratio*30*fontSizeRatio*scale+'px STHeiti, SimHei';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillText(
            size, 
            center.x*scale+coordinateOrigin.x, 
            center.y*scale+coordinateOrigin.y
        );
    }
    //填充
    fill(ctx){
        if(this.active){
            this.fillStyle = 'rgba(255,128,0,0.2)';
        }else{
            this.fillStyle = 'rgba(0,255,0,0.2)';
        }
    }
    //描边
    stroke(ctx,scale,coordinateOrigin){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
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
    //创建代码
    createCode() {
    }
    //重写move
    move(vector){
        this.points.map((item)=>{
            item.x+=vector[0];
            item.y+=vector[1];
        })
        this.x=this.points[0].x;
        this.y=this.points[0].y;
    }
}
/**
* 矩形
*/
class Rect extends Graph {
    constructor(pos) {
        super(pos);
        this.points = [pos, pos, pos, pos];
        this.name = 'rect';
    }
    updatePoints(pos) {
        this.posEnd = pos;
        const x1 = this.posStart.x,
            y1 = this.posStart.y,
            x2 = this.posEnd.x,
            y2 = this.posEnd.y;
        this.w=Math.abs(x2-x1);
        this.h=Math.abs(y2-y1);
        this.points[0] = {
            x: x1,
            y: y1
        };
        this.points[1] = {
            x: x2,
            y: y1
        };
        this.points[2] = {
            x: x2,
            y: y2
        };
        this.points[3] = {
            x: x1,
            y: y2
        };
        tools.resetRectPoint(this);
        this.x=this.points[0].x;
        this.y=this.points[0].y;
    }
    stroke(ctx,scale,coordinateOrigin){
        return;
        ctx.beginPath();
        let points=tools.scaleRectPoint(this.points,.5);
        points.forEach((p, i) => {
            let px=p.x;
            let py=p.y;
            ctx[i == 0 ? 'moveTo' : 'lineTo']((px)*scale+coordinateOrigin.x-.5, (py)*scale+coordinateOrigin.y-.5);
        });
        ctx.closePath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
    drawPath(ctx,ratio,scale,coordinateOrigin) {
        ctx.beginPath();
        this.points.forEach((p, i) => {
            ctx[i == 0 ? 'moveTo' : 'lineTo']((p.x)*scale+coordinateOrigin.x-.5, (p.y)*scale+coordinateOrigin.y-.5);
        });
        ctx.closePath();
        this.isFill && ctx.fill();
    }
}
export {Graph,Rect};