

// var point1={
//   x:100.0,
//   y:100.0
// }
// var point2={
//   x:200.0,
//   y:300.0,
// }
// var point3={
//   x:400.0,
//   y:130.0,
// }
// var points1=[
//   point1,
//   point2,
//   point3
// ]


function drawPointS(chart,points){
  //画线
  chart.setStyle(style2);
  chart.drawLines(points);
  chart.restoreStyle();
  //画点
  chart.setStyle(style1);
  points.forEach((item)=>{
    chart.drawPoint(item);  
  })
  //写字
  // chart.setStyle(style3);
  // points.forEach((item)=>{
  //   chart.drawText(item.y,item);
  // })
}


!function tx(){
  var data=document.getElementsByClassName("testdata2")[0].value;
  var dataObj=JSON.parse(data);
  var max=Math.max.apply(Math, dataObj.items.map(function(o) {return o.price}))
  var min=Math.min.apply(Math, dataObj.items.map(function(o) {return o.price}))

  var tencentPoints=[];
  var scale=200/(max-min);

  dataObj.items.forEach((item,i)=>{
    tencentPoints.push({
      x:i*document.body.clientWidth/340,
      y:(item.price-min)*scale
    })
  })


  var ct=new Chart();
  ct.setView(document.body.clientWidth,200);
  document.body.append(ct.view);
  drawPointS(ct,tencentPoints)
}();



!function pinan(){
  var data=document.getElementsByClassName("testdata1")[0].value;
  var dataObj=JSON.parse(data);
  var max=Math.max.apply(Math, dataObj.items.map(function(o) {return o.price}))
  var min=Math.min.apply(Math, dataObj.items.map(function(o) {return o.price}))

  var tencentPoints=[];
  var scale=200/(max-min);

  dataObj.items.forEach((item,i)=>{
    tencentPoints.push({
      x:i*document.body.clientWidth/340,
      y:(item.price-min)*scale
    })
  })


  var ct=new Chart();
  ct.setView(document.body.clientWidth,200);
  document.body.append(ct.view);
  drawPointS(ct,tencentPoints)
}();











