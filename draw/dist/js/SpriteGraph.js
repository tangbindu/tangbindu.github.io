/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 20:15:11
 * @FilePath: /draw/src/ts/spriteGraph.ts
 * @Description:
 */
import tools from "./tools.js";
import Sprite from "./sprite.js";
// 绘图 
class Graph extends Sprite {
    constructor(pos) {
        super(pos);
        this.name = null; //绘图的名字 rect line grid等
        this.points = []; //绘图的点
        this.posStart = pos; //起始点
        this.posEnd = pos; //结束点
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,0.5)';
        this.fillStyle = 'rgba(0,255,0,0.1)';
        this.font = '12px Helvetica Neue, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
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
    drawPath(ctx) {
    }
    //填充
    fill(ctx) {
        if (this.active) {
            this.fillStyle = 'rgba(255,128,60,0.1)';
        }
        else {
            this.fillStyle = 'rgba(0,255,0,0.1)';
        }
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }
    //描边
    stroke(ctx) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
    //绘制文本
    drawText(ctx) {
    }
    //判断点击
    isInPath(ctx, pos) {
        return false;
    }
    //创建代码
    createCode() {
    }
    //重写move
    move(vector) {
        this.points.map((item) => {
            item.x += vector[0];
            item.y += vector[1];
        });
        this.x = this.points[0].x;
        this.y = this.points[0].y;
    }
}
/**
* Guidewires
*/
class Guidewires extends Graph {
    constructor(config) {
        super(config);
        this.app = config.app;
        let pos = { x: this.x, y: this.y };
        this.points = [pos, pos, pos, pos];
        this.id = 'app_guidewires';
    }
    draw(ctx) {
        let scale = this.getScale();
        let getPosition = this.getPosition();
        //竖
        ctx.save();
        ctx.fillStyle = 'rgba(0,255,0,.5)';
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(getPosition.x * scale + Math.max(scale, 1.0)), tools.toDrawVal(0));
        ctx.lineTo(tools.toDrawVal(getPosition.x * scale + Math.max(scale, 1.0)), tools.toDrawVal(this.app.height));
        ctx.lineTo(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(this.app.height));
        ctx.closePath();
        ctx.fill();
        //横
        ctx.beginPath();
        ctx.moveTo(tools.toDrawVal(0), tools.toDrawVal(getPosition.y * scale));
        ctx.lineTo(tools.toDrawVal(0), tools.toDrawVal(getPosition.y * scale + Math.max(scale, 1.0)));
        ctx.lineTo(tools.toDrawVal(this.app.width), tools.toDrawVal(getPosition.y * scale + Math.max(scale, 1.0)));
        ctx.lineTo(tools.toDrawVal(this.app.width), tools.toDrawVal(getPosition.y * scale));
        ctx.closePath();
        ctx.fill();
        //相对坐标
        const fontSize = 12;
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.font = fontSize * window.devicePixelRatio + 'px Helvetica Neue, SimHei';
        // const text = "("+tools.toInt(getPosition.x-this.app.x+1) + ", " + tools.toInt(getPosition.y-this.app.y+1)+")";
        const text = "(" + (this.app.mouseEvent.curLogicPos.x) + ", " + (this.app.mouseEvent.curLogicPos.y) + ")";
        ctx.fillText(text, Math.min(getPosition.x * scale + fontSize * window.devicePixelRatio, this.app.width - text.length * fontSize * window.devicePixelRatio / 2) - 10, Math.max(getPosition.y * scale - 10, fontSize * window.devicePixelRatio));
        ctx.restore();
    }
}
/**
* 网格
*/
class Grid extends Graph {
    constructor(config) {
        super(config);
        this.app = config.app;
        let pos = { x: this.x, y: this.y };
        this.points = [pos, pos, pos, pos];
        this.id = 'app_grid';
        this.gap = config.gap || 10;
    }
    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 1; //线条粗细
        ctx.strokeStyle = "rgba(255,255,255,.25)"; //线条颜色
        ctx.font = '20px Helvetica Neue, SimHei'; //字体
        ctx.fillStyle = 'rgba(255,255,255,.25)'; //字体颜色
        //只画可见范围的线条
        let scale = this.getScale();
        let getPosition = this.getPosition();
        let sx = getPosition.x % this.gap;
        let sy = getPosition.y % this.gap;
        let gap = this.gap * scale;
        //横轴
        let y = 0;
        ctx.textBaseline = 'top'; //上下对准线条
        ctx.textAlign = "left"; //左右对准线条
        while (gap * y < (this.app.height + gap)) {
            ctx.beginPath();
            ctx.moveTo(0, tools.toDrawVal(gap * y + sy * scale));
            ctx.lineTo(this.app.width, tools.toDrawVal(gap * y + sy * scale));
            ctx.stroke();
            ctx.fillText(this.gap * y - (getPosition.y - sy), 0, gap * y + sy * scale);
            ++y;
        }
        //纵轴
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        let x = 0;
        while (gap * x < (this.app.width + gap)) {
            ctx.beginPath();
            ctx.moveTo(tools.toDrawVal(gap * x + sx * scale), 0);
            ctx.lineTo(tools.toDrawVal(gap * x + sx * scale), this.app.height);
            ctx.stroke();
            ctx.fillText(this.gap * x - (getPosition.x - sx), gap * x + sx * scale, 0);
            ++x;
        }
        ctx.restore();
    }
}
export { Grid, Guidewires };
//# sourceMappingURL=SpriteGraph.js.map