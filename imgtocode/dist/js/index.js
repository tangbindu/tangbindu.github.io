import tools from "./tools.js";
import interact from "./interact.js";
import { Rect , Grid , Guidewires} from "./SpriteGraph.js";
import SpriteController from "./SpriteController.js";
// import { Image } from "./SpriteImage.js";
import MEvent from "./MEvent.js"
window.imgToCode = new Vue({
    el: '#app',
    data: {
        workMode: "draw",
        shapes: [],//绘图集合
        activeShapes: [],
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
        MEvent: null
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
        initWindow(){
            //添加网格
            this.addGrid();
            this.addGuidewires();
        },
        //添加网格
        addGrid(){
            let grid = new Grid({x:0,y:0});
            grid.width=this.stageCanvas.width;
            grid.height=this.stageCanvas.height;
            grid.gap=100;
            this.shapes.push(grid);
        },
        //添加引导线
        addGuidewires(){
            let grid = new Guidewires({x:100,y:100},0,0);
            grid.width=this.stageCanvas.width;
            grid.height=this.stageCanvas.height;
            grid.gap=100;
            this.shapes.push(grid);
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
            let point = me.curPos;
            let type = me.type;
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
                        this.shapes.push(newShape);
                        break;
                }
            }
            let lastSpape = this.shapes[this.shapes.length - 1];
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
                    this.shapes.pop();
                }
            }
        },
        //编辑模式
        editModel(me) {
            let point = me.curPos;
            let type = me.type;
            let moveVector=me.moveVector;
            //坐标转换
            point=tools.toPixel(point,this.ratio);
            moveVector=tools.vectorToEdit(moveVector,this.ratio,this.scale);
            if (type == "down") {
                //获取到点击的元素
                this.shapes.map((item) => {
                    item.draw(this.stageCTX);
                    item.active = false;
                    if (item.isInPath(this.stageCTX, point)) {
                        this.activeEle = item;
                    }
                })
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
            this.shapes.map((item) => {
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
