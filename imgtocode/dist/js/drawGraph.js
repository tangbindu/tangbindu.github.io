import tools from "./tools.js";
import { Rect , Grid , Guidewires} from "./SpriteGraph.js";
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
                main.newShape = new Rect(point);
                main.spritesController.addSprite(main.newShape);
                break;
        }
    }
    if (type == "move" && me.isMoving) {
        main.newShape && main.newShape.updatePoints(point)
    }
    if (type == "up") {
        // 剔除过小的图形
        if (
            (main.newShape.points[2].x - main.newShape.points[0].x) < 30 && 
            (main.newShape.points[2].y - main.newShape.points[0].y) < 30
        ) {
            main.spritesController.removeLastSprite();
        }
        main.newShape=null;
    }
}
export default drawGraph;