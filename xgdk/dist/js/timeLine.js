function timeLine(){
  this.days=[];
  this.month=new Date().getMonth();
  this.year=null;
  this.month=null;
  this.today=null;
}
timeLine.prototype = {
  init:function(){
    var date=new Date();
    this.getDays(date.getFullYear(),date.getMonth());
    return this;
  },
  //初始化一个dayLine
  getDays:function(year,month){
    this.days.splice(0,this.days.length)
    this.year=year;
    this.month=month;
    var today=new Date();
    this.today=today.getDate();
    for(var i=1;i<new Date(year,month,0).getDate();i++){
      var date=new Date(year,month,i);
      //星期几
      var day=date.getDay(),isToday=false;
      //今日
      if(today.getFullYear()==year && today.getMonth()==month && today.getDate()==i){
        isToday=true;
      }
      this.days.push({
          time:util.dateToDay(date),
          //日期
          day:i,
          //州牧
          weekend:(day==0 || day==6)?true:false,
          isToday:isToday
        }
      )
    }
  },
  //当前月份
  isCurrentMonth:function(){
    var date=new Date();
    return (date.getFullYear()==this.year && date.getMonth()==this.month)
  },
  //查看日
  setViewDay:function(day){
    var date=new Date(Number(day + "00000")).getDate();
    for(var i=0;i<this.days.length;i++){
      if(this.days[i].day==date){
        this.days[i].viewDay=true;
      }else{
        delete this.days[i].viewDay;
      }
    }
  },
  //有完成的记录
  isFinished:function(timeList){
    timeList=timeList || [];
    for(var i=0;i<this.days.length;i++){
      this.days[i]["isFinished"]=false;
      for(var j=0;j<timeList.length;j++){
        if(this.days[i]["time"]==timeList[j][0] && timeList[j][1]==timeList[j][2]){
          this.days[i]["isFinished"]="true";
        }
      }
    }
  },
  //下一个月
  nextMonth:function(){
    this.month++;
    if(this.month>11){
      this.month=0;
      this.year++;
    }
    this.getDays(this.year,this.month);
  },
  //上一个月
  prewMonth:function(){
    this.month--;
    if(this.month<0){
      this.month=11;
      this.year--;
    }
    this.getDays(this.year,this.month);
  }
}