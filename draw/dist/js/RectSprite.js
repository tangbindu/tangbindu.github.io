/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 20:14:53
 * @FilePath: /draw/src/ts/RectSprite.ts
 * @Description:
 */
import Sprite from "./sprite.js";
import tools from "./tools.js";
// 绘图 
class RectSprite extends Sprite {
    constructor(config) {
        super(config);
        this.config = config || {};
        //draw config
        this.type = "RectSprite", //等于类名字
            this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,0.5)';
        this.fillStyle = 'rgba(0,0,0,.25)';
        this.activeFillStyle = 'rgba(0,90,90,.6)';
        this.font = '12px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        let scale = this.getScale();
        let getPosition = this.getPosition();
        ctx.lineWidth = Math.max(scale, 1);
        // ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        this.active && this.setActiveStyle(ctx);
        ctx.fillRect(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(getPosition.y * scale), tools.toDrawVal(this.width * scale), tools.toDrawVal(this.height * scale));
        // ctx.strokeRect(
        //     tools.toDrawVal(getPosition.x*scale),
        //     tools.toDrawVal(getPosition.y*scale),
        //     tools.toDrawVal(this.width*scale),
        //     tools.toDrawVal(this.height*scale)
        // );
        this.drawText(ctx, scale, getPosition);
        ctx.restore();
    }
    //绘制文本
    drawText(ctx, scale, getPosition) {
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        let center = tools.getCenterFromRect(this, scale);
        let fontSize = Math.min(this.width * .15, this.height * .8);
        ctx.font = Math.min(10 * window.devicePixelRatio, fontSize * scale) + 'px STHeiti, SimHei';
        ctx.textBaseline = 'top';
        ctx.textAlign = "left";
        ctx.fillText(tools.toInt(this.x) + "," + tools.toInt(this.y), getPosition.x * scale + 4, getPosition.y * scale + 4);
        ctx.font = fontSize * scale + 'px STHeiti, SimHei';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillText(tools.toInt(this.width) + "x" + tools.toInt(this.height), getPosition.x * scale + center.x, getPosition.y * scale + center.y);
    }
    //点击
    isInPath(ctx, pos) {
        ctx.save();
        ctx.beginPath();
        let scale = this.getScale();
        let getPosition = this.getPosition();
        ctx.rect(getPosition.x * scale, getPosition.y * scale, this.width * scale, this.height * scale);
        ctx.closePath();
        ctx.restore();
        if (ctx.isPointInPath(pos.x * scale, pos.y * scale)) {
            return true;
        }
        else {
            return false;
        }
    }
    //setActiveStyle
    setActiveStyle(ctx) {
        ctx.fillStyle = this.activeFillStyle;
    }
}
export default RectSprite;
//# sourceMappingURL=RectSprite.js.map