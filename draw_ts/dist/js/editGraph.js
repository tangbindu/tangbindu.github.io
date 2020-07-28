let activeSprite;
let newActiveSprite = false;
let editGraph = (app) => {
    if (app.mouseEvent.eventType == "mousedown") {
        let pos = app.mouseEvent.curLogicPos;
        activeSprite = app.spritesController.getSpriteByPoint(app.ctx, {
            x: pos.x + app.x,
            y: pos.y + app.y
        });
        if (activeSprite && !activeSprite.active) {
            app.spritesController.addActiveSprite(activeSprite);
            newActiveSprite = true;
        }
        else if (activeSprite) {
            newActiveSprite = false;
        }
        else {
            app.spritesController.releaseActiveSprites();
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
        !newActiveSprite && activeSprite && activeSprite.active && app.spritesController.releaseActiveSprites(activeSprite);
    }
};
export default editGraph;
//# sourceMappingURL=editGraph.js.map