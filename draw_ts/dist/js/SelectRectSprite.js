import Sprite from "./Sprite.js";
import tools from "./tools.js";
// 绘图 
class SelectRectSprite extends Sprite {
    constructor(config) {
        super(config);
        this.config = config || {};
        this.fillStyle = 'rgba(0,90,90,.2)';
        //draw config
        this.type = "app_selectRect", //等于类名字
            this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,255,255,0.5)';
    }
    //绘制图形精灵
    draw(ctx) {
        ctx.save();
        let scale = this.getScale();
        let getPosition = this.getPosition();
        ctx.setLineDash([8, 8]);
        ctx.lineWidth = Math.max(scale, 2);
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(getPosition.y * scale), tools.toDrawVal(this.width * scale), tools.toDrawVal(this.height * scale));
        ctx.strokeRect(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(getPosition.y * scale), tools.toDrawVal(this.width * scale), tools.toDrawVal(this.height * scale));
        ctx.restore();
    }
}
export default SelectRectSprite;
//# sourceMappingURL=SelectRectSprite.js.map