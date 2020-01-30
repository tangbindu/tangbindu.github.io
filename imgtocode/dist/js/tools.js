let tools={
    //整数策略
    toInt(val){
        return Math.round(val)
    },
    //绘制策略
    toDrawVal(val){
        // console.log(val+.5)
        return val+.5;
    },
    //点到local原点的距离
    toLocalOriginDistance(localOriginPoint,curPoint){
        return {
            x:curPoint.x-localOriginPoint.x,
            y:curPoint.y-localOriginPoint.y
        }
    },
    //移动point array
    // movePoints(points,moveVector){
    //     points.map((item)=>{
    //         item.x+=moveVector[0];
    //         item.y+=moveVector[1];
    //     })
    // },
    //point in shape
    //转换mouse坐标
    posEvent(event,ratio) {
        let x=event.clientX*ratio;
        let y=event.clientY*ratio;
        return {x,y}
    },
    posToEdit(point,ratio) {
        let x=point.x*ratio;
        let y=point.y*ratio;
        return {x,y}
    },
    vectorToEdit(vector,ratio){
        return [vector[0]*ratio,vector[1]*ratio]
    },
    //mouse换算到新坐标系
    posToDraw(point,scale,coordinateOrigin) {
        let x=(point.x-coordinateOrigin.x)/scale;
        let y=(point.y-coordinateOrigin.y)/scale;
        return {
            x:this.toInt(x),
            y:this.toInt(y)
        }
    },
    posDraw(point,ratio,scale,coordinateOrigin) {
        let x=(point.x*ratio-coordinateOrigin.x)/scale;
        let y=(point.y*ratio-coordinateOrigin.y)/scale;
        return {
            x:this.toInt(x),
            y:this.toInt(y)
        }
    },
    drawGrid(ctx, width, height, gap ,scale) {
        gap=this.toInt(gap*scale);
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,.2)";
        let y = 0;
        while (gap * y < height) {
            ctx.beginPath();
            ctx.moveTo(0, this.toDrawVal(gap * y));
            ctx.lineTo(width, this.toDrawVal(gap * y));
            ctx.stroke();
            ++y;
        }
        let x = 0;
        while (gap * x < width) {
            ctx.beginPath();
            ctx.moveTo(this.toDrawVal(gap * x), 0);
            ctx.lineTo(this.toDrawVal(gap * x), height);
            ctx.stroke();
            x++;
        }
        ctx.restore();
    },
    clear(ctx, x, y, width, height) {
        ctx.clearRect(x, y, width, height);
    },
    drawImage(ctx,img,x,y,w,h){
        ctx.drawImage(img, x, y, w, h);
    },
    //引导线
    drawGuidewires(canvas, ctx, x, y, viewX, viewY,ratio, scale) {
        viewX=this.toInt(viewX);
        viewY=this.toInt(viewY);
        const text = "("+viewX + ", " + viewY+")";
        const fontSize = ratio* 14;
        canvas.style.cursor = 'crosshair';
        //竖
        ctx.save();
        ctx.fillStyle = 'rgba(255,0,0,.8)';
        ctx.beginPath();
        ctx.moveTo(this.toDrawVal(x), this.toDrawVal(0));
        ctx.lineTo(this.toDrawVal(x+scale), this.toDrawVal(0));
        ctx.lineTo(this.toDrawVal(x+scale), this.toDrawVal(canvas.height));
        ctx.lineTo(this.toDrawVal(x), this.toDrawVal(canvas.height));
        ctx.closePath();
        ctx.fill();
        //横
        ctx.beginPath();
        ctx.moveTo(this.toDrawVal(0), this.toDrawVal(y));
        ctx.lineTo(this.toDrawVal(0), this.toDrawVal(y+scale));
        ctx.lineTo(this.toDrawVal(canvas.width), this.toDrawVal(y+scale));
        ctx.lineTo(this.toDrawVal(canvas.width), this.toDrawVal(y));
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
    //重置换rect的坐标
    resetRectPoint(rectShape){
        let tempPoints=rectShape.points.sort(function(a,b){
            return a.y-b.y
        })
        rectShape.points=tempPoints.slice(0,2).sort(function(a,b){
            return a.x-b.x
        }).concat(tempPoints.slice(2,4).sort(function(a,b){
            return b.x-a.x
        }))
    },
    //获取中心点
    getCenterFromRect(rectShape){
        return {
            x:rectShape.points[0].x+(rectShape.points[1].x-rectShape.points[0].x)*.5,
            y:rectShape.points[0].y+(rectShape.points[2].y-rectShape.points[0].y)*.5
        }
    },
    //缩放ract的size
    scaleRectPoint(points,num){
        let newPoint=[];
        newPoint.push({
            x:points[0].x+num,
            y:points[0].y+num
        })
        newPoint.push({
            x:points[1].x-num,
            y:points[1].y+num
        })
        newPoint.push({
            x:points[2].x-num,
            y:points[2].y-num
        })
        newPoint.push({
            x:points[3].x+num,
            y:points[3].y-num
        })
        return newPoint;
    }
};
export default tools;