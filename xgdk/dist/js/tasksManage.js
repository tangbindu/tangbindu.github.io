var tasksManage={
    tasks:[],
    tasksData:[],
    //获取tasks
    initTasksFromData:function(tasksData){
        this.tasks.splice(0,this.tasks.length)
        if(!tasksData){
            return;
        }
        for(var i=0;i<tasksData.length;i++){
            this.tasks.push(
                new Task().create(tasksData[i])
            )
        }
    },
    //固定日期打卡
    markTaskByWorkDayTime:function(task,workDayTime,day){
        workDayTime=workDayTime || [];
        for(var i=0;i<workDayTime.length;i++){
            if(workDayTime[i]==day){
                task.show=true;
                break;
            }
        }
    },
    //每周打卡
    markTaskByWorkWeekTime:function(task,workWeekTime,day){
        workWeekTime=workWeekTime || [];
        var week=new Date(Number(day + "00000")).getDay();
        if(week==0){week=7}
        for(var i=0;i<workWeekTime.length;i++){
            if(workWeekTime[i]==week){
                task.show=true;
                break;
            }
        }
    },
    //每月打卡
    markTaskByWorkMonthTime:function(task,workMonthTime,day){
        workMonthTime=workMonthTime || [];
        var date=new Date(Number(day + "00000")).getDate()
        for(var i=0;i<workMonthTime.length;i++){
            if(workMonthTime[i]==date){
                task.show=true;
                break;
            }
        }
    },
    //标记任务通过worktime
    markTasksByDay:function(day){
        for(var i=0;i<this.tasks.length;i++){
            this.tasks[i].show=false;
            this.markTaskByWorkDayTime(this.tasks[i],this.tasks[i].workDayTime,day)
            this.markTaskByWorkWeekTime(this.tasks[i],this.tasks[i].workWeekTime,day)
            this.markTaskByWorkMonthTime(this.tasks[i],this.tasks[i].workMonthTime,day)
        }
    },
    //获取任务靠id
    getTaskById:function(id){
        for(var i=0;i<this.tasks.length;i++){
            if(this.tasks[i]["id"]==id){
                return this.tasks[i];
            }
        }
        return null;
    },
    //test
    delOneTask:function(task){
        for(var i=0;i<this.tasks.length;i++){
            if(this.tasks[i].id==task.id){
                this.tasks.splice(i,1);
            }
        }
    },
    //获取数据，方便提交
    getAllTaskData:function(){
        this.tasksData=[];
        for(var i=0;i<this.tasks.length;i++){
            this.tasksData.push(this.tasks[i].getData());
        }
        return this.tasksData;
    },
    //显示某一天的任务
    visibleTaskByDay(dayString){
        for(var i=0;i<this.tasks.length;i++){
            var visible=false;
            //天可见吗
            //月可见吗
            //周可见吗

        }
    }
}