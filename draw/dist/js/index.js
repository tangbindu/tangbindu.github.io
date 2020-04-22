import tools from "./tools.js";
import MouseEvent from "./MouseEvent.js"
import KeyBoardEvent from "./KeyBoardEvent.js"
import DragFile from "./DragFile.js"
import stage from "./stage.js";
import {Grid,Guidewires} from "./SpriteGraph.js";
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
        scaleLimit:20,
        //鼠标事件
        mouseEvent:null,
        //键盘事件
        keyBoardEvent:null,
        //拖拽文件
        dragFile:null,
        //精灵控制器
        spritesController: new SpritesController(),
        /**
         * 其他
         **/
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
            this.initKeyBoardEvent();
            //鼠标
            this.initMouseEvent();
            //拖拽文件
            this.initDragFile();
            //网格
            this.initGrid();
            //辅助线
            this.initGuidewires();
            //设置尺寸
            this.setSize();
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
                this,
                this.stage.view,
                this.ratio,
                this.scale,
                this.coordinateOrigin
            );
            this.mouseEvent.handler("resize",()=>{
                this.setSize();
                this.render();
            })
            this.mouseEvent.handler("all",()=>{
                //拖动stage
                if (this.keyBoardEvent.pressSpace && this.mouseEvent.type == "move" && this.mouseEvent.isMoving) {
                    this.coordinateOrigin.x+=this.mouseEvent.moveLogicVector[0];
                    this.coordinateOrigin.y+=this.mouseEvent.moveLogicVector[1];
                }
                //guidewires
                if(this.mouseEvent.type == "move"){ 
                    this.guidewires.x=this.mouseEvent.curLogicPos.x;
                    this.guidewires.y=this.mouseEvent.curLogicPos.y;
                } 
                this.render();
            })
            
        },
        /**
         * 初始化键盘事件
         */
        initKeyBoardEvent(){
            this.keyBoardEvent = new KeyBoardEvent(this);
        },
        /**
         * 初始化拖拽文件
         */
        initDragFile(){
            this.dragFile = new DragFile(this);
        },
        /**
         * 缩放舞台策略
         * @param {number} scale  缩放点
         */
        scaleStage(scale){
            //缩放
            this.stage.scale(scale,this)
            //渲染
            this.render();
        },
        /**
         * 设置尺寸
         */
        setSize(){
            //setSize stage
            this.stage.resize(this.container,this.ratio);
            this.stageWidth = this.stage.view.width;
            this.stageHeight = this.stage.view.height;
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
        //初始化网格
        initGrid(){
            this.grid = new Grid({x:0,y:0},this);
            this.grid.zindex=-1000000;
            this.grid.type="tool";
            this.grid.allowClick=false;
            this.grid.gap=100;
            this.spritesController.addSprite(this.grid);
        },
        //添加引导线
        initGuidewires(){
            this.guidewires = new Guidewires({x:0,y:0},this);
            this.guidewires.allowClick=false;
            this.guidewires.zindex=1000000;
            this.guidewires.type="tool";
            this.guidewires.visible=false;
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

