class SpritesController{
    constructor(){
        this.activeSprites=[];
        this.lastSprite=null;
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
        this.activeSprites=[];
        for(var i=0;i<this.sprites.length;i++){
            this.sprites[i].active = false;
            if(!this.sprites[i].allowClick){
                continue;
            }
            this.sprites[i].draw(ctx);
            if (this.sprites[i].isInPath(ctx, point)) {
                this.activeSprites=this.sprites[i];
            }
        }
        if(this.activeSprites){
            this.activeSprites.active=true;
        }
        return this.activeSprites;
    }
    //选择多个
    //增加
    addSprite(sprite){
        this.sprites.push(sprite);
        this.sprites.sort((a,b)=>{
            return a.zindex-b.zindex;
        })
        this.lastSprite=sprite;
    }
    //获取最后一个
    getLastSprite(){
        return this.sprites[this.sprites.length - 1]
    }
    //移除最后一个
    removeLastSprite(){
        let lastSpriteIndex=this.sprites.findIndex((item)=>{
            return item==this.lastSprite
        });
        this.sprites.splice(lastSpriteIndex,1);
    }
    //删除精灵
    deleteSprites(sprites){
        sprites.map((a)=>{
            let index=this.sprites.findIndex((b)=>{
                return a==b;
            })
            index>-1 && this.sprites.splice(index,1)
        })
    }
    //移动

}
export default SpritesController;