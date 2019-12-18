import tools from "./tools.js";
import interact from "./interact.js";

var imgToCode = new Vue({
    el: '#app',
    data: {
        workMode: "drawing",
        shapes: [],//绘图集合
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
        scale: 1.0,
        stageWidth: null,
        stageHeight: null,
        gap: 100*tools.ratio
    },
    created() {
    },
    mounted() {
        this.init();
        this.refresh();
    },
    watch: {
        "gap": function () {
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
                const x=(this.stageWidth-this.designImage.src.width*imgToCode.scale)*.5;
                const y=Math.max(
                    (this.stageHeight-this.designImage.src.height*imgToCode.scale)*.5
                    ,20*this.ratio
                );
                this.coordinateOrigin={
                    "x":Math.round(x),
                    "y":Math.round(y)
                }
                tools.drawImage(
                    this.stageCTX,
                    this.designImage.src,
                    x,
                    y,
                    this.designImage.src.width*imgToCode.scale,
                    this.designImage.src.height*imgToCode.scale
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
            tools.drawGrid(this.stageCTX, this.stageWidth, this.stageHeight, this.gap / this.ratio);
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
        //绘制辅助线
        drawGuidewires(pos) {
            const clientX = pos.x;
            const clientY = pos.y;
            let viewX=(clientX - this.coordinateOrigin.x)/this.scale;
            let viewY=(clientY - this.coordinateOrigin.y)/this.scale;
            viewX=Math.round(viewX);
            viewY=Math.round(viewY);
            tools.drawGuidewires(
                this.stageCanvas,
                this.stageCTX,
                clientX,
                clientY,
                viewX,
                viewY,
                this.ratio,
                this.scale
            )
        }
    }
})

interact(imgToCode);
