/**
 * @description 把静态资源全部输出到js中
 * 引入模版引擎jade
 */
var events=require("events");
var fs=require("fs");
/**
 * @description  引入demoResource模块
 */
var dr=require("./demoResource");
/**
 * 存放demo所用到的所有数据
 * @type {Object}
 */
var cui_data={
	"elem":{},
	"style":{},
	"js":{}
}
/**
 * @description 添加组件group
 */


/**
 * @description 把cui_data写入cui_data.js
 * @description 把cui_data写入cui_data.json
 */

var emitter=new events.EventEmitter();
emitter.on("dataComplete",function(){
	/**
	 * iframe展示需求
	 */
	var cui_data_add_other=Object.assign({},cui_data, {"iframe":dr.getIframe()},{"noview":dr.getNoView()});
	var cui_data_str="resource="+JSON.stringify(cui_data_add_other);
	/**
	 * @description 输出CUIData到js文件中
	 */
	fs.writeFile(config.outputCUIDataPath, cui_data_str, function (err) {
	  if (err) throw err;
	   console.log('cui_data.js\'s saved!'); //文件被保存
	});
	/**
	 * @description 输出CUIData到json文件中
	 */
	var CUIDataJson=CUIDataToJson(cui_data);
	CUIDataJson=JSON.stringify(CUIDataJson);
	//$符号转义
	CUIDataJson=CUIDataJson.replace(/[$]/g,"\\$");
	//去除prepros首字空格bug
	//CUIDataJson=CUIDataJson.replace(/(":"\n)/g,':"\n');
	fs.writeFile(config.outputCUIDataJsonPath, CUIDataJson, function (err) {
	  if (err) throw err;
	   console.log('cui_data.json\'s saved!'); //文件被保存
	});
	/**
	 * @description  自动拷贝css到demo文件夹,为了展示demo
	 */
	fs.readFile(config.inputCUICssPath, "utf8",function (err, data) {
	  if (err) throw err;
	  fs.writeFile(config.outputCUICssPath, data, function (err) {
		  if (err) throw err;
		   console.log('cui.css\'s saved!'); //文件被保存
		});
	});
});
/**
 * cui_data转json
 * @param  {object} cui_data 
 * @return {json} cui_data_json
 */
function CUIDataToJson(cui_data){
	var cui_data_json={};
	cui_data_json["jade"]=[]
	cui_data_json["html"]=[]
	cui_data_json["sass"]=[]
	cui_data_json["css"]=[]
	cui_data_json["jade"]=[]
	for(var i in cui_data["elem"]){
		if(i=="style")
			continue;
		for(var j in cui_data["elem"][i]){
			cui_data_json["jade"].push('(~'+j+'\tcui~','~'+cui_data["elem"][i][j]["jade"]+'~)');
			cui_data_json["html"].push('(~'+j+'\tcui~','~'+cui_data["elem"][i][j]["html"]+'~)');
		}
	}

	for(var i in cui_data["style"]){
		cui_data_json["sass"].push('(~'+i+'\tcui~','~'+cui_data["style"][i]["sass"]+'~)');
		cui_data_json["css"].push('(~'+i+'\tcui~','~'+cui_data["style"][i]["css"]+'~)');
	}

	for(var i in cui_data["js"]){
		cui_data_json["js"].push('(~'+i+'\tcui~','~'+cui_data["js"][i]["js"]+'~)');
	}
	return cui_data_json;
}



/**
 * 读取数据状态
 */
var progress={
	node:false,
	style:false
}
/**
 * @description为cui_data.node添加jade和html
 */
var widgetGroupNames=dr.getWidgetGroupNames();
widgetGroupNames.forEach(function(item){
	cui_data.elem[item]={};
})
var widgetNodeNum=0;
var readedWidgetNodeNum=0;
for(var groupName in cui_data.elem){
	var widgetFileNames=dr.getWidgetFileNamesFromGroup(groupName);
	widgetFileNames.forEach(function(widgetName){
		//计算组件数量
		++widgetNodeNum;
	})
}
for(var groupName in cui_data.elem){
	var widgetFileNames=dr.getWidgetFileNamesFromGroup(groupName);
	widgetFileNames.forEach(function(widgetName){
		cui_data.elem[groupName][widgetName]={};
		(function(groupName,widgetName){
			//过滤css-snippet
			if(groupName=="style"){
				++readedWidgetNodeNum;
				return
			}
			dr.getWidgetJade(widgetName,function(data){
				cui_data.elem[groupName][widgetName]["jade"]=data;
				dr.getWidgetHtml(widgetName,function(data){
					cui_data.elem[groupName][widgetName]["html"]=data;
					//计算读取组件数量
					++readedWidgetNodeNum;
					if(widgetNodeNum==readedWidgetNodeNum){
						//更改状态，发射事件
						progress.node=true;
						if(progress.style==true){
							emitter.emit("dataComplete");
						}
					}
				});
			});
		})(groupName,widgetName)
	})
}



/**
 * @description为cui_data.style添加sass和css
 */
var widgetStyleNum=0;
var readedWidgetStyleNum=0;
var widgetNames=dr.getWidgetClassNames();
widgetStyleNum=widgetNames.length;
widgetNames.forEach(function(widgetName){
	cui_data.style[widgetName]={};
	(function(widgetName){
		dr.getWidgetSass(widgetName,function(data){
			cui_data.style[widgetName]["sass"]=data;
			dr.getWidgetCss(widgetName,function(data){
				cui_data.style[widgetName]["css"]=data;
				++readedWidgetStyleNum;
				if(widgetStyleNum==readedWidgetStyleNum){
					//更改状态，发射事件
					progress.style=true;
					if(progress.node==true){
						emitter.emit("dataComplete");
					}
				};
			});
		});
	})(widgetName)
})








