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
        this.font = '12px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
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
    //绘制文本
    drawText(ctx){
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        let loc=this.x+","+this.y;
        let size=this.width+"x"+this.height
        let center=tools.getCenterFromRect(this);
        let fontSize=Math.min(
            (this.points[1].x-this.points[0].x)*.15,
            (this.points[3].y-this.points[1].y)*.8
        );
        ctx.font = 10*window.devicePixelRatio+'px STHeiti, SimHei';
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        ctx.fillText(
            loc, 
            (this.points[0].x*this.scale+this.translate.x*this.scale+5), 
            (this.points[0].y*this.scale+this.translate.y*this.scale+5)
        );
        ctx.font = fontSize*this.scale+'px STHeiti, SimHei';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillText(
            size, 
            center.x*this.scale+this.translate.x*this.scale, 
            center.y*this.scale+this.translate.y*this.scale
        );
    }
    //填充
    fill(ctx){
        if(this.active){
            this.fillStyle = 'rgba(255,128,60,0.2)';
        }else{
            this.fillStyle = 'rgba(0,255,0,0.2)';
        }
    }
    //描边
    stroke(ctx){
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
* 网格
*/
class Guidewires extends Graph{
    constructor(pos,viewX,viewY) {
        super(pos);
        this.points = [pos, pos, pos, pos];
        this.id = 'app_guidewires';
        this.viewX=viewX;
        this.viewY=viewY;
    }
    draw(ctx){
        //是否可绘制
        if(!this.visible){
            return;
        }
        const x=this.x;
        const y=this.y;
        const viewX=tools.toInt(this.viewX);
        const viewY=tools.toInt(this.viewY);
        const text = "("+viewX + ", " + viewY+")";
        const fontSize = 12;
        //竖
        ctx.save();
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(x), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(x+1), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(x+1), tools.toDrawVal(this.height));
        ctx.lineTo(tools.toDrawVal(x), tools.toDrawVal(this.height));
        ctx.closePath();
        ctx.fill();
        //横
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(0), tools.toDrawVal(y));
        ctx.lineTo(tools.toDrawVal(0), tools.toDrawVal(y+1));
        ctx.lineTo(tools.toDrawVal(this.width), tools.toDrawVal(y+1));
        ctx.lineTo(tools.toDrawVal(this.width), tools.toDrawVal(y));
        ctx.closePath();
        ctx.fill();
        //相对坐标
        ctx.font = fontSize*window.devicePixelRatio + 'px STHeiti, SimHei';
        ctx.fillText(
            text,
            Math.min(
                x + fontSize*window.devicePixelRatio,
                this.width - text.length * fontSize*window.devicePixelRatio/2
            ) - 10,
            Math.max(y - 10, fontSize*window.devicePixelRatio));
        ctx.restore();
    }
}
/**
* 网格
*/
class Grid extends Graph{
    constructor(pos) {
        super(pos);
        this.points = [pos, pos, pos, pos];
        this.id = 'app_grid';
    }
    draw(ctx){
        //是否可绘制
        if(!this.visible){
            return;
        }
        ctx.save();
        let gap=tools.toInt(this.gap*this.scale);
        let width=this.width;
        let height=this.height;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,.2)";
        let y = 0;
        while (gap * y < height) {
            ctx.beginPath();
            ctx.moveTo(0, tools.toDrawVal(gap * y));
            ctx.lineTo(width, tools.toDrawVal(gap * y));
            ctx.stroke();
            ++y;
        }
        let x = 0;
        while (gap * x < width) {
            ctx.beginPath();
            ctx.moveTo(tools.toDrawVal(gap * x), 0);
            ctx.lineTo(tools.toDrawVal(gap * x), height);
            ctx.stroke();
            x++;
        }
        ctx.restore();
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
        this.width=Math.abs(x2-x1);
        this.height=Math.abs(y2-y1);
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
    stroke(ctx){
        return;
        ctx.beginPath();
        let points=tools.scaleRectPoint(this.points,.5);
        points.forEach((p, i) => {
            let px=p.x;
            let py=p.y;
            ctx[i == 0 ? 'moveTo' : 'lineTo'](px-.5,py-.5);
        });
        ctx.closePath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
    drawPath(ctx) {
        ctx.beginPath();
        let x,y;
        this.points.forEach((p, i) => { 
            x=tools.toDrawVal((p.x+this.translate.x)*this.scale);
            y=tools.toDrawVal((p.y+this.translate.y)*this.scale);
            ctx[i == 0 ? 'moveTo' : 'lineTo'](x,y);
        });
        ctx.closePath();
        this.isFill && ctx.fill();
    }
}

export {Rect,Grid,Guidewires};