import tools from "./tools.js";
//event
let drawGuidewires=(me,main)=>{
    if(me.type=="move"){
        let point=me.curPos;
        let LogicPoint;
        //处理引导线 start
        LogicPoint=tools.toLogicPixel(
            point,
            main.ratio,
            main.scale,
            main.coordinateOrigin
        );
        point=tools.toPixel(point,main.ratio);
        //shift 处理 start
        if(main.pressShiftBtn){
            tools.magneticBorder(LogicPoint,main.spritesController.sprites,10);
            point=tools.LogicPixelToDevicePixel(
                LogicPoint,
                main.ratio,
                main.scale,
                main.coordinateOrigin
            );
        }
        //shift 处理 end
        main.guidewires.x=point.x;
        main.guidewires.y=point.y;
        main.guidewires.viewX=LogicPoint.x;
        main.guidewires.viewY=LogicPoint.y;
    }
}
export default drawGuidewires;