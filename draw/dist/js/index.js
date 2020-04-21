import tools from "./tools.js";
import MouseEvent from "./MouseEvent.js"
import interact from "./interact.js";
import stage from "./stage.js";
import {Grid,Guidewires} from "./SpriteGraph.js";
import updateGuidewires from "./updateGuidewires.js"
import { Image } from "./SpriteImage.js";
import SpritesController from "./SpritesController.js";
let bowen=true;
window.app = new Vue({
    el: '#container',
    data: {
        //坐标原点
        coordinateOrigin: {
            x: 0,
            y: 0
        },
        //舞台容器
        container:null,
        //舞台
        stage: null,
        //舞台宽
        stageWidth: null,
        //舞台高
        stageHeight: null,
        //舞台绘图对象
        stageCTX: null,
        //像素密度
        ratio: 2.0,
        //人工缩放比
        scale: 1.0,
        //缩放限制
        scaleLimit:10,
        //鼠标事件
        mouseEvent:null,
        //精灵控制器
        spritesController: new SpritesController(),
        /**
         * 其他
         **/
        //按下空格键
        pressSpaceBtn:false,
        //鼠标引导线
        guidewires:null,
        //上传文件【图片】
        uploadImage: null//上传的图片
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
            //初始化容器
            this.container=this.$el;
            //舞台
            this.initStage();
            //键盘
            interact(this);
            //键盘
            // this.initKeyBoard();
            //鼠标
            this.initMouseEvent();
            //网格
            this.addGrid();
            //辅助线
            // this.addGuidewires();
            //尺寸
            this.resize();
            //渲染
            this.render();
        },
        /**
         * 初始化舞台
         */
        initStage(){
            this.stage=new stage(this.container,this.ratio)
            this.stageCTX = this.stage.ctx;
            this.stageWidth = this.stage.view.width;
            this.stageHeight = this.stage.view.height;
        },
        /**
         * 初始化鼠标事件
         */
        initMouseEvent(){
            //鼠标交互--绘图
            this.mouseEvent = new MouseEvent(
                this.stage.view,
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
                self.render();
            })
        },
        /**
         * 初始化键盘事件
         */
        initKeyBoard(){

        },
        /**
         * 缩放舞台策略
         * @param {number} scale  缩放点
         * @param {point} scalePoint  缩放点    
         */
        scaleStage(newScale,scalePoint){
            if(this.scale*newScale>10 || this.scale*newScale<.1){
                return;
            }
            newScale=this.scale*newScale;
            this.mouseEvent.refresh();
            //缩放后，逻辑像素不能变
            //最初的逻辑像素
            let lastCurLogicPosX=this.mouseEvent.curLogicPos.x;
            let lastCurLogicPosY=this.mouseEvent.curLogicPos.y;
            this.scale=newScale;
            this.mouseEvent.scale=newScale;
            this.mouseEvent.coordinateOrigin=this.coordinateOrigin;
            this.mouseEvent.refresh();
            let newCurLogicPosX=this.mouseEvent.curLogicPos.x;
            let newCurLogicPosY=this.mouseEvent.curLogicPos.y;
            //变化
            let changeX=(newCurLogicPosX-lastCurLogicPosX);
            let changeY=(newCurLogicPosY-lastCurLogicPosY);
            this.coordinateOrigin.x+=changeX;
            this.coordinateOrigin.y+=changeY;
            //渲染
            this.render();
        },
        /**
         * 集中更新 update 不等于 render
         */
        resize(){
            //更新舞台
            this.stage.resize(this.container,this.ratio)
            this.stageWidth = this.stage.view.width;
            this.stageHeight = this.stage.view.height;
            //更新grid
            this.grid.width=this.stageWidth;
            this.grid.height=this.stageHeight;
            //
            // this.guidewires.width=this.stageWidth;
            // this.guidewires.height=this.stageHeight;
            this.render();
        },
        /**
         * 渲染
         */
        render() {
            requestAnimationFrame(()=>{
                //清空画布
                this.clear();
                //绘制图像
                this.drawShapes();
            })
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

