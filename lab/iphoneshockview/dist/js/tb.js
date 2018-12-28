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
    // gt.handler("ticker", function() {
    //   if (that.growEnd) {
    //     return;
    //   }
    //   that.totalGrowTime += this.stepTime;
    //   //grow
    //   that.grow();
    // });

    // gt.handler("ticker", function() {
    //   if (!that.growEnd) {
    //     return;
    //   }
    //   if (that.delayEnd) {
    //     return;
    //   }
    //   that.totalDelayTime += this.stepTime;
    //   that.delay();
    // });
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







