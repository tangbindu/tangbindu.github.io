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
        activeEle: null,
        designImage: null,//上传的图片
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
        //鼠标标线
        guidewires:null
    },
    created() {
    },
    mounted() {
        this.init();
        this.draw();
    },
    watch: {
        //scale变化了
        "scale": function () {
            this.draw();
        },
        //绘制的图片变化了
        "designImage": function () {
            this.draw();
        }
    },
    methods: {
        // 初始化
        init() {
            this.stageCanvas = document.getElementById("stage");
            this.stageCTX = this.stageCanvas.getContext("2d");
            this.resize();
            //界面
            this.initWindow();
            //交互
            this.MEvent = new MEvent(this.stageCanvas);
            this.executeModel();
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
            let grid = new Grid({x:0,y:0});
            grid.width=this.stageCanvas.width;
            grid.height=this.stageCanvas.height;
            grid.gap=this.gap;
            this.spritesController.addSprite(grid);
        },
        //添加引导线
        addGuidewires(){
            this.guidewires = new Guidewires({x:0,y:0},0,0);
            this.guidewires.visible=false;
            this.guidewires.width=this.stageCanvas.width;
            this.guidewires.height=this.stageCanvas.height;
            this.spritesController.addSprite(this.guidewires);
        },
        //初始化鼠标交互
        executeModel() {
            let that = this;
            this.MEvent.event(function () {
                let me = this;
                switch (that.workMode) {
                    case "draw":
                        that.drawModel(me);
                        break;
                    case "edit":
                        that.editModel(me);
                        break;
                }
                that.draw();
            })
        },
        //绘图模式
        drawModel(me) {
            //显示鼠标标线
            this.guidewires.visible=true;
            let point = me.curPos;
            let type = me.type;
            let lastSpape;
            point=tools.posToDrawPixel(
                point,
                this.ratio,
                this.scale,
                this.coordinateOrigin
            );
            //坐标转换
            if (type == "down") {
                switch (this.drawShapeType) {
                    case "rect":
                        let newShape = new Rect(point);
                        this.spritesController.addSprite(newShape);
                        break;
                }
            }
            lastSpape = this.spritesController.getLastSprite();
            if (type == "move") {
                lastSpape && lastSpape.updatePoints(point)
            }
            if (type == "up") {
                // 剔除过小的图形
                if (
                    lastSpape && 
                    (lastSpape.points[2].x - lastSpape.points[0].x) < 30 && 
                    (lastSpape.points[2].y - lastSpape.points[0].y) < 30
                ) {
                    this.SpritesController.removeLastSprite();
                }
            }
        },
        //编辑模式
        editModel(me) {
            //隐藏鼠标标线
            this.guidewires.visible=false;
            let point = me.curPos;
            let type = me.type;
            let moveVector=me.moveVector;
            //坐标转换
            point=tools.toPixel(point,this.ratio);
            moveVector=tools.vectorToEdit(moveVector,this.ratio,this.scale);
            if (type == "down") {
                //获取到点击的元素
                this.activeEle=this.spritesController.getClickSprite(this.stageCTX,point)
            }
            if (type == "move") {
                this.activeEle && this.activeEle.move(moveVector)
            }
            if (type == "up") {
                this.activeEle = null;
            }
        },
        //绘制入口
        draw() {
            this.clear();
            this.drawDesignImage();
            this.drawShapes();
        },
        //绘制图片
        drawDesignImage() {
            if (this.designImage) {
                let w = this.designImage.src.width * imgToCode.scale;
                let h = this.designImage.src.height * imgToCode.scale;
                const x = (this.stageWidth - w) * .5;
                const y = Math.max(
                    (this.stageHeight - h) * .5
                    , 20 * this.ratio
                );
                this.coordinateOrigin = {
                    "x": tools.toInt(x),
                    "y": tools.toInt(y)
                }
                tools.drawImage(
                    this.stageCTX,
                    this.designImage.src,
                    x,
                    y,
                    w,
                    h
                );
            }
        },
        //重制尺寸
        resize() {
            this.stageWidth = document.body.clientWidth * this.ratio;
            this.stageHeight = document.body.clientHeight * this.ratio;
            this.stageCanvas.width = this.stageWidth;
            this.stageCanvas.height = this.stageHeight;
            this.stageCanvas.style.zoom = (1 / this.ratio);
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
interact(imgToCode);
