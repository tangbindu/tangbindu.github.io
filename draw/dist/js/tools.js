/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:20:45
 * @FilePath: /draw_ts/src/ts/tools.ts
 * @Description:
 */
let tools = {
    //整数策略
    toInt(val) {
        return Math.round(val);
    },
    //绘制策略
    toDrawVal(val) {
        return Math.round(val) + .5;
    },
    //绝对像素 deviceWidth*devicePixelRatio
    toPixel(point, ratio) {
        return {
            x: point.x * ratio,
            y: point.y * ratio
        };
    },
    //逻辑像素
    toLogicPixel(point, ratio, scale, px, py) {
        let x = (point.x * ratio) / scale - px;
        let y = (point.y * ratio) / scale - py;
        return {
            x: tools.toInt(x),
            y: tools.toInt(y)
        };
    },
    //逻辑像素到devicePixel;
    // LogicPosToDevicePixel(){
    // },
    toLogicVector(vector, ratio, scale) {
        return {
            x: vector.x * ratio / scale,
            y: vector.y * ratio / scale
        };
    },
    clear(ctx, x, y, width, height) {
        ctx.clearRect(x, y, width, height);
    },
    //重置换rect的坐标
    resetRectPoint(rectShape) {
        let tempPoints = rectShape.points.sort(function (a, b) {
            return a.y - b.y;
        });
        rectShape.points = tempPoints.slice(0, 2).sort(function (a, b) {
            return a.x - b.x;
        }).concat(tempPoints.slice(2, 4).sort(function (a, b) {
            return b.x - a.x;
        }));
    },
    //获取中心点
    getCenterFromRect(rectShape, scale) {
        return {
            x: rectShape.width * .5 * scale,
            y: rectShape.height * .5 * scale
        };
        // return {
        //     x:rectShape.points[0].x+(rectShape.points[1].x-rectShape.points[0].x)*.5,
        //     y:rectShape.points[0].y+(rectShape.points[2].y-rectShape.points[0].y)*.5
        // }
    },
    //缩放ract的size
    scaleRectPoint(points, num) {
        let newPoint = [];
        newPoint.push({
            x: points[0].x + num,
            y: points[0].y + num
        });
        newPoint.push({
            x: points[1].x - num,
            y: points[1].y + num
        });
        newPoint.push({
            x: points[2].x - num,
            y: points[2].y - num
        });
        newPoint.push({
            x: points[3].x + num,
            y: points[3].y - num
        });
        return newPoint;
    },
    deepClone(obj) {
        if (typeof (obj) == "number" || typeof (obj) == "string") {
            return obj;
        }
        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if (obj[key] && typeof obj[key] === "object") {
                        objClone[key] = this.deepClone(obj[key]);
                    }
                    else {
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    },
    //磁性吸边效果
    magneticBorder(point, sprites, stepNum) {
        let x = Math.round(point.x / stepNum) * stepNum;
        let y = Math.round(point.y / stepNum) * stepNum;
        let sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            sprite.points && sprite.type == "default" && sprite.points.map((p) => {
                x = Math.abs(p.x - point.x) < stepNum ? p.x : x;
                y = Math.abs(p.y - point.y) < stepNum ? p.y : y;
            });
            if (sprite.name == "page_img") {
                x = Math.abs(sprite.width - point.x) < stepNum ? sprite.width : x;
                y = Math.abs(sprite.height - point.y) < stepNum ? sprite.height : y;
            }
        }
        point.x = x;
        point.y = y;
        return {
            x, y
        };
    },
    expandValueCount: 0,
    expandValueTimmer: 0,
    expandRatio: 0,
    //scaleValue
    expandValue(value) {
        tools.expandValueCount += 1;
        tools.expandRatio = Math.pow(1.5, tools.expandValueCount);
        tools.expandRatio = tools.expandRatio > 20 ? 20 : tools.expandRatio;
        value = value * tools.expandRatio;
        tools.expandValueTimmer && clearTimeout(tools.expandValueTimmer);
        tools.expandValueTimmer = setTimeout(function () {
            tools.expandValueCount = 0;
        }, 100);
        return value;
    },
};
export default tools;
//# sourceMappingURL=tools.js.map