import eventTarget from "./eventTarget.js";

// 绘图 
class Sprite extends eventTarget{
    config: any;
    //精力类型，默认sprite
    type: string;
    //id
    id: string;
    //名字
    name: string;
    //坐标x
    x: number;
    //坐标y
    y: number;
    //宽
    width: number;
    //高
    height: number;
    //层级
    index: number;
    //激活态
    active: boolean;
    //平移
    translate: any;
    //层级
    zindex: any;//层级
    //是否可见，不可见就不可点击
    visible: any;
    //使用拖拽
    useDrag: any;
    //可以点击
    allowClick: any;
    //父亲
    parent: any;
    //相对坐标
    relativePosition: any;
    //构造
    constructor(config) {
        super();
        //类型，默认sprite
        this.type= config.type || "default";
        //id
        this.id= config.id || "";
        //name
        this.name= config.name || "";
        //x坐标
        this.x = this.config.x || 0;
        //y坐标
        this.y = this.config.y || 0;
        //width
        this.width= config.width || 0;
        //height
        this.height= config.height || 0;
        //层级
        this.index= config.index || 100;
        //选中
        this.active= config.active || false;
        //位移
        this.translate= config.translate || [0,0];
        //zindex
        this.zindex= config.zindex || 0;
        //useDrag
        this.useDrag= config.useDrag || false;
        //allowClick
        this.allowClick= config.allowClick!=undefined? this.config.allowClick : true;
        //click event
        //parent 只支持一级
        this.parent= config.parent || null;
        //相对父元素的定位
        this.relativePosition= config.relativePosition || [.5,.5];
        //visible 
        this.visible= config.visible!=undefined? this.config.visible : true;
    }
    /**
     * 移动
     * @param {vector} vector 
     */
    move(vector){
        this.x+=vector[0];
        this.y+=vector[1];
    }
    /**
     * 移动到一个点
     */
    moveTo(point){
        this.x=point.x;
        this.y=point.y;
    }
    /**
     * 计算相对位置
     */
    // calculateRelativePosition(){
    //     let offsetX=this.relativePosition[2] || 0;
    //     let offsetY=this.relativePosition[3] || 0;
    //     if(this.parent){
    //         this.x=this.parent.x+this.parent.width*this.relativePosition[0]-this.width*.5+offsetX;
    //         this.y=this.parent.y+this.parent.height*this.relativePosition[1]-this.height*.5+offsetY;
    //     }
    // }
    /**
     * 设置缩放
     * @param {numner} scaleVal
     */
    // setScale(scaleVal){
    //     //考虑缩放点
    //     this.scale=scaleVal;
    //     let ow=this.width;
    //     let oh=this.height;
    //     this.width=this.width*scaleVal;
    //     this.height=this.height*scaleVal;
    //     this.x-=((this.width-ow)*this.rotationOrigin[0])
    //     this.y-=((this.height-oh)*this.rotationOrigin[1])
    // }
}
export default Sprite;
