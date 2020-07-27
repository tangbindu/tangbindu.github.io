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
        let scale=this.getScale();
        let getPosition=this.getPosition();
        ctx.lineWidth = Math.max(scale,1);
        ctx.strokeStyle = '#6346ff';
        // ctx.fillStyle = 'rgba(0,233,0,.1)';
        // ctx.shadowBlur=3;
        // ctx.shadowColor="rgba(0,0,0,.3)";
        // ctx.setLineDash([10, 10])
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        this.active && this.setActiveStyle(ctx);
        ctx.strokeRect(
            tools.toDrawVal(getPosition.x*scale),
            tools.toDrawVal(getPosition.y*scale),
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
        let getPosition=this.getPosition();
        ctx.rect(
            getPosition.x*scale,
            getPosition.y*scale,
            this.width*scale,
            this.height*scale
        );
        ctx.closePath();
        ctx.restore();
        if(ctx.isPointInPath(pos.x*scale, pos.y*scale)){
            return true;
        }else{
            return false
        }
    }
    //setActiveStyle
    setActiveStyle(ctx){
        ctx.strokeStyle = '#13F6ff';
    }
}

export default RectSprite;