import tools from "./tools.js";
import interact from "./interact.js";
import { Rect , Grid , Guidewires} from "./SpriteGraph.js";
import SpritesController from "./SpritesController.js";
// import { Image } from "./SpriteImage.js";
import MEvent from "./MEvent.js"
window.imgToCode = new Vue({
    el: '#app',
    data: {
        workMode: "draw",
        designImage: null,//上传的图片
        //坐标原点位置
        coordinateOrigin: {
            x: 0,
            y: 0
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
        activeElem: null,
        //鼠标标线
        guidewires:null,
        //网格线
        grid:null
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
            this.render();
        },
        //绘制的图片变化了
        "designImage": function () {
            this.render();
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
            this.MEvent = new MEvent(this.stageCanvas);
            let self = this;
            this.MEvent.event(function () {
                switch (self.workMode) {
                    case "draw":
                        self.drawGraph(this);
                        break;
                    case "edit":
                        self.editGraph(this);
                        break;
                }
                self.drawGuidewires(this);
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
            this.grid.width=this.stageCanvas.width;
            this.grid.height=this.stageCanvas.height;
            this.grid.gap=this.gap;
            this.spritesController.addSprite(this.grid);
        },
        //添加引导线
        addGuidewires(){
            this.guidewires = new Guidewires({x:0,y:0},0,0);
            this.guidewires.visible=false;
            this.guidewires.width=this.stageCanvas.width;
            this.guidewires.height=this.stageCanvas.height;
            this.spritesController.addSprite(this.guidewires);
        },
        //绘制鼠标标线
        drawGuidewires(me){
            if(me.type=="move"){
                let point=me.curPos;
                let LogicPoint;
                //处理引导线 start
                LogicPoint=tools.toLogicPixel(
                    point,
                    this.ratio,
                    this.scale,
                    this.coordinateOrigin
                );
                point=tools.toPixel(point,this.ratio);
                this.guidewires.x=point.x;
                this.guidewires.y=point.y;
                this.guidewires.viewX=LogicPoint.x;
                this.guidewires.viewY=LogicPoint.y;
            }
        },
        drawGraph(me){
            let point = me.curPos;
            let type = me.type;
            point=tools.toLogicPixel(
                point,
                this.ratio,
                this.scale,
                this.coordinateOrigin
            );
            //坐标转换
            if (type == "down") {
                switch (this.drawShapeType) {
                    case "rect":
                        this.newShape = new Rect(point);
                        this.spritesController.addSprite(this.newShape);
                        break;
                }
            }
            if (type == "move" && me.isMoving) {
                this.newShape && this.newShape.updatePoints(point)
            }
            if (type == "up") {
                // 剔除过小的图形
                if (
                    (this.newShape.points[2].x - this.newShape.points[0].x) < 30 && 
                    (this.newShape.points[2].y - this.newShape.points[0].y) < 30
                ) {
                    this.spritesController.removeLastSprite();
                }
                this.newShape=null;
            }
        },
        editGraph(me){
            let point = me.curPos;
            let type = me.type;
            let moveVector=me.moveVector;
            //坐标转换
            point=tools.toPixel(point,this.ratio);
            if (type == "down") {
                //获取到点击的元素
                this.activeElem=this.spritesController.getClickSprite(this.stageCTX,point);
            }
            if (type == "move" && me.isMoving) {
                moveVector=tools.vectorToEdit(moveVector,this.ratio,this.scale);
                this.activeElem  && this.activeElem.move(moveVector)
            }
            if (type == "up") {
                this.activeElem = null;
            }
        },
        //渲染
        render() {
            this.clear();
            // this.drawDesignImage();
            this.drawShapes();
        },
        //绘制图片
        // drawDesignImage() {
        //     if (this.designImage) {
        //         let w = this.designImage.src.width * imgToCode.scale;
        //         let h = this.designImage.src.height * imgToCode.scale;
        //         const x = (this.stageWidth - w) * .5;
        //         const y = Math.max(
        //             (this.stageHeight - h) * .5
        //             , 20 * this.ratio
        //         );
        //         this.coordinateOrigin = {
        //             "x": tools.toInt(x),
        //             "y": tools.toInt(y)
        //         }
        //         tools.drawImage(
        //             this.stageCTX,
        //             this.designImage.src,
        //             x,
        //             y,
        //             w,
        //             h
        //         );
        //     }
        // },
        //重制尺寸
        resize() {
            this.stageWidth = document.body.clientWidth * this.ratio;
            this.stageHeight = document.body.clientHeight * this.ratio;
            this.stageCanvas.width = this.stageWidth;
            this.stageCanvas.height = this.stageHeight;
            this.stageCanvas.style.zoom = (1 / this.ratio);
            if(this.grid){
                this.grid.width=this.stageWidth;
                this.grid.height=this.stageHeight;
            }
        },
        //绘制图像
        drawShapes() {
            this.spritesController.sprites.map((item) => {
                item.scale=this.scale;
                item.translate=this.coordinateOrigin;
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
        }
    }
})

