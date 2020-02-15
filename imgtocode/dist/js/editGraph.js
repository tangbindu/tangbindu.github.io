import tools from "./tools.js";
//event
let downTime;
// let hasActiveSprite=false;
let editGraph=(me,main)=>{
    let type  = me.type;
    let moveVector=me.moveLogicVector;
    //坐标转换
    if (type == "down") {
        //获取到点击的元素
        // let sprite=main.spritesController.getSpriteByPoint(
        //     main.stageCTX,
        //     me.realPoint
        // );
        // sprite.active=true;
        // hasActiveSprite=(sprite && sprite.active) ? true :false;
    }
    if (type == "move" && me.isMoving) {
        // if(!hasActiveSprite){
        //     return false;
        // }
        main.spritesController.moveSprites(moveVector);
    }
    if (type == "up") {
        // main.activeSprites = [];
    }
}
export default editGraph;