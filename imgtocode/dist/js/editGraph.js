import tools from "./tools.js";
//event
let editGraph=(me,main)=>{
    let point = me.curPos;
    let type = me.type;
    let moveVector=me.moveVector;
    //坐标转换
    point=tools.toPixel(point,main.ratio);
    if (type == "down") {
        //获取到点击的元素
        main.activeSprites=[main.spritesController.getClickSprite(main.stageCTX,point)];
    }
    if (type == "move" && me.isMoving) {
        moveVector=tools.vectorToPixel(moveVector,main.ratio,main.scale);
        main.activeSprites.length>0  && main.activeSprites.map((item)=>{
            item.move(moveVector,main)
        });
    }
    if (type == "up") {
        // main.activeSprites = [];
    }
}
export default editGraph;