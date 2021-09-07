/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-07 23:48:01
 * @FilePath: /draw/src/ts/Image-sprite.ts
 * @Description:
 */
import Sprite from './sprite.js';
// 绘图
class ImageSprite extends Sprite {
    constructor(imagePath, config) {
        super(config);
        this.config = config;
        this.type = 'ImageSprite', // 等于类名字
            this.imagePath = imagePath;
        this.img = null;
        this.name = this.config.name || 'image';
        this.repeat = typeof this.config.repeat === 'undefined' ? this.repeat : false;
        this.init();
    }
    // 初始化
    init() {
        const img = new Image();
        img.onload = () => {
            this.img = img;
            this.width = this.config.width || img.width;
            this.height = this.config.height || img.height;
            this.trigger('imgLoaded');
        };
        img.src = this.imagePath;
    }
    // 绘制图形精灵
    draw(ctx) {
        if (!this.img) {
            return;
        }
        ctx.save();
        const scale = this.getScale();
        const getPosition = this.getPosition();
        // 是否重复填充背景
        if (this.repeat) {
            // 模型
            const pattern = ctx.createPattern(this.img, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(getPosition.x * scale, getPosition.y * scale, this.width * scale, this.height * scale);
        }
        else {
            // 普通绘制
            ctx.drawImage(this.img, getPosition.x * scale, getPosition.y * scale, this.width * scale, this.height * scale);
        }
        this.active && this.setActiveStyle(ctx);
        ctx.restore();
    }
    // 点击
    isInPath(ctx, pos) {
        ctx.save();
        const scale = this.getScale();
        const getPosition = this.getPosition();
        ctx.beginPath();
        ctx.rect(getPosition.x * scale, getPosition.y * scale, this.width * scale, this.height * scale);
        ctx.closePath();
        ctx.restore();
        if (ctx.isPointInPath(pos.x * scale, pos.y * scale)) {
            return true;
        }
        return false;
    }
    // setActiveStyle
    setActiveStyle(ctx) {
        const scale = this.getScale();
        const getPosition = this.getPosition();
        ctx.lineWidth = Math.max(scale, 1);
        ctx.fillStyle = 'rgba(0,90,90,.6)';
        ctx.fillRect(getPosition.x * scale, getPosition.y * scale, this.width * scale, this.height * scale);
    }
}
export default ImageSprite;
//# sourceMappingURL=Image-sprite.js.map