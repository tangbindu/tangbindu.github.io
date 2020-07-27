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

window.stage=stage;