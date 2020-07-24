import tools from "./tools.js";
import eventTarget from "./eventTarget.js";
function getVertexPosition(el) {
    let currentTarget = el;
    let top = 0;
    let left = 0;
    while (currentTarget !== null) {
        top += currentTarget.offsetTop;
        left += currentTarget.offsetLeft;
        currentTarget = currentTarget.offsetParent;
    }
    return { top, left };
}
//event
class MouseEvent extends eventTarget {
    /**
     * 构造
     * @param {html node} element
     */
    constructor(config) {
        super();
        //元素
        this.element = config.element;
        //app
        this.app = config.app;
        //通用
        this.startPos = null; //开始point
        this.previousPos = null; //上一个point
        this.currentPos = { x: 0, y: 0 }; //当前point
        this.currentCanvasPos = { x: 0, y: 0 }; //当前point
        this.moveVector = { x: 0, y: 0 }; //vector
        this.totalMoveVector = { x: 0, y: 0 }; //总移动vector
        this.moveLogicVector = { x: 0, y: 0 }; //logic vector
        this.totalLogicMoveVector = { x: 0, y: 0 }; //总逻辑移动vector
        this.eventType = null;
        this.isMoving = false;
        this.leftDown = false;
        //时间
        this._mousedownTime = null;
        this._mouseupTime = null;
        //初始化
        this.init();
        //
        this.offsetTop = 0;
    }
    /**
     * init
     */
    init() {
        //常规鼠标事件
        this.element.addEventListener("mousedown", (event) => {
            this.eventType = "mousedown";
            this.mousedown(event);
        });
        this.element.addEventListener("mousemove", (event) => {
            this.eventType = "mousemove";
            this.mousemove(event);
        });
        this.element.addEventListener("mouseup", (event) => {
            this.eventType = "mouseup";
            this.mouseup(event);
        });
        //滚轮
        document.body.onmousewheel = (event) => {
            if (event.deltaY > 0) {
                //放大
                this.app.setScale(event.deltaY / 750);
            }
            else {
                //缩小
                this.app.setScale(event.deltaY / 750);
            }
        };
        //鼠标引起的尺寸变化
        window.addEventListener("resize", () => {
            this.trigger("resize");
        });
    }
    /**
     * 工具方法，转换clientX到canvas pixel
     */
    toCanvasPixel(pos) {
        return {
            x: pos.x / this.element.clientWidth * this.element.width,
            y: pos.y / this.element.clientHeight * this.element.height
        };
    }
    /**
     * mousedown
     */
    mousedown(event) {
        this.offsetTop = getVertexPosition(this.element).top;
        this.currentPos = {
            x: event.clientX,
            y: event.clientY - this.offsetTop
        };
        // this.currentPos=this.toCanvasPixel(this.currentPos);
        this.startPos = this.currentPos;
        this.previousPos = this.currentPos;
        this.trigger("mousedown");
        this.detailMixEvent("mousedown");
    }
    /**
     * mousemove
     */
    mousemove(event) {
        this.currentPos = {
            x: event.clientX,
            y: event.clientY - this.offsetTop
        };
        // this.currentPos=this.toCanvasPixel(this.currentPos);
        this.trigger("mousemove");
        this.detailMixEvent("mousemove");
        this.previousPos = this.currentPos;
    }
    /**
     * mouseup
     */
    mouseup(event) {
        this.trigger("mouseup");
        this.detailMixEvent("mouseup");
        this.startPos = null;
        this.previousPos = null;
        this.currentPos = null;
        event.preventDefault();
    }
    /**
     * 处理混合情况
     */
    detailMixEvent(type) {
        if (type == "mousedown") {
            this.isMoving = false;
            this._mousedownTime = new Date().getTime();
            this.leftDown = true;
        }
        else if (type == "mousemove") {
            this.isMoving = true;
            if (this.previousPos) {
                this.moveVector = {
                    x: this.currentPos.x - this.previousPos.x,
                    y: this.currentPos.y - this.previousPos.y
                };
            }
            if (this.startPos) {
                this.totalMoveVector = {
                    x: this.currentPos.x - this.startPos.x,
                    y: this.currentPos.y - this.startPos.y
                };
            }
        }
        else if (type == "mouseup") {
            this._mouseupTime = new Date().getTime();
            if ((this._mouseupTime - this._mousedownTime) < 400 && !this.isMoving) {
                this.trigger("click");
            }
            this.isMoving = false;
            this.leftDown = false;
        }
        this.currentCanvasPos = tools.toPixel(this.currentPos, this.app.devicePixelRatio);
        this.curLogicPos = tools.toLogicPixel(this.currentPos, this.app.devicePixelRatio, this.app.scale, this.app.x, this.app.y);
        this.moveLogicVector = tools.toLogicVector(this.moveVector, this.app.devicePixelRatio, this.app.scale);
        this.totalLogicMoveVector = tools.toLogicVector(this.totalMoveVector, this.app.devicePixelRatio, this.app.scale);
        this.trigger("mixMouseEvent");
    }
}
export default MouseEvent;
//# sourceMappingURL=mouseEvent.js.map