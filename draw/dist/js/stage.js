let stage={
    /**
     * 创造一个舞台
     * @param {*} container  容器
     */
    createStage(container){
        let stage=document.createElement("canvas");
        container.appendChild(stage);
        return stage;
    },
    /**
     * 更新舞台
     * @param {dom} container 
     * @param {number} ratio 
     */
    updataStage(stage,container,ratio){
        let stageWidth=container.clientWidth*ratio;
        let stageHeight=container.clientHeight*ratio;
        stage.width=stageWidth;
        stage.height=stageHeight;
        stage.style.zoom=1/ratio;
    }
};
export default stage;