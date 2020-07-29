import Sprite from "./Sprite.js";
// 绘图 
class RoundRectSprite extends Sprite {
    constructor(config) {
        super(config);
        this.config = config || {};
        this.radius = this.config.radius || 0;
        this.fillStyle = this.config.fillStyle || "rgba(0,0,0,.5)";
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, Math.PI, Math.PI * 3 / 2);
        ctx.lineTo(this.width - this.radius + this.x, this.y);
        ctx.arc(this.width - this.radius + this.x, this.radius + this.y, this.radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.lineTo(this.width + this.x, this.height + this.y - this.radius);
        ctx.arc(this.width - this.radius + this.x, this.height - this.radius + this.y, this.radius, 0, Math.PI * 1 / 2);
        ctx.lineTo(this.radius + this.x, this.height + this.y);
        ctx.arc(this.radius + this.x, this.height - this.radius + this.y, this.radius, Math.PI * 1 / 2, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    //点击
    isInPath(ctx, pos) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.restore();
        if (ctx.isPointInPath(pos.x, pos.y)) {
            return true;
        }
        else {
            return false;
        }
    }
}
export default RoundRectSprite;
//# sourceMappingURL=RoundRectSprite.js.map