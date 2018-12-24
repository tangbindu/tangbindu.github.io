// function dateToDay(date) {
//   return new String(new Date(date.toLocaleDateString()).getTime()).slice(0, 8);
// }
Vue.filter('to2', function(value) {
  value = (value + "").length == 1 ? "0" + value : value;
  return value;
})
Vue.filter('date', function(value) {
  if (!value) {
    return new Date().toLocaleDateString()
  }
  return new Date(value).toLocaleDateString();
})
Vue.filter('sdate', function(value) {
  var today = new Date().toLocaleDateString();
  var tomorrow = new Date(new Date().getTime()+24*60*60*1000).toLocaleDateString();
  var aftertomorrow = new Date(new Date().getTime()+48*60*60*1000).toLocaleDateString();
  var dateStr=new Date(Number(value + "00000")).toLocaleDateString();
  if(today==dateStr){
    return "今天"
  }
  if(tomorrow==dateStr){
    return "明天"
  }
  if(aftertomorrow==dateStr){
    return "后天"
  }
  return dateStr;
})
Vue.filter('formatName', function(value) {
  if (value) {
    return value
  }
  return value;
  // return "任务名称"
})

var util={
  //缩小日期时间戳字符
  dateToDay:function(date){
    return new String(new Date(date.toLocaleDateString()).getTime()).slice(0, 8);
  },
  //获取url查询参数
  getQueryString:function(name){
    var reg = new RegExp('(^|&;)' + name + '=([^&;]*)(&;|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
}