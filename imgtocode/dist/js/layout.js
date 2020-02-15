let layout=(sprites,type)=>{
    //type 可表示相对或者绝对定位
    //保留可布局的sprite
    let layoutSprites=sprites.filter((sprite)=>{
        return sprite.type=="default"
    })
    //根据面积排序
    layoutSprites=layoutSprites.sort((a,b)=>{
        return a.width*a.height<b.width*b.height;
    })
    //checkParent
    let checkParent=(sub,parent)=>{
        if(sub==parent){
            return false;
        }else if(
            (parent.x<=sub.x) &&
            (parent.y<=sub.y) &&
            ((parent.x+parent.width)>=(sub.x+sub.width)) &&
            ((parent.y+parent.height)>=(sub.y+sub.height))
        ){
            return  parent.width*parent.height-sub.width*sub.height;
        }else{
            return false;
        }
    }
    //遍历n*n
    for(let i=0;i<layoutSprites.length;i++){
        let tempArr=[];
        let size=Infinity;
        let parent=null;
        layoutSprites.map((sprite)=>{
            const curSize = checkParent(layoutSprites[i],sprite);
            if(curSize && (curSize<=size)){
                parent=sprite;
                size=curSize;
            }
        })
        if(parent){
            parent.children=parent.children || [];
            parent.children.push(layoutSprites[i]);
            layoutSprites.splice(i,1);
            i--;
        }
    }
    // console.dir(layoutSprites)
    
    //统计
    // layoutSprites.map((sprite)=>{
    //     console.log(sprite.x+","+sprite.y+"   "+sprite.width+"x"+sprite.height)
    // })
}
export default layout;