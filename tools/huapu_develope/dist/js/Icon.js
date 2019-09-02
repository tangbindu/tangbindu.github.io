util={
  //调试
  show2D:function(data){
    var num=0;
    for(var y=0;y<data.length;y++){
      var xlist=""
      for (var x = 0; x < data[y].length; x++) {
        xlist+=data[y][x]+"";
      };
      xlist+=("list"+y)
      console.log(xlist)
    }
  },
  //前台-loading
  show_g_loading:function(){
    $("#stage").addClass("g-loading-show");
  },
  hide_g_loading:function(){
    $("#stage").removeClass("g-loading-show");
  },
  //前台-判断是否为chrome,以及版本
  isChrome:function(){
    var ua=navigator.userAgent;
    var reg=new RegExp("chrome","i");
    if(reg.test(ua)==false){
      document.body.style["background-color"]="black"
      document.body.innerHTML="";
      setTimeout(function(){
        alert("亲，请使用chrome浏览器玩耍哦！");
      },1000)
    }
  }
}

util.isChrome();

/*
*param {canvas} cvs  canvas对象
*param {array}  piex2D 图片地图 
*param {int} fixed 精度，通车默认20px
*/
function findIcon(cvs,piex2D,fixed){
  var flag=2,
  width=cvs.width,
  height=cvs.height;
  time=0;
  //像素递归
  function recursion(point,flagNum){
    //八个方向递归
    var top={x:point.x,y:point.y-1}
    var right={x:point.x+1,y:point.y}
    var bottom={x:point.x,y:point.y+1}
    var left={x:point.x-1,y:point.y}
    var top_left={x:point.x-1,y:point.y-1}
    var top_right={x:point.x+1,y:point.y-1}
    var bottom_left={x:point.x-1,y:point.y+1}
    var bottom_right={x:point.x+1,y:point.y+1}
    try{
      var top_val=piex2D[top.y][top.x];
      if(top_val==2){
        piex2D[top.y][top.x]=flagNum;
        recursion(top,flagNum);
      }
    }catch(event){}
    try{
      var right_val=piex2D[right.y][right.x];
      if(right_val==2){
        piex2D[right.y][right.x]=flagNum;
        recursion(right,flagNum);
      }
    }catch(event){}
    try{
      var bottom_val=piex2D[bottom.y][bottom.x];
      if(bottom_val==2){
        piex2D[bottom.y][bottom.x]=flagNum;
        recursion(bottom,flagNum);
      }
    }catch(event){}
    try{
      var left_val=piex2D[left.y][left.x];
      if(left_val==2){
        piex2D[left.y][left.x]=flagNum;
        recursion(left,flagNum);
      }
    }catch(event){}
    try{
      var top_left_val=piex2D[top_left.y][top_left.x];
      if(top_left_val==2){
        piex2D[top_left.y][top_left.x]=flagNum;
        recursion(top_left,flagNum);
      }
    }catch(event){}
    try{
      var top_right_val=piex2D[top_right.y][top_right.x];
      if(top_right_val==2){
        piex2D[top_right.y][top_right.x]=flagNum;
        recursion(top_right,flagNum);
      }
    }catch(event){}
    try{
      var bottom_left_val=piex2D[bottom_left.y][bottom_left.x];
      if(bottom_left_val==2){
        piex2D[bottom_left.y][bottom_left.x]=flagNum;
        recursion(bottom_left,flagNum);
      }
    }catch(event){}
    try{
      var bottom_right_val=piex2D[bottom_right.y][bottom_right.x];
      if(bottom_right_val==2){
        piex2D[bottom_right.y][bottom_right.x]=flagNum;
        recursion(bottom_right,flagNum);
      }
    }catch(event){}
  }

  for(y=0;y<piex2D.length;y++){
    for(x=0;x<piex2D[y].length;x++){
      var tirm=piex2D[y][x-1]==0 ? true :false; //|| (piex2D[y][x-1]==undefined);
      if(piex2D[y][x]==2 && !piex2D[y][x-1]){
        //console.log(piex2D[y][x-1]+"^^^^^^^^^^^^^^^^^^^")
        piex2D[y][x]=++flag;
        //递归查找
        recursion({"x":x,"y":y},flag);
      }else if(piex2D[y][x]==2 && piex2D[y][x-1]){
        //console.log(piex2D[y][x-1]+"^^^^^^^^^^^^^^^^^^^")
        piex2D[y][x]=1;
        //递归查找
        recursion({"x":x,"y":y},1);
      }
    }
  };


  //获取part2d的局部
  function getPart2d(piex2D,box){
    var part=[];
    for(y=box.top;y<box.bottom;y++){
      var row=[];
      for(x=box.left;x<box.right;x++){
          row.push(piex2D[y][x])
      }
      part.push(row)
    }
    //过滤掉
    return part;
  }

  //获取icon的尺寸，和坐标
  function findIconBox(num){
    var points=[];
    var box={
      top:0,
      right:0,
      bottom:0, 
      left:0,
      data:null,
      flag:num
    };
    for(y=0;y<cvs.height;y++){
      for(x=0;x<cvs.width;x++){
        if(piex2D[y][x]==num){
          points.push({"y":y,"x":x})
        }
      }
    };
    points.sort(function(a,b){
      return a.x-b.x
    }); 
    box.left=points[0].x;
    box.right=points[points.length-1].x+1-fixed*2;
    points.sort(function(a,b){
      return a.y-b.y
    });
    box.top=points[0].y;
    box.bottom=points[points.length-1].y+1-fixed*2;
    box.data=getPart2d(piex2D,box) 
    return box;
  }

  //收集每个icon 的尺寸和坐标
  var iconBoxes=[];
  for(var i=3;i<=flag;i++){
    iconBoxes.push(findIconBox(i));
  }
  return iconBoxes;
}



//查找边界
function findBorder(map2d,fixed){
  var cur;
  var circle=[];
  for(var i=0;i<map2d.length;i++){
    for(var j=0;j<map2d[i].length;j++){
      if(map2d[i][j]==1){
        try{circle[0]=map2d[i-1][j-1]}catch(err){circle[0]=0};
        try{circle[1]=map2d[i][j-1]}catch(err){circle[1]=0}
        try{circle[2]=map2d[i+1][j-1]}catch(err){circle[2]=0};
        try{circle[3]=map2d[i-1][j]}catch(err){circle[3]=0};
        try{circle[4]=map2d[i+1][j]}catch(err){circle[4]=0;};
        try{circle[5]=map2d[i-1][j+1]}catch(err){circle[5]=0};
        try{circle[6]=map2d[i][j+1]}catch(err){circle[6]=0};
        try{circle[7]=map2d[i+1][j+1]}catch(err){circle[7]=0};
        for(var z=0;z<circle.length;z++){
          if(circle[z]==0 || circle[z]==undefined){
            map2d[i][j]=2;
            break;
          }
        }  
      }
      //cur range
    }
  }
}

/*延展icon*/
function biggerIcon(map2d,fixed){
  var cur;
  var circle=[];
  function bigger(i,j){
    for(var y=-1*fixed;y<=fixed;y++){
      for(var x=-1*fixed;x<=fixed;x++){
        if(map2d[i-0+y][j-0+x]!=2){
          map2d[i-0+y][j-0+x]=1 
        }
      } 
    }
  };
  for(var i=0;i<map2d.length;i++){
    for(var j=0;j<map2d[i].length;j++){
      if(map2d[i][j]==2){
        bigger(i,j)
      }
      //cur range
    }
  }
  for(var i=0;i<map2d.length;i++){
    for(var j=0;j<map2d[i].length;j++){
      if(map2d[i][j]==2){
        map2d[i][j]=1;
      }
    }
  }
}











function Icon(imgData,param){
  this.imgData=imgData;
  this.piex2D=[];
  this.img=null;
  this.width=null;
  this.height=null;
  this.piex=null;
  this.fixed=10;
  this.boxes=[];
  this.canvas=null;
  var conf=param || {};
  $.extend(this,param);
}
Icon.prototype ={
  //初始化图片，像素
  init:function(callback){
    var self=this,ctx;
    /*图片*/
    self.img=new Image();
    self.img.onload=function(){
      self.width=self.img.width;
      self.height=self.img.height;
      /*上传限制*/
      // if(self.width>3000 || self.height>3000){
      //   util.hide_g_loading();
      //   alert("上传图片的宽高不能超过2000")
      // }
      /*canvas*/
      self.canvas=document.createElement("canvas");
      ctx=self.canvas.getContext("2d");
      self.canvas.width=self.width+self.fixed*2;
      self.canvas.height=self.height+self.fixed*2; 
      //计时
      var t=new Date().getTime();
      //写入图片数据
      ctx.drawImage(self.img,self.fixed,self.fixed,self.width,self.height);
      /*像素（一维数组）*/
      self.piex=ctx.getImageData(0,0,self.canvas.width,self.canvas.height).data;
      //console.log(self.piex)
      /*像素（二维数组）*/
      self.piexTo2D();
      //util.show2D(self.piex2D)
      /*查找边界*/
      findBorder(self.piex2D)
      /*伸展宽度*/
      biggerIcon(self.piex2D,self.fixed);
      /*再次查找边界*/
      findBorder(self.piex2D)
      //util.show2D(self.piex2D)
      //console.log("------------------------------")
      //找出icon
      self.boxes=findIcon(self.canvas,self.piex2D,self.fixed);
      //console.log("完成"+(new Date().getTime()-t)/1000);
      //mac 20xp 4.834s 完成  无提取
      //util.show2D(self.piex2D)
      //console.log(self.boxes)

      // for(var i=0;i<self.boxes.length;i++){
      //   util.show2D(self.boxes[i].data) 
      // }
      //回调
      callback && callback.call(self)
    }
    self.img.src=this.imgData;    
  },
  //分析
  piexTo2D:function(){
    //像素索引地图
    var i=0,j=0,z=0,mapArr=[],imgWidth,imgHeight;
    //变一维地图
    for(i;i<this.piex.length;i=i+4){
      var r=this.piex[i];
      var g=this.piex[i+1];
      var b=this.piex[i+2];
      var a=this.piex[i+3];
      if(this.isPiex(r,g,b,a)){
        mapArr[j++]=1;
      }else{
        mapArr[j++]=0;
      }
    };
    //变2纬地图（2纬）
    for(y=0;y<this.canvas.height;y++){
      this.piex2D[y]=[];
      //var front=0;
      for(x=0;x<this.canvas.width;x++){
        //遍历4周
        var cur=mapArr[z++];
        this.piex2D[y][x]=cur;
      }
    };
    //提炼2纬地图边界
    
  },
  //是否为可用像素
  isPiex:function(r,g,b,a){
    return  r | g | b | a;
  }
};





