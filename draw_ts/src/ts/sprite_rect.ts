import Sprite from "./sprite.js";
import tools from "./tools.js";
// 绘图 
class RectSprite extends Sprite{
    constructor(config) {
        super(config);
        this.config=config || {};
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#6346ff';
        // ctx.fillStyle = 'rgba(0,233,0,.1)';
        // ctx.shadowBlur=3;
        // ctx.shadowColor="rgba(0,0,0,.3)";
        // ctx.setLineDash([10, 10])
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        let scale=this.getScale();
        ctx.strokeRect(
            tools.toDrawVal(this.x*scale),
            tools.toDrawVal(this.y*scale),
            tools.toDrawVal(this.width*scale),
            tools.toDrawVal(this.height*scale)
        );
        ctx.restore();
    }
    //点击
    isInPath(ctx,pos) {
        ctx.save();
        ctx.beginPath();
        let scale=this.getScale();
        ctx.rect(
            this.x*scale,
            this.y*scale,
            this.width*scale,
            this.height*scale
        );
        ctx.closePath();
        ctx.restore();
        if(ctx.isPointInPath(pos.x, pos.y)){
            return true;
        }else{
            return false
        }
    }
}

export default RectSprite;