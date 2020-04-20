import tools from "./tools.js";
import MouseEvent from "./MouseEvent.js"
import interact from "./interact.js";
import stage from "./stage.js";
import {Grid,Guidewires} from "./SpriteGraph.js";
import updateGuidewires from "./updateGuidewires.js"
import { Image } from "./SpriteImage.js";
import SpritesController from "./SpritesController.js";
window.app = new Vue({
    el: '#app',
    data: {
        //坐标原点位置
        coordinateOrigin: {
            x: 0,
            y: 0
        },
        //scale origin
        scaleOrigin:{
            x:.5,
            y:.5
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
        //内容
        guidewires:null,
        //上传的图片
        uploadImage: null,//上传的图片
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
        //绘制的图片变化了
        "uploadImage": function () {
            this.addImg()
        },
    },
    //方法
    methods: {
        // 初始化
        init() {
            //stage
            this.app=document.getElementById("app");
            this.stage=stage.createStage(app);
            this.stageCTX = this.stage.getContext("2d");
            //键盘交互--all
            interact(this);
            //内容
            this.addGrid();//网格
            // this.addGuidewires();//辅助线
            //鼠标交互--绘图
            this.mouseEvent = new MouseEvent(
                this.stage,
                this.ratio,
                this.scale,
                this.coordinateOrigin
            );
            let self = this;
            this.mouseEvent.handler("all",function(){
                //拖动stage
                if (self.pressSpaceBtn && this.type == "move" && this.isMoving) {
                    self.coordinateOrigin.x+=this.moveLogicVector[0];
                    self.coordinateOrigin.y+=this.moveLogicVector[1];
                }
                if(this.curPos){
                    self.scaleOrigin.x=(this.curPos.x*self.ratio)/self.stageWidth;
                    self.scaleOrigin.y=(this.curPos.y*self.ratio)/self.stageHeight;
                }
                self.render();
            })
            //更新
            this.update();
            //渲染
            this.render();
        },
        /**
         * 缩放舞台策略
         * @param {number} scale  缩放点
         * @param {point} scalePoint  缩放点    
         */
        scaleStage(scale,scalePoint){
            scale=2.0;
            this.scaleOrigin.x=.5;
            //缩放偏移
            let newScale=this.scale*scale;
            //屏幕偏移量
            let sx=this.scaleOrigin.x*this.stageWidth*(newScale-this.scale)/newScale*-1;
            let sy=this.scaleOrigin.y*this.stageHeight*(newScale-this.scale)/newScale*-1;
            this.coordinateOrigin.x+=sx;
            this.coordinateOrigin.y+=sy;
            console.log(sx)

            this.scale=newScale;
            this.mouseEvent.scale=newScale;
            // console.log(this.coordinateOrigin.x);
            // console.log((Math.abs(this.coordinateOrigin.x*2)+this.stageWidth)*this.scale)
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
            //
            // this.guidewires.width=this.stageWidth;
            // this.guidewires.height=this.stageHeight;
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
        //添加引导线
        addGuidewires(){
            this.guidewires = new Guidewires({x:0,y:0},0,0);
            this.guidewires.allowClick=false;
            this.guidewires.zindex=1000000;
            this.guidewires.type="tool";
            this.guidewires.visible=false;
            this.guidewires.width=this.stageWidth;
            this.guidewires.height=this.stageHeight;
            this.spritesController.addSprite(this.guidewires);
        },
        //添加img
        addImg(){
            let img=this.uploadImage.img;
            let name=this.uploadImage.name;
            this.pageImage=new Image({x:0,y:0});
            this.pageImage.zindex=-900000;
            this.pageImage.width=img.width;
            this.pageImage.height=img.height;
            this.pageImage.img=img;
            this.pageImage.name="page_img";
            this.pageImage.Pname=name;
            this.spritesController.addSprite(this.pageImage);
            this.render();
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

