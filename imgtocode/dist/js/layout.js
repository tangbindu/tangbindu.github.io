let layout=(sprites,type)=>{
    //type 可表示相对或者绝对定位
    //保留可布局的sprite
    let layoutSprites=sprites.filter((sprite)=>{
        return sprite.type=="default"
    })
    //还原布局数据
    layoutSprites.map((sprite)=>{
        delete sprite.children;
    })
    //根据面积排序
    layoutSprites=layoutSprites.sort((a,b)=>{
        return (a.width*a.height)-(b.width*b.height);
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
            return parent.width*parent.height;
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
    //根据y排序
    layoutSprites=layoutSprites.sort((a,b)=>{
        return (a.y-b.y);
    })
    //获取代码
    function getCode(obj,root){
        if(obj instanceof Array){
            // let tree=document.createElement("div");
            // root.appendChild(leef)
            obj.map((sprite)=>{
                getCode(sprite,root)
            })
        }else{
            // console.log(obj.x+","+obj.y+"   "+obj.width+"x"+obj.height)
            let leef=document.createElement("div");
            leef.style.x=obj.x+"px";
            leef.style.y=obj.y+"px";
            leef.style.width=obj.width+"px";
            leef.style.height=obj.height+"px";
            root.appendChild(leef)
            if(obj.children){
                getCode(obj.children,leef)
            }
        }
    }
    //拿到结构
    let root=document.createElement("div");
    getCode(layoutSprites,root);
    document.getElementById("pageView").innerHTML="";
    document.getElementById("pageView").appendChild(root);
    // console.dir(layoutSprites)
    
    //统计
    // layoutSprites.map((sprite)=>{
    //     console.log(sprite.x+","+sprite.y+"   "+sprite.width+"x"+sprite.height)
    // })
}
export default layout;