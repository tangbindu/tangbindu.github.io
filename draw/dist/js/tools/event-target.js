/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 20:37:56
 * @FilePath: /draw/src/ts/EventTarget.ts
 * @Description:
 */
// 制作事件驱动源
class EventTarget {
    /**
     * 构造
     */
    constructor() {
        this.handlers = {};
    }
    /**
     * 注册事件
     * @param type
     * @param handler
     */
    handler(type, handler) {
        // 添加事件对象
        if (typeof this.handlers[type] === 'undefined') {
            this.handlers[type] = [];
        }
        this.handlers[type] = this.handlers[type].concat(handler);
    }
    /**
     * 移除事件
     * @param type
     * @param handler
     */
    removeHandler(type, handler) {
        if (typeof this.handlers === 'undefined') {
            this.handlers = {};
        }
        if (this.handlers[type] instanceof Array) {
            const handlers = this.handlers[type];
            for (let i = 0, len = handlers.length; i < len; i++) {
                if (handler[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 触发事件
     * @param type
     */
    trigger(type, data1, data2) {
        if (typeof this.handlers === 'undefined') {
            this.handlers = {};
        }
        if (this.handlers[type] instanceof Array) {
            const handlers = this.handlers[type];
            for (let i = 0, len = handlers.length; i < len; i++) {
                handlers[i].call(this, data1, data2);
            }
        }
    }
}
export default EventTarget;
//# sourceMappingURL=event-target.js.map