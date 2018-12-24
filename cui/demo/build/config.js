/**
 * cui	demo预览配置
 * @type {Object}
 * @property {object} cuilist 按名字顺序显示组件
 * @property {string} cuiNameListTemplate cui组件名称view模版
 */
config={
	"widgetGroup":{
		"init":[
			"init",
			"init-ec",
			"init-health",
			"init-avatar"
		],
		"ui-btn":[
			"ui-btn",
			"ui-btn.ui-btn-primary",
			"ui-btn.ui-btn-danger",
			"ui-btn.ui-btn-lg",
			"ui-btn.ui-btn-lg.ui-btn-primary",
			"ui-btn.ui-btn-lg.ui-btn-danger"
		],
		"lm-btn":[
			"lm-btn",
			"lm-btn.lm-btn-primary",
			"lm-btn.lm-btn-primary.lm-btn-lg",
			"lm-btn.lm-btn-primary.lm-btn-style-1"
		],
		"c-border":[
			"c-border-t",
			"c-border-b",
			"c-border-l",
			"c-border-r",
			"c-border-tb"
		],
		"ui-list":[
			"ui-list.c-border-tb",
			"ui-list.ui-list-function.c-border-tb",
			"ui-list.ui-list-avatar.c-border-tb",
			"ui-list.ui-list-avatar.ui-list-function.c-border-tb"
		],
		"list":[
			"list",
			"list.list-rule",
			"list.list-rule-type1"
		],
		"c-table":[
			"c-row",
			"c-row.c-row-style-1",
			"c-row.c-row-left",
			"c-row.c-row-right",
			"c-row.c-row-top",
			"c-row.c-row-bottom",
			"c-col",
			"table"
		],
		"lm-list":[
			"lm-list",
			"lm-list.lm-list-thumb.c-border-tb",
			"lm-list.lm-list-thumb.lm-list-function.c-border-tb",
			"lm-list.lm-list-avatar",
			"lm-list.lm-list-type1"
		],
		"ec-grid":[
			"ec-grid.ec-grid-img.ec-grid-2",
			"ec-grid.ec-grid-img.ec-grid-info.ec-grid-2",
			"ec-grid.ec-grid-img.ec-grid-3",
			"ec-grid.ec-grid-img.ec-grid-4"
		],
		"img":[
			"ui-avatar",
			"ui-avatar.ui-avatar-s",
			"lm-avatar",
			"ec-avatar",
			"lm-thumb"
		],
		"lm-ico":[
			"lm-ico-bean",
			"lm-ico-crystal",
			"lm-ico-lmk",
			"lm-ico-gold-coins",
			"lm-ico-gold-coins-gray",
			"lm-ico-time",
			"lm-ico-population",
			"lm-ico-box",
			"lm-ico-upgrade",
			"lm-ico-star",
			"lm-ico-arrow-3",
			"lm-ico-arrow-gray-3",
			"lm-ico-bean-large"
		],
		"text":[
			"text-block",
			"ec-textblock-list",
			"c-del"
		],
		"title":[
			"c-title",
			"c-title.c-title-style-1",
			"c-title.c-title-style-2"
		],
		"ec-searchbar":[
			"ec-searchbar"
		],
		"ec-copyright":[
			"ec-copyright"
		],
		"input & textarea":[
			"input",
			"textarea"
		],
		"widget":[
			"lm-progress",
			"star-box",
			"arrow-pop",
			"reddot"
		],
		"lm-tab":[
			"lm-tab"
		],
		"ui-slider":[
			"ui-slider"
		],
		"layout":[
			"layout"
		],
		"page-card":[
			"page-card"
		],
		"page-single":[
			"page-single"
		],
		"dialog":[
			"dialog"
		],
		"guide":[
			"guide"
		],
		"notice":[
			"notice"
		],
		"banner":[
			"banner"
		],
		"swipe":[
			"swipe"
		],
		"swipe-type1":[
			"swipe-type1"
		],
		"js-link":[
			"js-zepto.min",
			"js-rem.min",
			"js-motion.loader",
			"js-motion.pageslide",
			"js-motion.loader.pageslide",
			"js-ui.min",
			"js-ui.slider.min",
		],
		"class":[
			"c-nowrap",
			"c-nowrap-multi",
			"c-nowrap-multi-2",
			"c-nowrap-multi-3",
			"ui-list-info"
		],
		"style":[
			"style-font",
			"style-layout-absolute",
			"style-layout-full-absolute",
			"style-background",
			"style-sprite-px",
			"style-sprite-rem",
			"style-display-box",
			"style-text-block",
			"style-keyframes",
			"style-animation",
			"style-nowrap-multi",
			"style-nowrap",
			"style-after-or-before",
			"style-gradient-linear",
			"style-active"
		],
	},
	//iframe结构的
	"iframe":[
		"dialog",
		"guide",
		"swipe",
		"page-card",
		"page-single",
		"ui-slider",
		"ec-searchbar",
		"notice",
		"swipe-type1"
	],
	//不显示的组合
	"noview":[
		"layout",
		"init",
		"class",
		"style",
		"js-link"
	],
	/*module 中的相对路径*/
	"jadePath":"../../../ui/src/jade",
	"htmlPath":"../../../ui/dist/html",
	"sassPath":"../../../ui/src/sass",
	"cssPath":"../../../ui/dist/css",
	"outputCUIDataPath":"../../dist/js/CUIData.js",
	"outputCUIDataJsonPath":"../../dist/js/CUIData.json",
	/*拷贝ui的css给demo做预览使用*/
	"inputCUICssPath":"../../../ui/dist/css/cui.css",
	"outputCUICssPath":"../../dist/css/cui.css"
};
module.exports=config;


