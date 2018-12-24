var group=Object.keys(resource.elem);
var elem={};
var style=resource.style;
for(var i in resource.elem){
	for(var j in resource.elem[i]){
		elem[j]=resource.elem[i][j]
	}
}
/**
 * ui_group
 */
var ui_group=""
for(var i in resource.elem){
	ui_group+=("<dl data-group="+i+"><dt><a href='#"+i+"'>"+i+"</a></dt>");
	for(var j in resource.elem[i]){
		ui_group+=("<dd data-widget="+j+"><a href='#"+j+"'>"+j+"</a></dd>")
	}
	ui_group+="</dl>";
}
$('#ui-group').html(ui_group);

/**
 * ui-view
 */
var ui_view_html=""
for(var i in resource.elem){
	//ui_view_html+=("<dl><dt><a id="+i+">"+i+"</a></dt>");
	if(i=="js" || i=="style")
		continue;
	ui_view_html+=("<dl><dt>"+i+"</a></dt>");
	for(var j in resource.elem[i]){
		if(resource.iframe.indexOf(j)!=-1){
			ui_view_html+=("<dd data-widget="+j+"><textarea>"+resource.elem[i][j]["html"]+"</textarea></dd>")
			continue;
		}
		ui_view_html+=("<dd data-widget="+j+">"+resource.elem[i][j]["html"]+"</dd>")
	}
	ui_view_html+="</dl>";
}
$('#ui-view').html(ui_view_html);
/**
 * iframe 展示代码的函数
 */
function nodeWrapIframe(node){
	var ifr=document.createElement("iframe");
	console.dir(ifr)
	ifr.setAttribute("frameborder","0");
	node.append($(ifr))
	//ifr.src="https://10.66.67.159:8001/dist/html/demo.html";
	//追加样式
	var doc = ifr.contentWindow.document;

    doc.open();
    doc.write('<html data-use-rem>');
    doc.write('<body>');
    doc.write('<link rel="stylesheet" href="../css/cui.css"/>'+node.children()[0].value);
    doc.write('<script>(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()=="NaN"?750:parseInt(option);var grids=baseWidth/100;var clientWidth=355;html.style.fontSize=clientWidth/grids+"px";var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(testDomWidth!==Math.round(clientWidth/grids)){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}};;var reCalc=function(){var newCW=355;if(newCW===clientWidth){return}clientWidth=newCW;html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px"};reCalc();if(!doc.addEventListener){return}var resizeEvt="orientationchange" in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);</script>');
    doc.close();
	$(node.children()[0]).remove();
}
resource.iframe.forEach(function(item){
	console.log(item)
	//节点
	var node=$("#ui-view").find("[data-widget="+item+"]");
	nodeWrapIframe(node);
})

/*
*隐藏
*/
resource.noview.forEach(function(item){
	$("#ui-view>dl>dt").each(function(){
		if($(this).text()==item){
			$(this).parent().hide();
		}
	})
})


/**
 * 展示代码的函数
 * @param {string} group btn
 * @param  {string} name 如.c-btn.c-btn-primary
 * @return {object} data     
 */
function getUiCode(name){
	var code_jade,code_html,code_scss,code_css,data={};
	data.jade=elem[name]["jade"];
	data.html=elem[name]["html"];
	var styleNames=name.split(".");
	data.sass="";
	data.css ="";
	styleNames.forEach(function(styleName){
		try{
			data.sass+=style[styleName]["sass"];
			data.css+=style[styleName]["css"];
		}catch(e){
			console.log()
		}
	})
	return data;
}

/**
 * ui-code
 */
/**
 * 交互区
 */
$("dd[data-widget]").bind({
	"mouseenter":function(event) {
		showElem($(this),event)
	}
});
function showElem(node,event){
	/* Act on the event */
	var widget=node.data("widget");
	$("dd[data-widget]").removeClass('current');
	$("dd[data-widget='"+widget+"']").addClass('current');
	var uiCode=getUiCode(widget);
	uiCode=$.extend(true, {
		"jade":"",
		"html":"",
		"sass":"",
		"css":""
	}, uiCode);
	uiCode.html=uiCode.html.replace(/[<>&"]/g, function(c) {
	    return {
	        '<':'&lt;',
	        '>':'&gt;',
	        '&':'&amp;',
	        '"':'&quot;'
	    }[c];
	})
	$("#ui-code-jade").html(uiCode.jade)
	$("#ui-code-sass").html(uiCode.sass)
	$("#ui-code-html").html(uiCode.html)
	$("#ui-code-css").html(uiCode.css)
	$(".prettyprinted").removeClass('prettyprinted');
	PR.prettyPrint();
}
$("#ui-group").find("dd").eq(0).trigger("mouseenter");





// var ui_view_html=""
// for(var i in resource){
// 	for(var j in resource[i]){
// 		ui_view_html+=resource[i][j]["html"];
// 	}
// }
// ui_view_html=ui_view_html.replace(/[<>&"]/g, function(c) {
//     return {
//         '<':'&lt;',
//         '>':'&gt;',
//         '&':'&amp;',
//         '"':'&quot;'
//     }[c];
// })
// $('#ui-code-html').html(ui_view_html);

$("#full_screen_view").bind("click",function(){
	$("body").toggleClass("ui-full-view")
})


//平台判断
if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
  $("body").attr("class","ui-mobile-view")
}else{
	//$("body").attr("class","ui-full-view")
}





















































