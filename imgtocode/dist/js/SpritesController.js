class SpritesController{
    constructor(){
        //click的元素
        this.activeSprites=[];
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
    // getClickSprite(ctx,point){
    //     this.activeSprites=this.supportMultipleClick?this.activeSprites:[];
    //     for(var i=(this.sprites.length-1);i>=0;i--){
    //         if(!this.sprites[i].allowClick){
    //             continue;
    //         }
    //         this.sprites[i].active = this.supportMultipleClick ? this.sprites[i].active : false;
    //         this.sprites[i].draw(ctx);  
    //         if (this.sprites[i].isInPath(ctx, point)) {
    //             if(this.supportMultipleClick){
    //                 !this.sprites[i].active && this.activeSprites.push(this.sprites[i]);
    //                 this.sprites[i].active=true;
    //             }else{
    //                 this.sprites[i].active=true;
    //                 this.activeSprites=[this.sprites[i]];
    //             }
    //             break;
    //         }
    //     }
    //     return this.activeSprites;
    // }
    getClickSprite(ctx,point){
        for(var i=(this.sprites.length-1);i>=0;i--){
            if(!this.sprites[i].allowClick){
                continue;
            }
            this.sprites[i].draw(ctx);  
            if (this.sprites[i].isInPath(ctx, point)) {
                this.sprites[i].active=true;
                this.activeSprites=[this.sprites[i]];
                break;
            }
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
    deleteSprites(){
        this.activeSprites.map((a)=>{
            let index=this.sprites.findIndex((b)=>{
                return a==b;
            })
            index>-1 && this.sprites.splice(index,1)
        })
    }
    //移动
    moveSprites(moveVector){
        this.activeSprites.map((item)=>{
            item.active && item.move(moveVector);
        });
    }

}
export default SpritesController;