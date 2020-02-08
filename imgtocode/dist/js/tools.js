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
        let x=this.toInt(point.x*ratio);
        let y=this.toInt(point.y*ratio);
        return {x,y}
    },
    //逻辑像素
    toLogicPixel(point,ratio,scale,coordinateOrigin){
        let x=(point.x*ratio)/scale-coordinateOrigin.x;
        let y=(point.y*ratio)/scale-coordinateOrigin.y;
        return {
            x:this.toInt(x),
            y:this.toInt(y)
        }
    },
    //逻辑像素到devicePixel;
    LogicPixelToDevicePixel(point,ratio,scale,coordinateOrigin){
        let x=point.x*scale+coordinateOrigin.x*scale;
        let y=point.y*scale+coordinateOrigin.y*scale;
        return {x,y}
    },
    vectorToPixel(vector,ratio,scale){
        return [
            this.toInt(vector[0]*ratio/scale),
            this.toInt(vector[1]*ratio/scale)
        ]
    },
    clear(ctx, x, y, width, height) {
        ctx.clearRect(x, y, width, height);
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
    },
    //磁性吸边效果
    magneticBorder(point,sprites,stepNum){
        let x=Math.round(point.x/stepNum)*stepNum;
        let y=Math.round(point.y/stepNum)*stepNum;
        let sprite;
        for(var i=0;i<sprites.length;i++){
            sprite=sprites[i];
            sprite.points && sprite.type=="default" && sprite.points.map((p)=>{
                x=Math.abs(p.x-point.x)<stepNum?p.x : x;
                y=Math.abs(p.y-point.y)<stepNum?p.y : y;
            })
            if(sprite.name=="page_img"){
                x=Math.abs(sprite.width-point.x)<stepNum?sprite.width : x;
                y=Math.abs(sprite.height-point.y)<stepNum?sprite.height : y;
            }
        }
        point.x=x;
        point.y=y;
        return {
            x,y
        }
    }
};
export default tools;