
/*
 * 全局参数
 */
//用户名

//服务器数据模版


//两大问题
//看某一天的任务
//看某个任务的历史


//日期时间搓常量------------------------------------
var day=new Date();
var today = util.dateToDay(day);
var tomorrow = util.dateToDay(new Date(day.getTime()+24*60*60*1000));
var aftertomorrow = util.dateToDay(new Date(day.getTime()+48*60*60*1000));

//数据一定要拉
var xgdk={
  loading:$("#loading"),
  userName : util.getQueryString("user") || "test",
  currentDay:today,
  // authorize:false,
  dayTimes:[today,tomorrow,aftertomorrow],
  //时间轴，和day的数据相关
  tl: new timeLine().init(),
  //任务对象，创建任务，打卡，获取本任务json
  Task:Task,
  //任务管理器 ，管理任务，显示当天任务，删除任务，添加任务等，转出json数据
  tasksManage:tasksManage,
  //dataControl 数据库操作
  dataControl: dataControl,
  //taskTimeLine，任务打卡相关
  taskTimeLine:taskTimeLine,
  //数据索引
  tasksIndex:0,
  //version
  version:0,
  localVersion:0,
  //currentTask
  currentTask:null,
  pushTimer:null,
  // pullTimer:null,
  //初始化
  listenerServerData:function(){
    var that=this;
    ref.orderByKey().equalTo(that.userName).on("value", function(snapshot) {
      var data = snapshot.val();
      if (!data) {
        //没有授权
        that.loading.find("p").html("sorry！ 未授权用户");
        return;
      }else{
        // that.pullTimer && clearTimeout(that.pullTimer);
        // that.pullTimer=setTimeout(function(){
          that.loading.hide();
          //服务器版本
          that.version=data[that.userName].version || 0;
          console.log("pull:"+that.version)
          console.log(data)
          //任务索引数据,版本管理
          if(that.version<that.localVersion){
            return
          }else{
            that.localVersion=that.version;
          };
          that.tasksIndex = data[that.userName].tasksIndex || 0;
          //任务数据
          that.tasksManage.initTasksFromData(data[that.userName].tasks);
          //vue bug，vue bug，vue bug，vue bug，绑定会失效
          //打卡数据
          that.taskTimeLine.timeLine = data[that.userName].timeLine || {};
          //默认显示当看查看的day，默认今天
          that.showTasksByDay();
          //数据驱动赋值当前任务
          that.currentTask && that.showTask(that.currentTask.id)
        // },200)
      }
    });
  },
  init:function(){
    this.listenerServerData();
  },  
  //查看某一个任务
  showTask: function(conf) {
    var id = conf.target ? conf.target.dataset.id : conf;
    this.currentTask = tasksManage.getTaskById(id);
    for (var i = 0; i < this.tasksManage.tasks.length; i++) {
      delete this.tasksManage.tasks[i]["isActive"];
    }
    this.currentTask.isActive = true;
    return this.currentTask;
    // tl.isFinished(this.taskTimeLine.timeLine["i" + this.workingTask.id]);
  },
  showClockInNums:function(){
    for(var i=0;i<xgdk.tasksManage.tasks.length;i++){
      if(xgdk.tasksManage.tasks[i].show){
        //显示她的clockInNums
        xgdk.tasksManage.tasks[i].clockInNums=xgdk.taskTimeLine.getClockInNumsByDay(xgdk.tasksManage.tasks[i].id,xgdk.currentDay) || 0;
      }
    }
  },
  //显示摸一天任务
  showTasksByDay:function(){
    //标记当天要做的任务
    this.tasksManage.markTasksByDay(this.currentDay);
    //时间轴显示这一天
    this.tl.setViewDay(this.currentDay);
    this.showClockInNums();
    xgdk.currentTask && xgdk.tl.isFinished(xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]);
  },
  //推送数据到服务器
  pushDataToServer:function(){
    //防止过分推送
    var that=this;
    that.pushTimer && clearTimeout(that.pushTimer);
    that.pushTimer=setTimeout(function(){
      var serveData = {
        version:++that.localVersion,
        tasksIndex: 0,
        tasks:[],
        timeLine: {}
      }
      //新task数据转写入任务数据源头
      serveData.tasks = that.tasksManage.getAllTaskData();
      serveData.timeLine = that.taskTimeLine.timeLine;
      serveData.tasksIndex= that.tasksIndex;
      console.log("push:"+that.localVersion)
      console.log(serveData)
      //上报新task数据
      that.dataControl.push(that.userName, serveData)
    },100)
  }
};
xgdk.init();

var vm=new Vue({
  el: '#app',
  data: {
    today:new Date(Number(xgdk.currentDay + "00000")).getDate(),
    //状态
    showDelBtn: false,
    //数据
    dayTimes:xgdk.dayTimes,
    tasks: xgdk.tasksManage.tasks,
    // currentTask: {
    //   id: "",
    //   name: "",
    //   totalClockInNums: 1,
    //   workDayTime: [],
    //   workWeekTime: [],
    //   workMonthTime: []
    // },
    currentTask:new Task({totalClockInNums:1}),
    timeLine: xgdk.tl,
  },
  watch: {
    //检测edit
    "currentTask.name": function(val) {
      // console.log("修改名字",val)
      if(!xgdk.currentTask){
        return;
      };
      xgdk.currentTask.name=this.currentTask.name || [];
      xgdk.pushDataToServer();
    },
    "currentTask.totalClockInNums": function(val) {
      // console.log("修改打卡次数",val)
      if(!xgdk.currentTask){
        return;
      };
      xgdk.currentTask.totalClockInNums=this.currentTask.totalClockInNums || [];
      xgdk.taskTimeLine.updateTodayTotalClockInNums(xgdk.currentTask,today);
      xgdk.pushDataToServer();
    },
    //逻辑处理
    "currentTask.workDayTime": function(val) {
      // console.log("修改具体日期",val)
      if(!xgdk.currentTask){
        return;
      };
      xgdk.currentTask.workDayTime=this.currentTask.workDayTime || [];
      xgdk.pushDataToServer();
    },
    "currentTask.workWeekTime": function(val) {
      // console.log("修改星期",val)
      if(!xgdk.currentTask){
        return;
      };
      xgdk.currentTask.workWeekTime=this.currentTask.workWeekTime || [];
      xgdk.pushDataToServer();
    },
    "currentTask.workMonthTime": function(val) {
      // console.log("修改月份",val)
      if(!xgdk.currentTask){
        return;
      };
      xgdk.currentTask.workMonthTime=this.currentTask.workMonthTime || [];
      xgdk.pushDataToServer();
    }
  },
  methods: {
    isToday:function(){
      return xgdk.currentDay==today;
    },
    //showTask
    showTask:function(event){
      this.showDelBtn = true;
      this.currentTask=xgdk.showTask(event);
      xgdk.tl.isFinished(xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]);
    },
    //hideTask
    hideTask:function(event){
      //等待开发
    },
    //createTask
    createTask: function() {
      var conf=new Task().getData(),newTask;
      if(!xgdk.currentTask){
        conf=this.currentTask.getData();
      };
      if((conf.workDayTime.length==0) && (conf.workWeekTime.length==0) && conf.workMonthTime.length==0){
        conf.workDayTime=[today];
      }
      // conf.workDayTime=conf.workDayTime || [today];
      conf.totalClockInNums=conf.totalClockInNums || 1;
      conf.id=++xgdk.tasksIndex;
      newTask = new Task(conf);
      // //把新任务插入到任务列表里
      xgdk.tasksManage.tasks.unshift(newTask);
      this.showTask(newTask.id);
      // //同步任务到服务器
      $("#taskname").focus().addClass("focus");
      xgdk.pushDataToServer();
    },
    //deleteTask
    deleteTask: function() {
      var that=this;
      if(window.confirm('你确定要永久删除"'+that.currentTask.name+'"这个任务?')){
        tasksManage.delOneTask(xgdk.currentTask);
        taskTimeLine.destroyTask(xgdk.currentTask);
        xgdk.currentTask=null;
        this.showDelBtn=false;
        //同步任务到服务器
        xgdk.pushDataToServer();
        // //自动选择
        // var id=$(".work-space .card").eq(0).data("id");
        // if(id){
        //   that.showTask(id);
        // }else{
        //   that.showDelBtn=false;
        // }
      }
    },
    //打卡
    clockIn: function(event) {
      var that = this;
      //注，当天才能打卡
      //显示当前task
      that.showTask(event);
      //打卡,记录操作
      xgdk.currentDay==today && xgdk.taskTimeLine.insetTask(xgdk.currentTask,today);
      //时间线显示当前任务所有完成的时间节点
      xgdk.tl.isFinished(xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]);
      //同步任务到服务器
      xgdk.currentDay==today && xgdk.pushDataToServer();
    },
    //查看某天的任务
    viewTasksByDay:function(event){
      xgdk.currentDay=event.target.dataset.time;
      this.today=new Date(Number(xgdk.currentDay + "00000")).getDate();
      //标记当天任务
      xgdk.showTasksByDay();  
      // xgdk.currentTask=null;
      this.isToday() && xgdk.currentTask && xgdk.tl.isFinished([xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]]);
      !this.isToday() && xgdk.tl.isFinished([]);
      // xgdk.currentTask=null;
      // xgdk.tl.isFinished([xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]]);
      //修复vue的bug
      for(var i=0;i<this.tasks.length;i++){
        Vue.set(vm.tasks,i,vm.tasks[i])
      }
      xgdk.currentTask && this.showTask(xgdk.currentTask.id);
      !xgdk.currentTask && this.hideTask();
    },
    //上个月
    timelinePrew: function() {
      xgdk.tl.prewMonth();
      xgdk.tl.isCurrentMonth() && xgdk.tl.setViewDay(xgdk.currentDay);
      xgdk.currentTask && xgdk.tl.isFinished(xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]);
    },
    //下个月
    timelineNext: function() {
      xgdk.tl.nextMonth();
      xgdk.tl.isCurrentMonth() && xgdk.tl.setViewDay(xgdk.currentDay);
      xgdk.currentTask && xgdk.tl.isFinished(xgdk.taskTimeLine.timeLine["i" + xgdk.currentTask.id]);
    },
    up:function(){
        $("#app").addClass("z-edit");
        $(".form-wrap").css("height",$(".form").height());
        $(".history-space").css("height","0px")

    },
    down:function(){
        $("#app").removeClass("z-edit");
        $(".form-wrap").css("height","0px");
        $(".history-space").css("height",$(".history").height())

    },
    //折叠
    foldEditSpace: function(e) {
      $("#app").toggleClass("z-edit");
      if( $("#app").hasClass("z-edit")){
        this.up();
      }else{
        this.down();
      }
    }
  }
})
var hammertime;
$(function(){
  $(".history-space").css("height",$(".history-space").height());
  hammertime = new Hammer($(".history-space")[0]);
  hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  hammertime
    .on('swipeup',vm.down)
    .on('swipedown', vm.up);
  hammertime1 = new Hammer($(".work-space")[0]);
  hammertime1.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
  hammertime1
    .on('swipeup',vm.down)
    .on('swipedown', vm.up);


})









