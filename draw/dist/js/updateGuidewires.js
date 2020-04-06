import tools from "./tools.js";
//event
let drawGuidewires=(mouseEvent,app)=>{
    //显示值-逻辑像素
    let viewPoint=mouseEvent.curLogicPos;
    let point={};
    //shift 磁性锁边
    // app.pressShiftBtn && tools.magneticBorder(
    //     viewPoint,
    //     app.spritesController.sprites,
    //     10
    // );
    //绘制点
    point=tools.LogicPixelToDevicePixel(
        mouseEvent.curLogicPos,
        app.ratio,
        app.scale,
        app.coordinateOrigin
    );
    //shift 处理 end
    app.guidewires.x=point.x;
    app.guidewires.y=point.y;
    app.guidewires.viewX=viewPoint.x;
    app.guidewires.viewY=viewPoint.y;
}
export default drawGuidewires;