import tools from "./tools.js";
// 绘图 
class Graph {
    constructor(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.w=0;
        this.h=0;
        this.points = [];
        this.posStart = pos;
        this.posEnd = pos;
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,0.5)';
        this.fillStyle = 'rgba(0,255,0,0.2)';
        this.font = tools.ratio*10+'px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
        this.active=false;
    }
    updatePoints(i, pos) {

    }
    draw(ctx,scale,coordinateOrigin) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        this.drawPath(ctx,scale,coordinateOrigin);
        this.fill(ctx);
        this.stroke(ctx,scale,coordinateOrigin);
        this.drawText(ctx,scale,coordinateOrigin);
        ctx.restore();
    }
    drawText(ctx,scale,coordinateOrigin){
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        let loc=this.x+","+this.y;
        let size=this.w+"x"+this.h
        let center=tools.getCenterFromRect(this);
        let fontSizeRatio=(this.points[1].x-this.points[0].x+44)/750;
        ctx.font = Math.min(tools.ratio*10*scale,tools.ratio*10*fontSizeRatio*scale)+'px STHeiti, SimHei';
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        ctx.fillText(
            loc, 
            (this.points[0].x+5)*scale+coordinateOrigin.x, 
            (this.points[0].y+5)*scale+coordinateOrigin.y
        );
        ctx.font = tools.ratio*30*fontSizeRatio*scale+'px STHeiti, SimHei';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillText(
            size, 
            center.x*scale+coordinateOrigin.x, 
            center.y*scale+coordinateOrigin.y
        );
    }
    fill(ctx){
        if(this.active){
            this.fillStyle = 'rgba(255,128,0,0.2)';
        }else{
            this.fillStyle = 'rgba(0,255,0,0.2)';
        }
    }
    stroke(ctx,scale,coordinateOrigin){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
    drawPath(){
        this.isFill && this.fill(ctx);
    }
    isInPath(ctx, pos) {
    }
    drawPoints() {
    }
    createCode() {
    }
    //移动shape
    move(moveVector,includeChildrens){
        tools.movePoints(this.points,moveVector);
        if(includeChildrens &&  this.children){
            this.children.map((item)=>{
                this.moveShape(item,moveVector,includeChildrens);
            })
        }
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
    drawPath(ctx,scale,coordinateOrigin) {
        ctx.beginPath();
        this.points.forEach((p, i) => {
            ctx[i == 0 ? 'moveTo' : 'lineTo']((p.x)*scale+coordinateOrigin.x-.5, (p.y)*scale+coordinateOrigin.y-.5);
        });
        ctx.closePath();
        this.isFill && ctx.fill();
    }
    // fill(ctx){
    //     this.isFill && ctx.fill();
    // }
}
export {Graph,Rect};