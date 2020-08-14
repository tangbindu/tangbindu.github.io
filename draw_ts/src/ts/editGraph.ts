import Sprite from "./Sprite";
import tools from "./tools.js";

let activeSprite;
let newActiveSprite=false;
let hasMoving=false;//为了区分mouseup and click
let editGraph=(app)=>{
    if (app.mouseEvent.eventType == "mousedown") {
        let pos=app.mouseEvent.curLogicPos;
        activeSprite=app.spritesController.getSpriteByPoint(app.ctx,{
            x:pos.x+app.x,
            y:pos.y+app.y
        });
        if(activeSprite && !activeSprite.active){
            app.spritesController.addActiveSprite(activeSprite);
            newActiveSprite=true;
        }else if(activeSprite){
            newActiveSprite=false;
        }else{
            app.spritesController.releaseActiveSprites()
        }
        if(app.spritesController.activeSprites.length>1 && !app.keyBoardEvent.pressCmd){
            app.spritesController.releaseActiveSprites();
            app.spritesController.addActiveSprite(activeSprite)
        }
    }
    if (app.mouseEvent.eventType  == "mousemove" && app.mouseEvent.isMoving) {
        //drag精灵
        app.mouseEvent.leftDown && app.dragActiveSprite(
            app.spritesController.activeSprites,
            app.mouseEvent.moveLogicVector
        );
        if(app.mouseEvent.leftDown && app.mouseEvent.isMoving){
            hasMoving=true;
        }
    }
    if (app.mouseEvent.eventType  == "mouseup") {
        app.spritesController.getActiveSprites().forEach(sprite => {
            sprite.x=tools.toInt(sprite.x);
            sprite.y=tools.toInt(sprite.y);
            sprite.width=tools.toInt(sprite.width);
            sprite.height=tools.toInt(sprite.height);
        });
        
        !newActiveSprite && activeSprite && activeSprite.active && !hasMoving &&  app.spritesController.releaseActiveSprites(activeSprite);
        hasMoving=false;
    }
}
export default editGraph;