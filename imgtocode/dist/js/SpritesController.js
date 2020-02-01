class SpritesController{
    constructor(){
        this.sprites=[];
    }
    //队列问题
    //删除问题
    //全选
    //选择-id
    getSpriteById(id){
        var sprite=null;
        this.sprites.map((item) => {
            if(item.id==id){
               sprite=item;
            }
        })
        return sprite;
    }
    //获取点击的元素
    getClickSprite(ctx,point){
        let activeEle=null;
        this.sprites.map((item) => {
            item.draw(ctx);
            item.active = false;
            if (item.isInPath(ctx, point)) {
                activeEle = item;
            }
        })
        return activeEle;
    }
    //选择多个
    //增加
    addSprite(sprite){
        this.sprites.push(sprite)
    }
    //获取最后一个
    getLastSprite(){
        return this.sprites[this.sprites.length - 1]
    }
    //移除最后一个
    removeLastSprite(){
        this.sprites.pop();
    }
}
export default SpritesController;