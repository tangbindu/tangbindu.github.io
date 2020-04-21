class stage{
    /**
     * @param {node} container 
     * @param {number} ratio 
     */
    constructor(container,ratio){
        this.ratio=ratio;
        this.container=container;
        this.view=null;
        this.ctx=null;
        this.init();
    }
    /**
     * 初始化
     */
    init(){
        this.view=document.createElement("canvas");
        this.ctx = this.view.getContext("2d");
        document.getElementById("container").appendChild(this.view);
        this.resize(this.container,this.ratio);
    }
    /**
     * 重置尺寸
     * @param {node} container 
     * @param {number} ratio 
     */
    resize(container,ratio){
        this.view.width=this.container.clientWidth*this.ratio;
        this.view.height=this.container.clientHeight*this.ratio;
        this.view.style.zoom=1/this.ratio;
    }
};
export default stage;