import Sprite from "./sprite.js";
// 绘图 
class ImageSprite extends Sprite {
    constructor(imagePath, config) {
        super(config);
        this.config = config;
        this.imagePath = imagePath || this.imagePath;
        this.img = null;
        this.name = this.config.name || this.name;
        this.repeat = typeof this.config.repeat === "undefined" ? this.repeat : false;
        this.init();
    }
    //初始化
    init() {
        let img = new Image();
        img.onload = () => {
            this.img = img;
            this.width = this.config.width || img.width;
            this.height = this.config.height || img.height;
            this.trigger("imgLoaded");
        };
        img.src = this.imagePath;
    }
    //绘制图形精灵
    draw(ctx) {
        if (!this.img) {
            return;
        }
        ctx.save();
        //是否重复填充背景
        if (this.repeat) {
            //模型
            let pattern = ctx.createPattern(this.img, "repeat");
            ctx.fillStyle = pattern;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else {
            //普通绘制
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
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
export default ImageSprite;
//# sourceMappingURL=sprite_image.js.map