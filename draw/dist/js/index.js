import tools from "./tools.js";
import MouseEvent from "./MouseEvent.js"
import interact from "./interact.js";
import stage from "./stage.js";
import {Grid} from "./SpriteGraph.js";
import SpritesController from "./SpritesController.js";
window.imgToCode = new Vue({
    el: '#app',
    data: {
        //坐标原点位置
        coordinateOrigin: {
            x: 40,
            y: 40
        },
        app:null,
        //舞台
        stage: null,
        stageWidth: null,
        stageHeight: null,
        //舞台绘图对象
        stageCTX: null,
        //像素比
        ratio: 2.0,
        //人工缩放比
        scale: 1.0,
        //mouseEvent
        mouseEvent:null,
        //按键
        pressSpaceBtn:false,//space button
        //依赖
        'spritesController': new SpritesController()
    },
    //创建
    created() {
    },
    //准备好
    mounted() {
        this.init();
    },
    //监听
    watch: {
    },
    //方法
    methods: {
        // 初始化
        init() {
            //stage
            this.app=document.getElementById("app");
            this.stage=stage.createStage(app);
            this.stageCTX = this.stage.getContext("2d");
            //内容
            this.addGrid();
            //更新
            this.update();
            //渲染
            this.render();
            // test
            let test=()=>{
                this.coordinateOrigin.x+=1;
                this.coordinateOrigin.y+=1;
                this.render();
                requestAnimationFrame(test)
            }
            // test()
            //键盘交互--all
            interact(this);
            //鼠标交互--绘图
            this.mouseEvent = new MouseEvent(
                this.stage,
                this.ratio,
                this.scale,
                this.coordinateOrigin
            );
            let self = this;
            this.mouseEvent.handler("all",function(){
                if (self.pressSpaceBtn && this.type == "move" && this.isMoving) {
                    self.coordinateOrigin.x+=this.moveLogicVector[0];
                    self.coordinateOrigin.y+=this.moveLogicVector[1];
                }
                //按住shifit
                // switch (self.workMode) {
                //     case "draw":
                //         drawGraph(this,self); 
                //         break;
                //     case "edit":
                //         editGraph(this,self);
                //         break;
                // }
                self.render();
            })
        },
        /**
         * 缩放舞台策略
         * @param {number} scale  缩放点
         * @param {point} scalePoint  缩放点    
         */
        scaleStage(newScale,scalePoint){
            // stage.scaleStage(newScale,scalePoint)
            var v=(this.stageHeight*newScale-this.stageHeight)*.5;
            this.coordinateOrigin.x=v/this.ratio;
            this.coordinateOrigin.y=v/this.ratio;
            this.scale*=newScale;
            // this.coordinateOrigin.x+=(this.stageWidth*newScale-this.stageWidth)*(this.mouseEvent.curLogicPos.x/this.stageWidth)*.5;
            // this.coordinateOrigin.x+=(this.stageHeight*newScale-this.stageHeight)*(this.mouseEvent.curLogicPos.x/this.stageHeight)*.5;
            // console.log(this.mouseEvent.curLogicPos.x)
            // console.log(this.mouseEvent.curLogicPos.y)
        },
        /**
         * 集中更新
         */
        update(){
            //更新舞台
            stage.updataStage(
                this.app,
                this.stage,
                this.ratio
            )
            this.stageWidth = this.stage.width;
            this.stageHeight = this.stage.height;
            //更新grid
            this.grid.width=this.stageWidth;
            this.grid.height=this.stageHeight;
        },
        /**
         * 渲染
         */
        render() {
            //清空画布
            this.clear();
            //绘制图像
            this.drawShapes();
        },
        //添加网格
        addGrid(){
            this.grid = new Grid({x:0,y:0});
            this.grid.zindex=-1000000;
            this.grid.type="tool";
            this.grid.allowClick=false;
            this.grid.gap=100;
            this.spritesController.addSprite(this.grid);
        },
        //绘制图像
        drawShapes() {
            //遍历精灵
            this.spritesController.sprites.map((item) => {
                item.scale=this.scale;
                item.x+=this.coordinateOrigin.x;
                item.y+=this.coordinateOrigin.y;
                item.draw(this.stageCTX);
                item.x-=this.coordinateOrigin.x;
                item.y-=this.coordinateOrigin.y;
            })
        },
        //清空画布
        clear() {
            tools.clear(this.stageCTX, 0, 0, this.stageWidth, this.stageHeight);
        }
    }
})

