let activeSprite;
let newActiveSprite = false; //处理多选，取消单个的问题
let hasMoving = false; //为了区分mouseup and click
let editGraph = (app) => {
    // 选择精灵
    if (app.mouseEvent.eventType == "mousedown") {
        let pos = app.mouseEvent.curLogicPos;
        // 点到一个元素
        activeSprite = app.spritesController.getSpriteByPoint(app.ctx, {
            x: pos.x + app.x,
            y: pos.y + app.y
        });
        // 添新active元素，并且之前没有active，添加他
        if (activeSprite && !activeSprite.active) {
            if (!app.keyBoardEvent.pressCmd) {
                // 没按下cmd表示单选
                app.spritesController.releaseActiveSprites();
            }
            app.spritesController.addActiveSprite(activeSprite);
            newActiveSprite = true;
        }
        else if (activeSprite) {
            // 没有新元素
            newActiveSprite = false;
        }
        else {
            // 什么对象都没有点到
            app.spritesController.releaseActiveSprites();
        }
    }
    // 移动精灵
    if (app.mouseEvent.eventType === "mousemove" && app.mouseEvent.isMoving) {
        // 步进策略
        // drag精灵
        app.mouseEvent.leftDown && app.moveSprites(app.spritesController.activeSprites, app.mouseEvent.moveStepLogicVector);
        if (app.mouseEvent.leftDown && app.mouseEvent.isMoving) {
            hasMoving = true;
        }
    }
    // 其他处理
    if (app.mouseEvent.eventType === "mouseup") {
        app.spritesController.getActiveSprites().forEach(sprite => {
            // 重新计算值
            sprite.x = sprite.x;
            sprite.y = sprite.y;
            sprite.width = sprite.width;
            sprite.height = sprite.height;
        });
        // 释放多选状态下，被点击的active元素
        !newActiveSprite && activeSprite && activeSprite.active && !hasMoving && app.spritesController.releaseActiveSprites(activeSprite);
        hasMoving = false;
    }
};
export default editGraph;
//# sourceMappingURL=editGraph.js.map