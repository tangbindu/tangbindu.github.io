var config = {
  syncURL: "https://wd1894186327hfvsvf.wilddogio.com" //输入节点 URL
};
wilddog.initializeApp(config);
var ref = wilddog.sync().ref();


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