var config = {
  syncURL: "https://wd1894186327hfvsvf.wilddogio.com" //输入节点 URL
};
wilddog.initializeApp(config);
var ref = wilddog.sync().ref();


//临时方案 = 中转ref
// personObj={
//   "yyy":{

//   },
//   "xxx":{

//   }
// }
if(!localStorage.getItem("xgdk")){
  localStorage.setItem("xgdk",JSON.stringify({
    "bowentang":{}
  }))
}
ref={
  data:JSON.parse(localStorage.getItem("xgdk")),
  currentKeyVal:null,
  update(data){
    for(var i in data){
      var ldata=JSON.parse(localStorage.getItem("xgdk"));
      ldata[i]=data[i];
      localStorage.setItem("xgdk",JSON.stringify(ldata))
    }
  },
  orderByKey(){
    return this;
  },
  equalTo(dataName){
    this.currentKeyVal=this.data[dataName];
    return this;
  },
  on(param,callback){
    var that=this;
    var obj={
      val(){
        return that.data;
      }
    }
    callback && callback(obj)
  }
}
//临时方案


var dataControl={
  //提交数据
  push:function(userName,data){
    var personObj=new Object();
    personObj[userName]=data;
    ref.update(personObj);
  }
}



// var personObj=new Object();
// personObj["test"]={"tasksIndex":0}
// ref.update(personObj)








// 
// //写入数据
// ref.set({
//   "messageboard":{
//     "message1":{
//         "content" : "Wilddog, Cool!",
//         "presenter" : "Jack吗"
//     }
//   }
// });
// //监听数据
// //snapshot 里面的数据会一直和云端保持同步
// ref.on("value", function(snapshot){
//     console.log(snapshot.val());
// });

// // 如果你只想监听一次，那么你可以使用 once()
// ref.once("value").then(function(snapshot){
//     console.info(snapshot.val());
// }).catch(function(err){
//     console.error(err);
// });