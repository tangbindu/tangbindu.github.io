import tools from "./tools.js";
import { Rect , Grid , Guidewires} from "./SpriteGraph.js";
let newShape;
//event
let drawGraph=(me,main)=>{
    let point;
    let type = me.type;
    point=me.curLogicPos;
    main.pressShiftBtn && tools.magneticBorder(point,main.spritesController.sprites,10);
    //坐标转换
    if (type == "down") {
        switch (main.drawShapeType) {
            case "rect":
                newShape = new Rect(point);
                main.spritesController.addSprite(newShape);
                break;
        }
    }
    if (type == "move" && me.isMoving) {
        newShape && newShape.updatePoints(point)
    }
    if (type == "up") {
        // 剔除过小的图形
        if (
            (newShape.points[2].x - newShape.points[0].x) < 30 && 
            (newShape.points[2].y - newShape.points[0].y) < 30
        ) {
            main.spritesController.removeLastSprite();
        }
        newShape=null;
    }
}
export default drawGraph;