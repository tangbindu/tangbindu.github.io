var taskTimeLine={
  timeLine:{
  },
  //updateTotalClockInNums
  updateTodayTotalClockInNums:function(task,date){
    if(this.timeLine["i"+task.id]){
      //如果今天打卡存在
      for(var i=0;i<this.timeLine["i"+task.id].length;i++){
        var taskData=this.timeLine["i"+task.id][i];
        if(taskData[0]==date){
          taskData[1]=task.totalClockInNums
          break;
        }
      }
    }
  },
  //插入task
  insetTask:function(task,date){
    var clockInNums;
    //[[][][]] 0表示时间，1表示需要打卡次数，2实际打卡次数
    if(this.timeLine["i"+task.id]){
      //如果今天打卡存在
      var hasToday=false;
      for(var i=0;i<this.timeLine["i"+task.id].length;i++){
        var taskData=this.timeLine["i"+task.id][i];
        if(taskData[0]==date){
          hasToday=true;
          clockInNums=taskData[2]+1;
          if(clockInNums>taskData[1]){
            clockInNums=0;
          }
          this.timeLine["i"+task.id][i][2]=clockInNums;
          break;
        }
      }
      //如果今天打卡不存在
      if(!hasToday){
        clockInNums=1;
        this.timeLine["i"+task.id].push([date,task.totalClockInNums,clockInNums])
      }
    }else{
      clockInNums=1;
      //如果历史打卡不存在
      this.timeLine["i"+task.id]=[[date,task.totalClockInNums,clockInNums]];
    }
    task.clockInNums=clockInNums;
  },
  //取消task
  cancelTask:function(task,date){
    if(this.timeLine["i"+task.id]){
      for(var i=0;i<this.timeLine["i"+task.id].length;i++){
        if(this.timeLine["i"+task.id][i][0]==date){
          this.timeLine["i"+task.id].splice(i,1)
          break;
        }
      }
    }
  },
  getClockInNumsByDay(id,day){
    for(var i in this.timeLine){
      if(i.indexOf(id)>0){
        for(var j=0;j<this.timeLine["i"+id].length;j++){
          if(this.timeLine["i"+id][j][0]==day){
            return this.timeLine["i"+id][j][2];
          }
        }
      }
    }
  },  
  //完全销毁
  destroyTask:function(task){
    delete this.timeLine["i"+task.id];
  }
}