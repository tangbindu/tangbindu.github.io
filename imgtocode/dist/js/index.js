// 工具
const tools = {
    ratio:2.0,
    drawGrid(ctx, width, height, gap) {
        ctx.save();
        ctx.lineWidth = .5;
        ctx.strokeStyle = "rgba(0,0,0,.2)";
        ctx.setLineDash([4, 4]);
        let y = 0;
        while (gap * y++ < height) {
            ctx.beginPath();
            ctx.moveTo(0, gap * y - .5);
            ctx.lineTo(width, gap * y - .5);
            ctx.stroke();
        }
        let x = 0;
        while (gap * x++ < width) {
            ctx.beginPath();
            ctx.moveTo(gap * x - .5, 0);
            ctx.lineTo(gap * x - .5, height);
            ctx.stroke();
        }
        ctx.restore();
    },
    clear(ctx, x, y, width, height) {
        ctx.clearRect(x, y, width, height);
    },
    drawImage(ctx,img,x,y,w,h){
        ctx.drawImage(img, x, y, w, h);
    },
    drawGuidewires(canvas, ctx, x, y, viewX, viewY,ratio,scale) {
        if(this.ratio==2){
            viewX=viewX%2==0?viewX:(++viewX)
            viewY=viewY%2==0?viewY:(++viewY)
        }
        var halfV=.5;
        const text = "("+viewX + ", " + viewY+")";
        const fontSize = this.ratio* 14;
        canvas.style.cursor = 'crosshair';
        //竖
        ctx.save();
        ctx.fillStyle = 'rgba(255,0,0,.8)';
        ctx.beginPath();
        ctx.moveTo(Math.round(x - 0.5-halfV), 0);
        ctx.lineTo(Math.round(x - 0.5+halfV), 0);
        ctx.lineTo(Math.round(x - 0.5+halfV), canvas.height);
        ctx.lineTo(Math.round(x - 0.5-halfV), canvas.height);
        ctx.closePath();
        ctx.fill();
        //横
        ctx.beginPath();
        ctx.moveTo(0, Math.round(y + 0.5-halfV));
        ctx.lineTo(0, Math.round(y + 0.5+halfV));
        ctx.lineTo(canvas.width, Math.round(y + 0.5+halfV));
        ctx.lineTo(canvas.width, Math.round(y + 0.5-halfV));
        ctx.closePath();
        ctx.fill();
        //相对坐标
        ctx.font = fontSize + 'px STHeiti, SimHei';
        ctx.fillText(
            text,
            Math.min(
                x + 20,
                canvas.width - text.length * fontSize/2
            ) - 10,
            Math.max(y - 10, 20*ratio));
        ctx.restore();
    },
    posEvent(event) {
        let x=event.clientX*this.ratio;
        let y=event.clientY*this.ratio;
        x=Math.round(x);
        y=Math.round(y);
        if(this.ratio==2){
            x=x%2==0?x:(++x)
            y=y%2==0?y:(++y)
        }
        return {x,y}
    },
    posDrawEvent(event,scale,coordinateOrigin) {
        let x=(event.clientX*this.ratio-coordinateOrigin.x)/scale;
        let y=(event.clientY*this.ratio-coordinateOrigin.y)/scale;
        if(this.ratio==2){
            x=x%2==0?x:(++x)
            y=y%2==0?y:(++y)
        }
        x=Math.round(x);
        y=Math.round(y);
        return {x,y}
    }
}

// 绘图 
class Graph {
    constructor(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.w=0;
        this.h=0;
        this.points = [];
        this.posStart = pos;
        this.posEnd = pos;
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = 'rgba(255,0,0,.2)';
        this.fillStyle = 'rgba(0,255,0,.2)';
        this.font = tools.ratio*10+'px STHeiti, SimHei';
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
    }
    updatePoints(i, pos) {

    }
    draw(ctx,scale,coordinateOrigin) {
        ctx.save();
        ctx.fillStyle = this.fillStyle;
        this.drawPath(ctx,scale,coordinateOrigin);
        this.fill(ctx);
        this.stroke(ctx,scale,coordinateOrigin);
        this.drawText(ctx,scale,coordinateOrigin);
        ctx.restore();
    }
    drawText(ctx,scale,coordinateOrigin){
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        let text="("+this.x+","+this.y+")"+"  "+this.w+"x"+this.h;
        // let text=this.w+"x"+this.h;
        ctx.fillText(
            text, 
            (this.points[0].x*scale+coordinateOrigin.x), 
            (this.points[0].y*scale+coordinateOrigin.y - 5)
        );
    }
    fill(ctx){
        this.isFill && ctx.fill();
    }
    stroke(ctx,scale,coordinateOrigin){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
    drawPath(){
    }
    isInPath(ctx, pos) {
    }
    drawPoints() {
    }
    createCode() {
    }
}
/**
* 矩形
*/
class Rect extends Graph {
    constructor(pos) {
        super(pos);
        this.points = [pos, pos, pos, pos];
        this.name = 'rect';
    }
    updatePoints(pos) {
        this.posEnd = pos;
        const x1 = this.posStart.x,
            y1 = this.posStart.y,
            x2 = this.posEnd.x,
            y2 = this.posEnd.y;
        this.w=Math.abs(x2-x1);
        this.h=Math.abs(y2-y1);
        this.points[0] = {
            x: x1,
            y: y1
        };
        this.points[1] = {
            x: x2,
            y: y1
        };
        this.points[2] = {
            x: x2,
            y: y2
        };
        this.points[3] = {
            x: x1,
            y: y2
        };
    }
    stroke(ctx,scale,coordinateOrigin){
        // ctx.beginPath();
        // this.points.forEach((p, i) => {
        //     ctx[i == 0 ? 'moveTo' : 'lineTo']((p.x)*scale+coordinateOrigin.x-.5, (p.y)*scale+coordinateOrigin.y-.5);
        // });
        // ctx.closePath();
    }
    drawPath(ctx,scale,coordinateOrigin) {
        ctx.beginPath();
        this.points.forEach((p, i) => {
            ctx[i == 0 ? 'moveTo' : 'lineTo']((p.x)*scale+coordinateOrigin.x-.5, (p.y)*scale+coordinateOrigin.y-.5);
        });
        ctx.closePath();
    }
}

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


window.addEventListener("resize", () => {
    imgToCode.refresh();
})

window.addEventListener("mousemove", (event) => {
    imgToCode.refresh();
    imgToCode.drawGuidewires(tools.posEvent(event))
})
window.addEventListener("mouseend", (event) => {
    imgToCode.refresh();
    imgToCode.drawGuidewires(tools.posEvent(event))
})


window.addEventListener("mousedown", (event) => {
    let newShape;
    if (imgToCode.drawShapeType == "rect") {
        newShape = new Rect(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
    }else{
        return;
    }
    imgToCode.shapes.push(newShape);
    const drawing = (event) => {
        newShape.updatePoints(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
    }
    const drawEnd = (event) => {
        newShape.updatePoints(tools.posDrawEvent(event,imgToCode.scale,imgToCode.coordinateOrigin));
        window.removeEventListener("mousemove", drawing);
        window.removeEventListener("mouseup", drawEnd);
        if((newShape.points[2].x-newShape.points[0].x)<10 & (newShape.points[2].y-newShape.points[0].y)<10){
            imgToCode.shapes.pop();
        }
    }
    window.addEventListener("mousemove", drawing);
    window.addEventListener("mouseup", drawEnd);
})


//前台-拖拽上传
window.document.addEventListener("dragenter", function(e) {
    e.stopPropagation();
    e.preventDefault();
}, false);
window.document.addEventListener("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();
}, false);
window.document.addEventListener("drop", function(e) {
    handleFile(e.dataTransfer.files);
    //获取图片
    function handleFile(files) {
        var i = 0;
        var reader = new FileReader();
        function readerFiles(i) {
            var file = files[i];
            if (i == files.length) { return false; }
            reader.onload = (function(theFile) {
                var imgData = theFile.srcElement.result;
                //这里接受图片
                const img=new Image();
                img.onload=()=>{
                    imgToCode.designImage={
                        src:img,
                        name:file.name
                    }
                }
                img.src=imgData;
                // readerFiles(++i);
            })
            reader.readAsDataURL(file);
        }
        readerFiles(i);
    }
    e.stopPropagation();
    e.preventDefault();
}, false);

document.onkeydown = function (event) {
    if (/Mac/.test(navigator.platform)) {
        if (event.keyCode == 187) {
            imgToCode.scale*=(1+5/75);
            imgToCode.gap = 100*imgToCode.ratio*imgToCode.scale;
            event.preventDefault();
        } else if (event.keyCode == 189) {
            imgToCode.scale*=(1-5/75);
            imgToCode.gap = 100*imgToCode.ratio*imgToCode.scale;
            event.preventDefault();
        }
    } else {

    }
}


//
// keyboardJS.bind('ctrl + a', function(e) {
//     e.preventDefault();
// });