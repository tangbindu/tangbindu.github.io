//引入依赖模块
import {Stage} from "./stage.js";

//获取舞台容器
let stageWrap=document.getElementById("stageWrap");
//放入舞台上
let stage=new Stage({
    width:document.body.clientWidth,
    height:document.body.clientHeight,
    backgroundColor:"#2c3448"
});
stageWrap.appendChild(stage.canvas);
//工作台


for(let i=0;i<10;i++){
    let rect=stage.addRectSprite({
        x:Math.random()*stage.width,
        y:Math.random()*stage.height,
        width:Math.random()*stage.height,
        height:500,
        useDrag:Math.random()*stage.width
    })
}
window.stage=stage;