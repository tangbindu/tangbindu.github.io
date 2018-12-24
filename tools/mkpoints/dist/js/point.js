var pointsWrap=$("#pointsWrap");
var textarea=$("#resultTextarea");

var pwW=pointsWrap.width();
var pwH=pointsWrap.height();

function Point(wrap,left,right){
  this.div=$("<div class='point'>");
  this.left=left;
  this.right=right;
  this.init=(function(){
    this.div.css("left",this.left+"px");
    this.div.css("top",this.right+"px");
    wrap.append(this.div);
  }).call(this)
}


function toDecimal3(x) {
   var f = parseFloat(x);
   if (isNaN(f)) {
      return false;
   }
   var f = Math.round(x*100)/100;
   var s = f.toString();
   var rs = s.indexOf('.');
   if (rs < 0) {
      rs = s.length;
      s += '.';
   }
   while (s.length <= rs + 3) {
      s += '0';
   }
   if(s.indexOf("-")<0){
    s=" "+s;
   }
   return s;
}


pointsWrap.bind("mousedown",function(e){
  var p=new Point(pointsWrap,e.offsetX,e.offsetY);
  var x=(e.offsetX-pwW/2)/(pwW/2);
  var y=(e.offsetY-pwH/2)/-(pwH/2);

  textarea.val(textarea.val()+" "+toDecimal3(x)+", "+toDecimal3(y)+",\n")
})