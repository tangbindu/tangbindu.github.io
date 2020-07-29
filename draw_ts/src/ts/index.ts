//引入依赖模块
import {Stage} from "./Stage.js";
import storage from "./storage.js";


//工作台
window.onload=function(){
    //记忆体-获取
    let stageData=storage.getStage();
    //获取舞台容器
    let stageWrap=document.getElementById("stageWrap");
    stageData.stage.width=document.body.clientWidth;
    stageData.stage.height=document.body.clientHeight;
    stageData.stage.backgroundColor= stageData.stage.backgroundColor||"#2c3448"
    //记忆舞台
    let stage=new Stage(stageData.stage);
    stageWrap.appendChild(stage.canvas);
    //记忆sprites
    stageData.sprites.forEach(spriteConfig => {
        let sprite=null;
        switch(spriteConfig.type) {
            case "RectSprite":
                sprite=stage.addRectSprite(spriteConfig)
               break;
            case "ImageSprite":
                sprite=stage.addImageSprite(spriteConfig.imagePath,spriteConfig)
                break;
            default:
               void(0)
       }
       sprite && sprite.active && stage.spritesController.addActiveSprite(sprite)
    });
    let timmer=null;
    //记忆体-存储
    stage.mouseEvent.handler("mouseup",()=>{
        timmer && clearTimeout(timmer)
        timmer=setTimeout(()=>{
            storage.saveStage(stage)
        },200)
    })
    stage.mouseEvent.handler("mousewheel",()=>{
        timmer && clearTimeout(timmer)
        timmer=setTimeout(()=>{
            storage.saveStage(stage)
        },200)
    })
    stage.keyBoardEvent.handler("keyup",()=>{
        timmer && clearTimeout(timmer)
        timmer=setTimeout(()=>{
            storage.saveStage(stage)
        },200)
    })
    //其他
    window.stage=stage;

    // for(let i=0;i<1;i++){
    //     stage.addImageSprite("../img/a.png",{
    //         x:Math.random()*3000,
    //         y:Math.random()*1000,
    //         zindex:0,
    //         useDrag:true
    //     })
    //     stage.addImageSprite("../img/b.png",{
    //         x:Math.random()*3000,
    //         y:Math.random()*1000,
    //         zindex:0,
    //         useDrag:true
    //     })
    //     stage.addImageSprite("../img/c.png",{
    //         x:Math.random()*3000,
    //         y:Math.random()*1000,
    //         zindex:0,
    //         useDrag:true
    //     })
    // }

}


// stage.addImageSprite("../testimg/a.png",{
//     x:0,
//     y:0,
//     zindex:0,
//     useDrag:true
// })