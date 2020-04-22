import tools from "./tools.js";
import Sprite from "./Sprite.js";
// 绘图 
class Graph extends Sprite{
    constructor(pos) {
        super(pos)
        this.name = null;//绘图的名字 rect line grid等
        this.points = [];//绘图的点
        this.posStart = pos;//起始点
        this.posEnd = pos;//结束点
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,0.5)';
        this.fillStyle = 'rgba(0,255,0,0.1)';
        this.font = '12px Helvetica Neue, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
    }
    //更新点
    updatePoints(pos) {
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        this.drawPath(ctx);
        this.stroke(ctx);
        this.fill(ctx);
        this.drawText(ctx);
        ctx.restore();
    }
    //绘制路径
    drawPath(){
       
    } 
    //填充
    fill(ctx){
        if(this.active){
            this.fillStyle = 'rgba(255,128,60,0.1)';
        }else{
            this.fillStyle = 'rgba(0,255,0,0.1)';
        }
        ctx.fillStyle=this.fillStyle;
        ctx.fill();
    }
    //描边
    stroke(ctx){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
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
* Guidewires
*/
class Guidewires extends Graph{
    constructor(pos,viewX,viewY,app) {
        super(pos);
        this.app=app;
        this.points = [pos, pos, pos, pos];
        this.id = 'app_guidewires';
        this.viewX=viewX;
        this.viewY=viewY;
    }
    draw(ctx){
        //竖
        ctx.save();
        ctx.fillStyle = 'rgba(0,255,0,.7)';
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(this.x*this.scale), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(this.x*this.scale+Math.max(this.scale,1.0)), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(this.x*this.scale+Math.max(this.scale,1.0)), tools.toDrawVal(this.app.stageHeight));
        ctx.lineTo(tools.toDrawVal(this.x*this.scale), tools.toDrawVal(this.app.stageHeight));
        ctx.closePath();
        ctx.fill();
        //横
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(0), tools.toDrawVal(this.y*this.scale));
        ctx.lineTo(tools.toDrawVal(0), tools.toDrawVal(this.y*this.scale+Math.max(this.scale,1.0)));
        ctx.lineTo(tools.toDrawVal(this.app.stageWidth), tools.toDrawVal(this.y*this.scale+Math.max(this.scale,1.0)));
        ctx.lineTo(tools.toDrawVal(this.app.stageWidth), tools.toDrawVal(this.y*this.scale));
        ctx.closePath();
        ctx.fill();
        //相对坐标
        const fontSize = 12;
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.font = fontSize*window.devicePixelRatio + 'px Helvetica Neue, SimHei';
        const text = "("+this.viewX + ", " + this.viewY+")";
        ctx.fillText(
            text,
            Math.min(
                this.x*this.scale + fontSize*window.devicePixelRatio,
                this.app.stageWidth - text.length * fontSize*window.devicePixelRatio/2
            ) - 10,
            Math.max(this.y*this.scale - 10, fontSize*window.devicePixelRatio));
        ctx.restore();
    }
}
/**
* 网格
*/
class Grid extends Graph{
    constructor(pos,app) {
        super(pos);
        this.app=app;
        this.points = [pos, pos, pos, pos];
        this.id = 'app_grid';
    }
    draw(ctx){
        ctx.save();
        ctx.lineWidth = 1;//线条粗细
        ctx.strokeStyle = "rgba(255,255,255,.1)";//线条颜色
        ctx.font = '18px Helvetica Neue, SimHei';//字体
        ctx.fillStyle = 'rgba(255,255,255,.4)';//字体颜色
        //只画可见范围的线条
        let sx=this.x%this.gap;
        let sy=this.y%this.gap;
        let gap=this.gap*this.scale;
        //横轴
        let y = 0;
        ctx.textBaseline = 'top';//上下对准线条
        ctx.textAlign = "left";//左右对准线条
        while (gap * y < this.app.stageHeight) {
            ctx.beginPath();
            ctx.moveTo(0, tools.toDrawVal(gap * y+sy*this.scale));
            ctx.lineTo(this.app.stageWidth, tools.toDrawVal(gap * y+sy*this.scale));
            ctx.stroke();
            ctx.fillText(
                this.gap * y-(this.y-sy), 
                0, 
                gap * y+sy*this.scale
            );
            ++y;
        }
        //纵轴
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        let x = 0;
        while (gap * x < (this.app.stageWidth+gap)) {
            ctx.beginPath();
            ctx.moveTo(tools.toDrawVal(gap * x+sx*this.scale), 0);
            ctx.lineTo(tools.toDrawVal(gap * x+sx*this.scale), this.app.stageHeight);
            ctx.stroke();
            ctx.fillText(
                this.gap * x-(this.x-sx), 
                gap * x+sx*this.scale, 
                0
            );
            ++x;
        }
        ctx.restore();
    }
}
export {Grid,Guidewires};