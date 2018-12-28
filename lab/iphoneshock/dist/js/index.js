//依赖的事件源
;

function extend(subType, superType) {
  subType.prototype = $.extend(subType.prototype, new superType());
  subType.prototype.constructor = subType;
}
//制作事件驱动源
function eventTarget() {}
eventTarget.prototype = {
  constructor: eventTarget,
  handler: function(type, handler) {
    //添加事件对象
    if (typeof this.handlers == "undefined") {
      this.handlers = {};
    }
    if (typeof this.handlers[type] == 'undefined') {
      this.handlers[type] = new Array();
    }
    this.handlers[type] = this.handlers[type].concat(handler);
  },
  removeHandler: function(type, handler) {
    if (typeof this.handlers == "undefined") {
      this.handlers = {};
    }
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for (var i = 0, len = handlers.length; i < len; i++) {
        if (handler[i] == handler) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
  },
  trigger: function(type) {
    if (typeof this.handlers == "undefined") {
      this.handlers = {};
    }
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type];
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i].call(this, this);
      }
    }
  }
};



//全局时间控制，开始时间，当前步时间
function GlobalTime() {
  this.work = false;
  this.timer = null;
  this.time = 0;
  this.oneStep = 10;
  this.startTime = null; //开始时间
  this.lastTime = null; //上一步的结束时间
  this.stepTime = null; //当前步使用的时间
}
GlobalTime.prototype = {
  //开始,录制
  start: function() {
    var that = this;
    that.trigger("start");
    that.timer && clearInterval(that.timer);
    that.startTime = new Date().getTime();
    that.lastTime = that.startTime;
    that.work = true;
    var curTime = null;
    that.timer = setInterval(function() {
      curTime = new Date().getTime();
      that.stepTime = curTime - that.lastTime;
      that.time+=that.stepTime;
      //触发一次时间变动
      that.trigger("ticker");
      that.lastTime = curTime;
    }, that.oneStep);
  },
  //停止,录制
  stop: function() {

    this.trigger("stop");
    this.work = false;
    this.timer && clearInterval(this.timer);
  }
};
extend(GlobalTime, eventTarget);
var gt = new GlobalTime();





/**
 * 震动bar
 * @method shock
 * @return {[type]} [description]
 */
function Shock(config) {
  config = config || {};
  this.width = config.width || 0;
  this.top = config.top || 0;
  this.right = config.right || 0;
  this.node = $("<div>");
  this.growEnd = false;
  this.delayEnd = false;
  this.totalGrowTime = 0;
  this.totalDelayTime = 0;
  this.init = (function() {
    var that = this;
    this.node.append("<div class='slider'><div class='width'></div></div>");
    this.node.shock=this;
    this.node.css("width", this.width + "px");
    gt.handler("ticker", function() {
      if (that.growEnd) {
        return;
      }
      that.totalGrowTime += this.stepTime;
      //grow
      that.grow();
    });

    gt.handler("ticker", function() {
      if (!that.growEnd) {
        return;
      }
      if (that.delayEnd) {
        return;
      }
      that.totalDelayTime += this.stepTime;
      that.delay();
    });
  }).call(this);
}
Shock.prototype = {
  //设置右边
  setRight: function(right) {
    this.right = right;
    this.setValue();
  },
  //增加右边
  addRight: function(num) {
    this.right += num;
    this.setValue();
  },
  //设置宽度
  setWidth: function(width) {
    this.width = width;
    this.setValue();
  },
  //增加宽度
  addWidth: function(num) {
    this.width += num;
    this.setValue();
  },
  setValue: function() {
    $(this.node).css("width", this.width + "px");
    $(this.node).css("marginRight", this.right + "px");
    $(this.node).find(".width").html(this.width * 10);
  },
  //减少宽度
  removeWidth: function(num) {
    this.width -= num;
    this.setValue();
  },
  //自动增长
  grow: function() {
    this.setWidth(this.totalGrowTime / 10);
    this.setValue();
  },
  //停止增长
  stopGrow: function() {
    this.growEnd = true;
  },
  //延迟
  delay: function() {
    this.setRight(this.totalDelayTime / 10);
    this.setValue();
  },
  stopDelay: function() {
    this.delayEnd = true;
  }
};



/**
 * 时间轴
 */
function TimeLine() {
  this.delay = 0;
  this.shocks = [];
  this.timeLineNode = $(".time-line");
  this.width = this.timeLineNode.width();
  this.init = (function() {
    this.addBiaoXian();
  }).call(this);
}
TimeLine.prototype = {
  addShock: function(){
    var that = this;
    var sk = new Shock({
      right: that.delay
    });
    //添加到shocks
    that.shocks.push(sk);
    //添加到view
    $(sk.node).addClass("shock shock-m");
    that.timeLineNode.append(sk.node);
  },
  //获取第一个振动
  getFirstShock: function() {
    return this.shocks.slice(0, 1)[0];
  },
  //获取最后一个振动
  getLastShock: function() {
    return this.shocks.slice(-1)[0];
  },
  //读取shack的值
  getData: function() {
    var data = [0, parseFloat($(this.getFirstShock().node).css("margin-left")) * 10];
    for (var i = 0; i < this.shocks.length; i++){
      data = data.concat(
        this.shocks[i].width * 10,
        this.shocks[i].right * 10
      );
    }
    return data;
  },
  //添加视图
  addBiaoXian: function() {
    var lineGroup = $("<div class='timelines'></div>");
    for (var i = 0; i < this.width; i += 100) {
      lineGroup.append($("<div>").html(i * 10 / 1000 + "s"));
    }
    this.timeLineNode.append(lineGroup);
  },
  //渲染数据
  renderData:function(shockdata){
    shockdata=shockdata.split(",");
    //重置
    this.reset();
    var shocks=[];
    for(var i=0;i<shockdata.length;i+=2){
      shocks.push([shockdata[i],shockdata[i+1]]);
    }
    for(var j=0;j<shocks.length;j++){
      // console.dir(shocks[j][1]);
      this.addShock();
      this.getLastShock().setWidth(shocks[j][0]/10);
      this.getLastShock().setRight(shocks[j][1]/10);
    }
  },
  //重置事间轴
  reset: function(){
    //清除shock
    $(".time-line").find(".shock").remove();
  }
};
var tl = new TimeLine();



/**
 * 时间游标
 * @method TimeSliderBar
 */
function TimeSliderBar() {
  this.timer = null;
  this.left = 0;
  this.sliderBar = $(".slider-bar");
  this.totalTime = 0;
  this.maxWidth = $(".time-line").width();
  this.init = (function() {
    var that = this;
    gt.handler("ticker", function() {
      that.totalTime = this.time;
      that.move();
      //判断
      if (that.left > that.maxWidth) {
        gt.stop();
        that.trigger("isover");
        $(".record-btn").trigger("click");
      }
    });
  }).call(this);
}
TimeSliderBar.prototype = {
  //移动
  move: function() {
    this.left = this.totalTime / 10;
    this.left=this.left>this.maxWidth?this.maxWidth :this.left;
    this.setValue();
  },
  setValue: function() {
    this.sliderBar.css("left", this.left + 'px');
  },
  //复原
  reset: function() {

  }
};
extend(TimeSliderBar, eventTarget);
var sb = new TimeSliderBar(); //游标





//键盘控制器
function KeyControl() {
  this.down = false;
  this.keyDownNum=0;
  this.init = (function() {
    var that = this;
    $(document).keydown(function(event) {
      if(that.keyDownNum++==0){
        that.trigger("firstKeyDown"); 
      }
      that.trigger("keydown");
    });
    $(document).keyup(function(event) {
      that.trigger("keyup");
    });
  }).call(this);
}
extend(KeyControl, eventTarget);
var kc = new KeyControl();

kc.handler("keydown", function() {
  //keydown  技术问题完善
  if(!gt.work || this.down){
    return;
  }else{
    this.down=true;
  }
  // console.log("keydown");
  tl.getLastShock() && tl.getLastShock().stopDelay();
  tl.addShock();
  //首次
  if(tl.shocks.length==1){
    $(tl.shocks[0].node).css("marginLeft",gt.time/10+"px");
  }
  //首次延迟
  tl.getLastShock().grow();
});
kc.handler("keyup", function() {
  if(!gt.work){
    return;
  }
  this.down=false;
  // console.log("keyup"); 
  tl.getLastShock() && tl.getLastShock().stopGrow();
  tl.getLastShock() && tl.getLastShock().delay();
  var data=tl.getData();
  $(".textarea").eq(0)[0].value=data;
  pushDate(data);
});
kc.handler("firstKeyDown",function(){
  gt.start();
})



//推送数据给野狗
function pushDate(data) {
  //野狗:插入数据
  var ref = new Wilddog("https://wd6162030645bceser.wilddogio.com/");
  ref.set({
    //对应节点
    "data": data,
  }, function(error) {
    if (error == null) {
      console.log("提交成功");
    }
  });
}
//扫描二维码
var qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 150,
  height: 150
});
qrcode.makeCode("https://tangbindu.github.io/lab/iphoneshockview/dist/html/index.html");








