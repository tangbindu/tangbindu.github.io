//点击启动和关闭控制
gt.handler("start",function(){
  $(".record-btn").removeClass("start");
  $(".record-btn").addClass("stop");
});
gt.handler("stop",function(){
  $(".record-btn").removeClass("stop");
  $(".record-btn").addClass("start");
});
$(".record-btn").bind("click",function(){
  $(this).hasClass("start")?gt.start():gt.stop();
})
//拖拽操作
$(".shock").live("mousemove",function(){
  console.log($(this).index());
  // tl.shocks[]
});









//tl.shocks[1].node)
$('.shock').live('mousewheel', function(event, delta, deltaX, deltaY) {
    var scale=delta/.5;
    scale=scale>4?4:scale;
    scale=scale<-4?-4:scale;
    var value=parseInt($(this).css("width"))+1*scale;
    value=value<10?10 :value;
    $(this).css("width",value+"px")
});

$('.shock').live("click",function(){
  if($(this).hasClass("shock-l")){
    $(this).removeClass("shock-l");
    $(this).addClass("shock-s");
  }else if($(this).hasClass("shock-m")){
    $(this).removeClass("shock-m");
    $(this).addClass("shock-l");
  }else{
    $(this).removeClass("shock-s");
    $(this).addClass("shock-m");
  }
});






















// var tl=new TimeLine();
// //交互
// //键盘控制
// function KeyControl(){
//   this.down=false;
//   this.downTime=0;
//   this.jiangeTime=0;
//   this.init=(function(){
//     var that=this;
//     $(document).keydown(function(event){
//       if(!tl.work){
//         return;
//       }
//       if(that.down){
//         return;
//       }
//       that.down=true;
//       that.downTime=new Date().getTime();
//       that.trigger("down")
//     });
//     $(document).keyup(function(event){
//       if(!tl.work){
//         return;
//       }
//       var curTime=new Date().getTime();
//       that.jiangeTime=curTime-that.downTime;
//       that.downTime=curTime;
//       that.down=false;
//       that.trigger("up")
//     });
//   }).call(this)
// };
// extend(KeyControl, eventTarget)
// var kc=new KeyControl();

// kc.handler("down",function(){
//   // console.log("down");
//   tl.getLastShock() && tl.getLastShock().stopDelay();
//   tl.addShock();
//   //首次
//   if(tl.shocks.length==1



//     $(tl.shocks[0].node).css("marginLeft",tl.sb.left+"px");
//   }
//   //首次延迟
//   tl.getLastShock().grow();
// })
// kc.handler("up",function(){
//   // console.log("up")
//   tl.getLastShock() && tl.getLastShock().stopGrow();
//   tl.getLastShock() && tl.getLastShock().delay();
//   // console.log("间隔时间:"+this.jiangeTime);
// })




// //点击控制
// $(".record-btn").toggle(function(){
//   //启动
//   gt.start();
//   $(this).removeClass("start");
//   $(this).addClass("stop");
// },function(){
//   gt.stop();
//   //关闭
//   $(this).removeClass("stop");
//   $(this).addClass("start");
// })  










