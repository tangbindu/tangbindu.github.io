/**
 * @author  bowentang
 * @description 根据config的配置文件，生成各种数据（html,jade,scss,css）片段
 */


/**
 * 读取配置文件
 */
var fs      =require("fs");
var config  =require("../config");
var jadePath=config.jadePath;
var htmlPath=config.htmlPath;
var sassPath=config.sassPath;
var cssPath =config.cssPath;

/**
 * 倒出接口对象
 * @type {Object}
 */
module.exports={
	getWidgetGroupNames:function(){
		/**
		 * @description 获取元件组名称
		 * @return {array} 
		 */
		return Object.keys(config.widgetGroup)
	},
	getWidgetClassNames:function(groupName){
		var widgetNames=[]
		for(var i in config.widgetGroup){
			if(i=="js-link")
				continue;
			config.widgetGroup[i].forEach(function(item){
				var arr=item.split(".");
				widgetNames=widgetNames.concat(arr)
			})
		}
		var s=new Set(widgetNames);
		/**
		 * @param {string} groupName 组名称
		 * @return {array} 元件名称数组
		 */
		widgetNames=[];
		s.forEach(function(item){
			widgetNames.push(item)
		})
		return widgetNames;
	},
	getWidgetFileNamesFromGroup:function(groupName){
		return config.widgetGroup[groupName];
	},
	getWidgetJade:function(widgetName,callback){
		/**
		 * @param {string} widgetName 元件名称
		 * @return {array} 元件jade
		 */
		fs.readFile(config.jadePath+"/"+widgetName+".jade","utf8",function(err,data){
			if(err)
				console.log("读取文件失败，文件路径:"+config.jadePath+"/"+widgetName+".jade");
			else
				callback(data)
		})
	},
	getWidgetHtml:function(widgetName,callback){
		/**
		 * @param {string} widgetName 元件名称
		 * @return {array} 元件html
		 */
		fs.readFile(config.htmlPath+"/"+widgetName+".html","utf8",function(err,data){
			if(err)
				console.log("读取文件失败，文件路径:"+config.htmlPath+"/"+widgetName+".html");
			else
				callback(data)	
		})

	},
	getWidgetSass:function(widgetName,callback){
		//塞选css
		/**
		 * @param {string} widgetName 元件名称
		 * @return {array} 元件sass
		 */
		fs.readFile(config.sassPath+"/"+widgetName+".scss","utf8",function(err,data){
			if(err)
				console.log("读取文件失败，文件路径:"+config.sassPath+"/"+widgetName+".scss");
			else
				callback(data)
		})
		
	},
	getWidgetCss:function(widgetName,callback){
		//塞选css
		/**
		 * @param {string} widgetName 元件名称
		 * @return {array} 元件css
		 */
		fs.readFile(config.cssPath+"/"+widgetName+".css","utf8",function(err,data){
			if(err)
				console.log("读取文件失败，文件路径:"+config.cssPath+"/"+widgetName+".css");
			else
				callback(data)
		})
	},
	getIframe:function(){
		return config.iframe;
	},
	getNoView:function(){
		return config.noview;
	}
}


// fs.readFile(ecui_demo_config,function(err,data){
// 	var config=JSON.parse(data.toString());
// 	console.dir(config);
// })

