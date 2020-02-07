import tools from "./tools.js";
//event
let drawGuidewires=(me,main)=>{
    if(me.type=="move"){
        let viewPoint=me.curLogicPos;
        let point=me.deviceCurLogicPos;
        //shift 处理 start
        main.pressShiftBtn && tools.magneticBorder(viewPoint,main.spritesController.sprites,10);
        point=tools.LogicPixelToDevicePixel(
            viewPoint,
            main.ratio,
            main.scale,
            main.coordinateOrigin
        );
        //shift 处理 end
        main.guidewires.x=point.x;
        main.guidewires.y=point.y;
        main.guidewires.viewX=viewPoint.x;
        main.guidewires.viewY=viewPoint.y;
    }
}
export default drawGuidewires;