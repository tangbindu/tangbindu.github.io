
// 工具
const tools = {
    ratio:1.0,
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
    drawGuidewires(canvas, ctx, x, y, viewX, viewY) {
        const text = viewX + ", " + viewY;
        const fontSize = this.ratio* 14;
        canvas.style.cursor = 'crosshair';
        ctx.save();
        ctx.strokeStyle = 'rgba(255,0,0,1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x - 0.5, 0);
        ctx.lineTo(x - 0.5, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y - 0.5);
        ctx.lineTo(canvas.width, y - 0.5);
        ctx.stroke();
        //相对坐标
        ctx.font = fontSize + 'px STHeiti, SimHei';
        ctx.fillText(
            text,
            Math.min(
                x + 20,
                canvas.width - text.length * fontSize
            ) - 10,
            Math.max(y - 10, 40));
        ctx.restore();
    },
    posEvent(event) {
        return {
            x: event.clientX*this.ratio,
            y: event.clientY*this.ratio
        }
    }
}

// 绘图 
class Graph {
    constructor(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.points = [];
        this.posStart = pos;
        this.posEnd = pos;
        //draw config
        this.lineWidth = 1;
        this.strokeStyle = '#f00';
        this.fillStyle = 'rgba(0,255,0,.1)';
        this.font = tools.ratio*14+"px Georgia";
        this.fontColor = 'rgba(255,0,0,1)';
        this.isFill = true;
    }
    updatePoints(i, pos) {

    }
    draw(ctx) {
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        this.drawPath(ctx);
        this.isFill && ctx.fill();
        ctx.font = this.font;
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.name, this.points[0].x + 5, this.points[0].y - 5);
        ctx.restore();
    }
    drawPath(ctx) {
        ctx.beginPath();
        this.points.forEach((p, i) => {
            ctx[i == 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
        });
        ctx.closePath();
        ctx.stroke();
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
        const x1 = Math.round(this.posStart.x),
            y1 = Math.round(this.posStart.y),
            x2 = Math.round(this.posEnd.x),
            y2 = Math.round(this.posEnd.y);
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
}


var imgToCode = new Vue({
    el: '#app',
    data: {
        shapes: [],
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
        gap: 100
    },
    created() {
    },
    mounted() {
        this.init();
        this.refresh();
    },
    watch: {
        "gap": function (val) {
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
            this.drawShapes();
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
                item.draw(this.stageCTX);
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
            tools.drawGuidewires(
                this.stageCanvas,
                this.stageCTX,
                clientX,
                clientY,
                clientX - this.coordinateOrigin.x * this.ratio,
                clientY - this.coordinateOrigin.y * this.ratio
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


window.addEventListener("mousedown", (event) => {
    let newShape;
    if (!imgToCode.drawShapeType) {
        return;
    } else if (imgToCode.drawShapeType == "rect") {
        newShape = new Rect(tools.posEvent(event));
    }
    imgToCode.shapes.push(newShape);
    const drawing = (event) => {
        newShape.updatePoints(tools.posEvent(event));
        newShape.draw(imgToCode.stageCTX);
    }
    const drawEnd = (event) => {
        newShape.updatePoints(tools.posEvent(event));
        window.removeEventListener("mousemove", drawing);
        window.removeEventListener("mouseup", drawEnd);
    }
    window.addEventListener("mousemove", drawing);
    window.addEventListener("mouseup", drawEnd);
})

document.onkeydown = function (event) {
    if (/Mac/.test(navigator.platform)) {
        if (event.keyCode == 187) {
            imgToCode.gap += 5;
            event.preventDefault();
        } else if (event.keyCode == 189) {
            imgToCode.gap -= 5;
            event.preventDefault();
        }
    } else {

    }
}


//
// keyboardJS.bind('ctrl + a', function(e) {
//     e.preventDefault();
// });