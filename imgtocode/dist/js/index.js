import tools from "./tools.js";
import interact from "./interact.js";
import {Rect} from "./graph.js";

window.imgToCode = new Vue({
    el: '#app',
    data: {
        workMode: "draw",
        shapes: [],//绘图集合
        activeShapes:[],
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
        ratio: tools.ratio,//视网膜屏比例
        scale: 2.0,
        stageWidth: null,
        stageHeight: null,
        gap: 100//tools.ratio
    },
    created() {
    },
    mounted() {
        this.init();
        this.refresh();
    },
    watch: {
        "scale": function () {
            this.refresh();
        },
        "designImage": function(){
            this.refresh();
        }
    },
    methods: {
        init() {
            this.stageCanvas = document.getElementById("stage");
            this.stageCTX = this.stageCanvas.getContext("2d");
        },
        //刷新
        refresh() {
            this.resize();
            this.clear();
            this.drawGrid();
            this.drawDesignImage();
            this.drawShapes();
        },
        //绘制图片
        drawDesignImage(){
            if(this.designImage){
                let w=this.designImage.src.width*imgToCode.scale;
                let h=this.designImage.src.height*imgToCode.scale;
                const x=(this.stageWidth-w)*.5;
                const y=Math.max(
                    (this.stageHeight-h)*.5
                    ,20*this.ratio
                );
                this.coordinateOrigin={
                    "x":tools.toInt(x),
                    "y":tools.toInt(y)
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
        //绘制网格
        drawGrid() {
            tools.drawGrid(this.stageCTX, this.stageWidth, this.stageHeight, this.gap, this.scale);
        },
        //绘制图像
        drawShapes(){
            this.shapes.map((item)=>{
                item.draw(this.stageCTX,this.scale,this.coordinateOrigin);
            })
        },
        //清空画布
        clear() {
            tools.clear(this.stageCTX, 0, 0, this.stageWidth, this.stageHeight);
        },
        mouseEvent(type,point){
            if(this.workMode=="draw"){
                if ((type=="mousedown") && (imgToCode.drawShapeType == "rect")) {
                    let newShape = new Rect(
                        tools.posDraw(
                            point,
                            imgToCode.scale,
                            imgToCode.coordinateOrigin
                        )
                    );
                    imgToCode.shapes.push(newShape);
                }
                if(type=="mousemove"){
                    imgToCode.shapes[imgToCode.shapes.length-1].updatePoints(
                        tools.posDraw(
                            point,
                            imgToCode.scale,
                            imgToCode.coordinateOrigin
                        )
                    )
                }
                if(type=="mouseup"){
                    // 剔除过小的图形
                    // if((newShape.points[2].x-newShape.points[0].x)<10 & (newShape.points[2].y-newShape.points[0].y)<10){
                    //     imgToCode.shapes.pop();
                    // }
                }
            }
        }
    }
})
console.dir(imgToCode);
interact(imgToCode);
