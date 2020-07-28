let createSprite;
//event
let drawGraph=(app)=>{
    let pos=app.mouseEvent.curLogicPos;
    // main.pressShiftBtn && tools.magneticBorder(point,main.spritesController.sprites,10);
    //坐标转换
    //update guidewires
    app.updataGuidewires();
    if (!app.keyBoardEvent.pressSpace && (app.mouseEvent.eventType == "mousedown")) {
        //new 图形
        createSprite=app.addRectSprite({
            x:pos.x,
            y:pos.y,
            zindex:10000,
            width:0,
            height:0,
            useDrag:true
        });
        
    }
    if (app.mouseEvent.eventType  == "mousemove" && app.mouseEvent.isMoving) {
        // 创建的sprite
        if(createSprite){
            createSprite.width=app.mouseEvent.totalLogicMoveVector.x;
            createSprite.height=app.mouseEvent.totalLogicMoveVector.y;
        }
    }
    if (app.mouseEvent.eventType  == "mouseup") {
        // 剔除过小的图形
        if(createSprite){
            if(createSprite.width<10 && createSprite.height<10){
                console.log("删除")
                app.spritesController.removeSprite(createSprite)
            }
            createSprite=null;
        }
    }
}
export default drawGraph;