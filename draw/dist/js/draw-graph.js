/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-07 17:05:28
 * @FilePath: /draw/src/ts/draw-graph.ts
 * @Description:
 */
import tools from './tools.js';
let createSprite;
// event
const drawGraph = (app) => {
    const pos = app.mouseEvent.curLogicPos;
    // main.pressShiftBtn && tools.magneticBorder(point,main.spritesController.sprites,10);
    // 坐标转换
    // update guidewires
    app.updataGuidewires();
    if (!app.keyBoardEvent.pressSpace && (app.mouseEvent.eventType === 'mousedown')) {
        // new 图形
        createSprite = app.addRectSprite({
            x: pos.x,
            y: pos.y,
            zindex: 10000,
            width: 0,
            height: 0,
            useDrag: true,
        });
    }
    if (app.mouseEvent.eventType === 'mousemove' && app.mouseEvent.isMoving) {
        // 创建的sprite
        if (createSprite) {
            createSprite.width = tools.toInt(app.mouseEvent.totalLogicMoveVector.x);
            createSprite.height = tools.toInt(app.mouseEvent.totalLogicMoveVector.y);
        }
    }
    if (app.mouseEvent.eventType === 'mouseup') {
        // 剔除过小的图形
        if (createSprite) {
            if (createSprite.width < 10 && createSprite.height < 10) {
                app.spritesController.removeSprite(createSprite);
            }
            createSprite = null;
        }
    }
};
export default drawGraph;
//# sourceMappingURL=draw-graph.js.map