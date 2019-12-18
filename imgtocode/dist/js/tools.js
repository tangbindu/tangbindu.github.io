let tools={
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
    //引导线
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
    //转换mouse坐标
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
    //mouse换算到新坐标系
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
    },
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