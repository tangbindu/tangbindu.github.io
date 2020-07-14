//制作事件驱动源
class eventTarget{
    //事件对象
    handlers: {};
    /**
     * 注册事件 
     * @param type 
     * @param handler 
     */
    handler(type:string, handler:Function) {
        //添加事件对象
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = new Array();
        }
        this.handlers[type] = this.handlers[type].concat(handler);
    }
    /**
     * 移除事件
     * @param type 
     * @param handler 
     */
    removeHandler(type:string, handler:Function) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handler[i] == handler) {
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
    trigger(type:string) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].call(this, this);
            }
        }
    }
}
export default eventTarget;
