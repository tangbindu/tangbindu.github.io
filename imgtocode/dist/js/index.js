import tools from "./tools.js";
import interact from "./interact.js";
import { Rect , Grid , Guidewires} from "./SpriteGraph.js";
import SpritesController from "./SpritesController.js";
import { Image } from "./SpriteImage.js";
import MEvent from "./MEvent.js"
import drawGraph from "./drawGraph.js"
import editGraph from "./editGraph.js"
import drawGuidewires from "./drawGuidewires.js"

window.imgToCode = new Vue({
    el: '#app',
    data: {
        workMode: "draw",
        uploadImage: null,//上传的图片
        //坐标原点位置
        coordinateOrigin: {
            x: 200,
            y: 200
        },
        drawShapeType: "rect",
        //舞台canvas
        stageCanvas: null,
        //舞台绘图对象
        stageCTX: null,
        ratio: 2.0,//视网膜屏比例
        scale: 1.0,
        stageWidth: null,
        stageHeight: null,
        gap: 100,//tools.ratio
        //event
        MEvent: null,
        spritesController:new SpritesController(),
        //选中的元素
        activeSprites: [],
        //鼠标标线
        guidewires:null,
        //网格线
        grid:null,
        //pageImage
        pageImage:null,
        //shift btn
        pressShiftBtn:false
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
        //scale变化了
        "scale": function () {
            this.MEvent.scale=this.scale;
            this.render();
        },
        //coordinateOrigin变化了
        "coordinateOrigin": function () {
            this.MEvent.coordinateOrigin=this.coordinateOrigin;
            this.render();
        },
        //绘制的图片变化了
        "uploadImage": function () {
            this.addImg()
        }
    },
    //方法
    methods: {
        // 初始化
        init() {
            //基础
            this.stageCanvas = document.getElementById("stage");
            this.stageCTX = this.stageCanvas.getContext("2d");
            //初始化画布尺寸
            this.resize();
            //界面
            this.initWindow();
            //鼠标交互--绘图等
            this.MEvent = new MEvent(this.stageCanvas,this.ratio,this.scale,this.coordinateOrigin);
            let self = this;
            this.MEvent.event(function () {
                //按住shifit
                switch (self.workMode) {
                    case "draw":
                        drawGraph(this,self);
                        break;
                    case "edit":
                        editGraph(this,self);
                        break;
                }
                //鼠标坐标线
                drawGuidewires(this,self);
                self.render();
            })
            //键盘交互-快捷键等
            interact(this);
            //默认进入绘图模式
            this.executeMode("draw")
        },
        executeMode(mode){
            switch (mode) {
                case "draw":
                    this.drawMode();
                    break;
                case "edit":
                    this.editMode();
                    break;
            }
            this.render();
            this.workMode=mode;
        },
        //绘图模式
        drawMode() {
            //显示鼠标标线
            this.guidewires.visible=true;
            this.stageCanvas.style.cursor = 'crosshair';
        },
        //编辑模式
        editMode() {
            //隐藏鼠标标线
            this.guidewires.visible=false;
            this.stageCanvas.style.cursor = 'default';
        },
        //初始化基础窗口
        initWindow(){
            //添加网格
            this.addGrid();
            //添加引导线
            this.addGuidewires();
        },
        //添加网格
        addGrid(){
            this.grid = new Grid({x:0,y:0});
            this.grid.zindex=-1000000;
            this.grid.type="tool";
            this.grid.allowClick=false;
            this.grid.width=this.stageCanvas.width;
            this.grid.height=this.stageCanvas.height;
            this.grid.gap=this.gap;
            this.spritesController.addSprite(this.grid);
        },
        //添加引导线
        addGuidewires(){
            this.guidewires = new Guidewires({x:0,y:0},0,0);
            this.guidewires.allowClick=false;
            this.guidewires.zindex=1000000;
            this.guidewires.type="tool";
            this.guidewires.visible=false;
            this.guidewires.width=this.stageCanvas.width;
            this.guidewires.height=this.stageCanvas.height;
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
        //渲染
        render() {
            this.clear();
            this.drawShapes();
        },
        //重制尺寸
        resize() {
            this.stageWidth = document.body.clientWidth * this.ratio;
            this.stageHeight = document.body.clientHeight * this.ratio;
            this.stageCanvas.width = this.stageWidth;
            this.stageCanvas.height = this.stageHeight;
            this.stageCanvas.style.zoom = (1 / this.ratio);
            if(this.grid && this.guidewires){
                this.grid.width=this.stageWidth;
                this.grid.height=this.stageHeight;
                this.guidewires.width=this.stageWidth;
                this.guidewires.height=this.stageHeight;
            }
        },
        //根据图片更新坐标原点
        updateCoordinateOriginByPageImage(){
            this.coordinateOrigin.x=this.pageImage.x;
            this.coordinateOrigin.y=this.pageImage.y;
        },
        //绘制图像
        drawShapes() {
            this.pageImage && this.updateCoordinateOriginByPageImage();
            this.spritesController.sprites.map((item) => {
                item.scale=this.scale;
                if(item.name!="page_img"){
                    item.translate=this.coordinateOrigin;
                }
                item.draw(
                    this.stageCTX,
                    this.ratio,
                    this.scale,
                    this.coordinateOrigin
                );
            })
        },
        //清空画布
        clear() {
            tools.clear(this.stageCTX, 0, 0, this.stageWidth, this.stageHeight);
        },
        //删除精灵
        deleteSprites(sprites){
            this.spritesController.deleteSprites(sprites);
            this.render()
        }
    }
})

