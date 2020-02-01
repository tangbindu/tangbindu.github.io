let tools={
    //整数策略
    toInt(val){
        return Math.round(val)
    },
    //绘制策略
    toDrawVal(val){
        return val+.5;
    },
    //绝对像素 deviceWidth*devicePixelRatio
    toPixel(point,ratio){
        let x=point.x*ratio;
        let y=point.y*ratio;
        return {x,y}
    },
    //逻辑像素
    toLogicPixel(point,ratio,scale,coordinateOrigin){
        let x=point.x*ratio;
        let y=point.y*ratio;
        x=(x-coordinateOrigin.x)/scale;
        y=(y-coordinateOrigin.y)/scale;
        return {
            x:this.toInt(x),
            y:this.toInt(y)
        }
        
    },
    //位置到绘制像素
    posToDrawPixel(point,ratio,scale,coordinateOrigin){
        let x=point.x*ratio;
        let y=point.y*ratio;
        return {
            x:this.toInt(x/scale-coordinateOrigin.x),
            y:this.toInt(y/scale-coordinateOrigin.y)
        }
    },
    vectorToEdit(vector,ratio,scale){
        return [
            this.toInt(vector[0]*ratio/scale),
            this.toInt(vector[1]*ratio/scale)
        ]
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
    clear(ctx, x, y, width, height) {
        ctx.clearRect(x, y, width, height);
    },
    drawImage(ctx,img,x,y,w,h){
        ctx.drawImage(img, x, y, w, h);
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