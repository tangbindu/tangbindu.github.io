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


// for(let i=0;i<10;i++){
//     let rect=stage.addRectSprite({
//         x:Math.random()*stage.width,
//         y:Math.random()*stage.height,
//         width:Math.random()*stage.height,
//         height:500,
//         zindex:1000,
//         useDrag:Math.random()*stage.width
//     })
// }

for(let i=0;i<0;i++){
    stage.addImageSprite("../img/a.png",{
        x:Math.random()*3000,
        y:Math.random()*1000,
        zindex:0,
        useDrag:true
    })
    stage.addImageSprite("../img/b.png",{
        x:Math.random()*3000,
        y:Math.random()*1000,
        zindex:0,
        useDrag:true
    })
    stage.addImageSprite("../img/c.png",{
        x:Math.random()*3000,
        y:Math.random()*1000,
        zindex:0,
        useDrag:true
    })
}
window.stage=stage;