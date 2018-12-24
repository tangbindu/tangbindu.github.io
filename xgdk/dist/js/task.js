function Task(conf){
  conf=conf || {};
  //名字
  this.name=conf.name || "";
  //id
  this.id=conf.id || 0;
  //打卡次数
  this.clockInNums=0;
  //打卡次数
  this.totalClockInNums=conf.totalClockInNums || 1;
  //历史完成次数
  this.historyFinishedNums=0;
  //打卡时间
  this.workDayTime=conf.workDayTime || [];
  this.workWeekTime=conf.workWeekTime || [];
  this.workMonthTime=conf.workMonthTime || [];
  //任务是否生效,默认true
  this.isWork=true;
}
Task.prototype={
  //创建任务
  create:function(conf){
    for(var i in conf){
      this[i]=conf[i];
    }
    return this;
  },
  //删除任务
  delete:function(){
    return this;
  },
  //暂停任务
  pause:function(){
    this.isWork=false;
    return this;
  },
  //打卡任务
  // daka:function(insetTask,cancelTask){
  //   // this.clockInNums++;
  //   // if(this.clockInNums==this.totalClockInNums){
  //   //   this.historyFinishedNums++;
  //   //   insetTask && insetTask();
  //   // }
  //   if(this.clockInNums>this.totalClockInNums){
  //     this.clockInNums=0;
  //     this.historyFinishedNums--;
  //     cancelTask && cancelTask();
  //   }else{
  //     if(this.clockInNums==this.totalClockInNums){
  //       this.historyFinishedNums++;
  //     }
  //     insetTask && insetTask(); 
  //   }
  //   return this;
  // },
  //取消打卡任务
  // canelDaka:function(){
  //   if(this.clockInNums>0){
  //     this.clockInNums--;
  //   }
  //   return this;
  // },
  //修改任务
  modify:function(){
    return this;
  },
  //获取数据
  // getData
  getData:function(){
    var that=this;
    var data={
      //名字
      name:that.name, 
      //id
      id:that.id,
      //打卡时间
      workDayTime:that.workDayTime,
      workWeekTime:that.workWeekTime,
      workMonthTime:that.workMonthTime,
      //完成次数
      // clockInNums:parseInt(that.clockInNums),
      //打卡次数
      totalClockInNums:parseInt(that.totalClockInNums),
      //历史完成次数
      historyFinishedNums:parseInt(that.historyFinishedNums),
      //任务是否生效,默认true
      isWork:that.isWork
    };
    return data;
  }
}