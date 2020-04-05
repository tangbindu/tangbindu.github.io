import tools from "./tools.js";
import interact from "./interact.js";
import stage from "./stage.js";
import {Grid} from "./SpriteGraph.js";
import SpritesController from "./SpritesController.js";
window.imgToCode = new Vue({
    el: '#app',
    data: {
        //坐标原点位置
        coordinateOrigin: {
            x: 35,
            y: 35
        },
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
            let app=document.getElementById("app");
            this.stage=stage.createStage(app);
            this.stageCTX = this.stage.getContext("2d");
            this.updateStage(app);
            //内容
            this.addGrid();
            //渲染
            this.render();
            // test
            let test=()=>{
                this.coordinateOrigin.x-=4;
                this.coordinateOrigin.y-=4;
                this.render();
                requestAnimationFrame(test)
            }
            // test()
            interact(this);
        },
        /**
         * updateStage
         */
        updateStage(app){
            stage.updataStage(
                this.stage,
                app,
                this.ratio
            )
            this.stageWidth = this.stage.width;
            this.stageHeight = this.stage.height;
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
            this.grid.width=this.stageWidth;
            this.grid.height=this.stageHeight;
            this.grid.gap=100;
            this.spritesController.addSprite(this.grid);
        },
        //绘制图像
        drawShapes() {
            //遍历精灵
            this.spritesController.sprites.map((item) => {
                item.scale=this.scale;
                // let x=item.x;
                // let y=item.y;
                // item.x=item.x+this.coordinateOrigin.x;
                // item.y=item.y+this.coordinateOrigin.y;
                item.draw(
                    this.stageCTX,
                    this.coordinateOrigin
                );
                // item.x=x;
                // item.y=y;
            })
        },
        //清空画布
        clear() {
            tools.clear(this.stageCTX, 0, 0, this.stageWidth, this.stageHeight);
        }
    }
})

