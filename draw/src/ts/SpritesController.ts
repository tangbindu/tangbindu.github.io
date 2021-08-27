/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:49:14
 * @FilePath: /draw/src/ts/SpritesController.ts
 * @Description: 
 */
import tools from "./tools.js";

class SpritesController{
  //active sprites
  activeSprites : any[];
  //最后一个精灵
  lastSprite: any;
  //所有的精灵
  sprites: any[];
  //支持多选精灵
  supportMultipleClick: boolean;
  //app
  app : any;
  //构造
  constructor(config){
    //click的元素
    this.app=config.app;
    this.activeSprites=[];
    this.lastSprite=null;
    this.sprites=[];
    this.supportMultipleClick=false;
  }
  //队列问题
  //删除问题
  //全选
  /**
   * 获取精灵byid
   */
  getSpriteById(id){
    return this.sprites.filter(item=>{
      if(item.id==id){
        return item
      } 
    })[0]
  }
  /**
   * 获取精灵byname
   */
  getSpriteByName(name){
    return this.sprites.filter(item=>{
      if(item.name==name){
        return item
      } 
    })
  }
  /*获取和代码相关的节点*/
  getNodes() { 
    return this.sprites.filter(item => { 
      return ["RectSprite"].includes(item.type)
    })
  }
  //通过一点获取sprite
  getSpriteByPoint(ctx,point){
    let sprite=null;
    for(var i=(this.sprites.length-1);i>=0;i--){
      if(!this.sprites[i].allowClick){
        continue;
      }
      let check=this.sprites[i].isInPath(ctx, point);
      if (check) {
        sprite=this.sprites[i];
        break;
      }
    }
    return sprite;
  }

  //通过rect获取sprite
  selectSpriteByRect(parentRect) {
    let sprites = this.getNodes();
    let px = parentRect.x;
    let py = parentRect.y;
    let pwidth = parentRect.width;
    let pheight = parentRect.height;
    sprites.forEach(sprite => {
      if (
        sprite.x >= px &&
        sprite.y >= py &&
        (sprite.x + sprite.width) <= (px+pwidth) &&
        (sprite.y+sprite.height) <= (py+pheight)
      ) {
        this.addActiveSprite(sprite);
      } 
    })
  }
  //增加
  addSprite(sprite){
    this.sprites.push(sprite);
    this.sprites.sort((a,b)=>{
      return a.zindex-b.zindex;
    })
    this.lastSprite=sprite;
  }
  /**
   * 移除精灵
   */
  removeSprite(sprite){
    let beforeLength=this.sprites.length;
    this.sprites=this.sprites.filter(item=>{
      return item!=sprite
    })
    return beforeLength===this.sprites.length;
  }
  //全选
  selectAll(){
    this.sprites.forEach((sprite)=>{
      if(sprite.allowClick){
        sprite.active=true;
      }
    })
    this.activeSprites=this.sprites.filter(sprite=>{
      return sprite.allowClick
    })
  }
  //取消选择
  cancelSelect(){
    this.sprites.map((sprite)=>{
      if(sprite.allowClick){
        sprite.active=false;
      }
    })
    this.activeSprites=[];
  }
  //设置全部缩放
  setAllSpriteScale(scale){
    this.sprites.forEach(sprite=>{
      sprite.scale=scale;
    })
  }    
  //复制
  copyActiveSprites(){
    this.getActiveSprites().forEach((sprite)=>{
      if(["RectSprite","ImageSprite"].indexOf(sprite.type)>-1){
        let cloneSprite=null;
        switch(sprite.type) {
          case "RectSprite":
            cloneSprite=this.app.addRectSprite(sprite)
          break;
          case "ImageSprite":
            cloneSprite=this.app.addImageSprite(sprite.imagePath,sprite)
            break;
          default:
            void(0)
        }
        this.releaseActiveSprites(sprite)
        this.addActiveSprite(cloneSprite)
      }
    })
  }
  //粘贴
  pasteActiveSprites(){

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
    this.sprites=this.sprites.filter((sprite)=>{
      return !sprite.active;
    })
  }
  //add Active sprite
  addActiveSprite(sprite){
    let hasSprite=this.activeSprites.filter(item=>{
      return item==sprite
    })
    if(hasSprite.length===0){
      sprite.active=true;
      this.activeSprites.push(sprite)
    }
  }
  /**
   * 释放精灵
   */
  releaseActiveSprites(sprite?:any){
    if(sprite){
      this.activeSprites=this.activeSprites.filter(item=>{
        return item!=sprite;
      })
      sprite.active=false;
    }else{
      this.activeSprites.forEach(item=>{
        item.active=false
      })
      this.activeSprites=[];
    }
  }
  //获取active
  getActiveSprites(){
    return this.sprites.filter((sprite)=>{
      return sprite.active
    })
  }
  //删除其他active
  clearOtherActiveSprites(sprite){
    this.sprites.map((item)=>{
      if(item!=sprite){
        item.active=false
      }
    })
  }
  //调整尺寸
  adjustSpritesSize(size){
    this.sprites.map((item)=>{
      item.active && item.adjustSize(size);
    });
  }
  //移动
  moveSprites(moveVector){
    this.sprites.map((item)=>{
      item.active && item.move(moveVector);
    });
  }

}
export default SpritesController;