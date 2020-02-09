class SpritesController{
    constructor(){
        //click的元素
        this.clickSprites=[];
        this.lastSprite=null;
        this.sprites=[];
        this.supportMultipleClick=false;
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
        this.clickSprites=this.supportMultipleClick?this.clickSprites:[];
        for(var i=(this.sprites.length-1);i>=0;i--){
            if(!this.sprites[i].allowClick){
                continue;
            }
            this.sprites[i].active = this.supportMultipleClick ? this.sprites[i].active : false;
            this.sprites[i].draw(ctx);  
            if (this.sprites[i].isInPath(ctx, point)) {
                if(this.supportMultipleClick){
                    !this.sprites[i].active && this.clickSprites.push(this.sprites[i]);
                    this.sprites[i].active=true;
                }else{
                    this.sprites[i].active=true;
                    this.clickSprites=[this.sprites[i]];
                }
                break;
            }
        }
        return this.clickSprites;
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
    deleteSprites(){
        this.clickSprites.map((a)=>{
            let index=this.sprites.findIndex((b)=>{
                return a==b;
            })
            index>-1 && this.sprites.splice(index,1)
        })
    }
    //移动
    moveSprites(moveVector){
        this.clickSprites.map((item)=>{
            item.active && item.move(moveVector);
        });
    }

}
export default SpritesController;