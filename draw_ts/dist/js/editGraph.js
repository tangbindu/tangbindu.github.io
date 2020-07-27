let activeSprite;
let newSprite = false;
let editGraph = (app) => {
    if (app.mouseEvent.eventType == "mousedown") {
        let pos = app.mouseEvent.curLogicPos;
        activeSprite = app.spritesController.getSpriteByPoint(app.ctx, {
            x: pos.x + app.x,
            y: pos.y + app.y
        });
        if (activeSprite && !activeSprite.active) {
            app.spritesController.addActiveSprite(activeSprite);
            newSprite = true;
        }
        else {
            newSprite = false;
        }
        if (app.spritesController.activeSprites.length > 1 && !app.keyBoardEvent.pressCmd) {
            app.spritesController.releaseActiveSprites();
            app.spritesController.addActiveSprite(activeSprite);
        }
    }
    if (app.mouseEvent.eventType == "mousemove" && app.mouseEvent.isMoving) {
        //drag精灵
        app.mouseEvent.leftDown && app.dragActiveSprite(app.spritesController.activeSprites, app.mouseEvent.moveLogicVector);
    }
    if (app.mouseEvent.eventType == "mouseup") {
    }
    if (app.mouseEvent.eventType == "click") {
        !newSprite && activeSprite && activeSprite.active && app.spritesController.releaseActiveSprites(activeSprite);
    }
};
export default editGraph;
//# sourceMappingURL=editGraph.js.map