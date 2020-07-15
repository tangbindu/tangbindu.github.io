import eventTarget from "./eventTarget.js";
// 绘图 
class Sprite extends eventTarget {
    //构造
    constructor(config) {
        super();
        //配置
        this.config = config || {};
        //类型，默认sprite
        this.type = this.config.type || "default";
        //id
        this.id = this.config.id || "";
        //name
        this.name = this.config.name || "";
        //x坐标
        this.x = this.config.x || 0;
        //y坐标
        this.y = this.config.y || 0;
        //width
        this.width = this.config.width || 0;
        //height
        this.height = this.config.height || 0;
        //层级
        this.index = this.config.index || 100;
        //选中
        this.active = this.config.active || false;
        //位移
        this.translate = this.config.translate || [0, 0];
        //缩放
        this.scale = 1;
        //zindex
        this.zindex = this.config.zindex || 0;
        //useDrag
        this.useDrag = this.config.useDrag || false;
        //allowClick
        this.allowClick = this.config.allowClick != undefined ? this.config.allowClick : true;
        //click event
        //parent 只支持一级
        this.parent = this.config.parent || null;
        //相对父元素的定位
        this.relativePosition = this.config.relativePosition || [.5, .5];
        //visible 
        this.visible = this.config.visible != undefined ? this.config.visible : true;
    }
    /**
     * 移动
     * @param {vector} vector
     */
    move(vector) {
        this.x += vector[0];
        this.y += vector[1];
    }
    /**
     * 移动到一个点
     */
    moveTo(point) {
        this.x = point.x;
        this.y = point.y;
    }
    /**
     * 绘制图形精灵
     */
    draw(ctx) {
    }
    /**
     * 点击判断
     */
    isInPath(ctx, pos) {
        return false;
    }
    /**
     * 计算相对位置
     */
    calculateRelativePosition() {
        let offsetX = this.relativePosition[2] || 0;
        let offsetY = this.relativePosition[3] || 0;
        if (this.parent) {
            this.x = this.parent.x + this.parent.width * this.relativePosition[0] - this.width * .5 + offsetX;
            this.y = this.parent.y + this.parent.height * this.relativePosition[1] - this.height * .5 + offsetY;
        }
    }
}
export default Sprite;
//# sourceMappingURL=sprite.js.map