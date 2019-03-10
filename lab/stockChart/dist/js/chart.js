
var style1={
  lineWidth:.5,
  strokeStyle:'#f00',
  fillStyle:'#f00'
}

var style2={
  lineWidth:1,
  strokeStyle:'#090'
}

var style3={
  font:"12px Georgia"
}


class Graph{
  constructor(pos){
    this.x=pos.x;
    this.y=pos.y;
  }
  draw(ctx){
    if(this.isFill){ ctx.fill(); }
    ctx.restore();
  }
}
class Chart{
  constructor(){
    this.view=document.createElement("canvas");
    this.ctx=this.view.getContext('2d');
    this.scale=2;
    this.style=null; 
    this.flipY=true;
  }
  setView(width,height){
    this.view.width=width*this.scale;
    this.view.height=height*this.scale;
  }
  setStyle(style){
    this.style=style;
    this.ctx.save();
    for(var item in this.style){
      this.ctx[item]=this.style[item];
    }
    //绘图在这里
  }
  restoreStyle(){
    this.ctx.restore()
  }
  draw(){
    this.style["lineWidth"] && this.ctx.stroke();
    this.style["fillStyle"] && this.ctx.fill();
  }
  drawLine(line){
  }
  drawText(text,point){
    var y=point.y*this.scale;
    y=this.flipY?this.view.height-y : y;
    this.ctx.fillText(text,point.x*this.scale,y);
  }
  drawLines(points){
    this.ctx.beginPath();
    points.forEach((p,i)=>{
      var y=p.y*this.scale;
      y=this.flipY?this.view.height-y : y; 
      if(i==0){
        this.ctx.moveTo(p.x*this.scale,y);
      } else {
        this.ctx.lineTo(p.x*this.scale,y);
      }
    });
    // this.ctx.closePath();
    this.draw();
  }
  drawPoint(point){
    point.r=point.r || 1;
    this.ctx.beginPath();

    var y=point.y*this.scale;
    y=this.flipY?this.view.height-y : y; 
    this.ctx.arc(
      point.x*this.scale,
      y,
      point.r*this.scale,
      0,
      Math.PI*2
    );
    this.draw();
  }
  drawPoints(points){
  }
}