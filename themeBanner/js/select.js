!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.keyboardJS=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Keyboard=require("./lib/keyboard"),Locale=require("./lib/locale"),KeyCombo=require("./lib/key-combo"),keyboard=new Keyboard;keyboard.setLocale("us",require("./locales/us")),exports=module.exports=keyboard,exports.Keyboard=Keyboard,exports.Locale=Locale,exports.KeyCombo=KeyCombo;
},{"./lib/key-combo":2,"./lib/keyboard":3,"./lib/locale":4,"./locales/us":5}],2:[function(require,module,exports){
function KeyCombo(o){this.sourceStr=o,this.subCombos=KeyCombo.parseComboStr(o),this.keyNames=this.subCombos.reduce(function(o,e){return o.concat(e)})}KeyCombo.sequenceDeliminator=">>",KeyCombo.comboDeliminator=">",KeyCombo.keyDeliminator="+",KeyCombo.parseComboStr=function(o){for(var e=KeyCombo._splitStr(o,KeyCombo.comboDeliminator),t=[],r=0;r<e.length;r+=1)t.push(KeyCombo._splitStr(e[r],KeyCombo.keyDeliminator));return t},KeyCombo.prototype.check=function(o){for(var e=0,t=0;t<this.subCombos.length;t+=1)if(e=this._checkSubCombo(this.subCombos[t],e,o),-1===e)return!1;return!0},KeyCombo.prototype.isEqual=function(o){if(!o||"string"!=typeof o&&"object"!=typeof o)return!1;if("string"==typeof o&&(o=new KeyCombo(o)),this.subCombos.length!==o.subCombos.length)return!1;for(var e=0;e<this.subCombos.length;e+=1)if(this.subCombos[e].length!==o.subCombos[e].length)return!1;for(var e=0;e<this.subCombos.length;e+=1){for(var t=this.subCombos[e],r=o.subCombos[e].slice(0),s=0;s<t.length;s+=1){var i=t[s],n=r.indexOf(i);n>-1&&r.splice(n,1)}if(0!==r.length)return!1}return!0},KeyCombo._splitStr=function(o,e){for(var t=o,r=e,s="",i=[],n=0;n<t.length;n+=1)n>0&&t[n]===r&&"\\"!==t[n-1]&&(i.push(s.trim()),s="",n+=1),s+=t[n];return s&&i.push(s.trim()),i},KeyCombo.prototype._checkSubCombo=function(o,e,t){o=o.slice(0),t=t.slice(e);for(var r=e,s=0;s<o.length;s+=1){var i=o[s];if("\\"===i[0]){var n=i.slice(1);(n===KeyCombo.comboDeliminator||n===KeyCombo.keyDeliminator)&&(i=n)}var b=t.indexOf(i);if(b>-1&&(o.splice(s,1),s-=1,b>r&&(r=b),0===o.length))return r}return-1},module.exports=KeyCombo;
},{}],3:[function(require,module,exports){
(function (global){
function Keyboard(e,t,n,s){this._locale=null,this._currentContext=null,this._contexts={},this._listeners=[],this._appliedListeners=[],this._locales={},this._targetElement=null,this._targetWindow=null,this._targetPlatform="",this._targetUserAgent="",this._isModernBrowser=!1,this._targetKeyDownBinding=null,this._targetKeyUpBinding=null,this._targetResetBinding=null,this._paused=!1,this.setContext("global"),this.watch(e,t,n,s)}var Locale=require("./locale"),KeyCombo=require("./key-combo");Keyboard.prototype.setLocale=function(e,t){var n=null;"string"==typeof e?t?(n=new Locale(e),t(n,this._targetPlatform,this._targetUserAgent)):n=this._locales[e]||null:(n=e,e=n._localeName),this._locale=n,this._locales[e]=n,n&&(this._locale.pressedKeys=n.pressedKeys)},Keyboard.prototype.getLocale=function(e){return e||(e=this._locale.localeName),this._locales[e]||null},Keyboard.prototype.bind=function(e,t,n,s){if((null===e||"function"==typeof e)&&(s=n,n=t,t=e,e=null),e&&"object"==typeof e&&"number"==typeof e.length)for(var r=0;r<e.length;r+=1)this.bind(e[r],t,n);else this._listeners.push({keyCombo:e?new KeyCombo(e):null,pressHandler:t||null,releaseHandler:n||null,preventRepeat:s||!1,preventRepeatByDefault:s||!1})},Keyboard.prototype.addListener=Keyboard.prototype.bind,Keyboard.prototype.on=Keyboard.prototype.bind,Keyboard.prototype.unbind=function(e,t,n){if((null===e||"function"==typeof e)&&(n=t,t=e,e=null),e&&"object"==typeof e&&"number"==typeof e.length)for(var s=0;s<e.length;s+=1)this.unbind(e[s],t,n);else for(var s=0;s<this._listeners.length;s+=1){var r=this._listeners[s],o=!e&&!r.keyCombo||r.keyCombo.isEqual(e),i=!t&&!n||!t&&!r.pressHandler||t===r.pressHandler,l=!t&&!n||!n&&!r.releaseHandler||n===r.releaseHandler;o&&i&&l&&(this._listeners.splice(s,1),s-=1)}},Keyboard.prototype.removeListener=Keyboard.prototype.unbind,Keyboard.prototype.off=Keyboard.prototype.unbind,Keyboard.prototype.setContext=function(e){this._locale&&this.releaseAllKeys(),this._contexts[e]||(this._contexts[e]=[]),this._listeners=this._contexts[e],this._currentContext=e},Keyboard.prototype.getContext=function(){return this._currentContext},Keyboard.prototype.watch=function(e,t,n,s){var r=this;this.stop(),e&&null!==e||(e=global),"number"==typeof e.nodeType&&(s=n,n=t,t=e,e=global);var o=e.navigator&&e.navigator.userAgent||"",i=e.navigator&&e.navigator.platform||"";t&&null!==t||(t=e.document),n&&null!==n||(n=i),s&&null!==s||(s=o),this._isModernBrowser=!!e.addEventListener,this._targetKeyDownBinding=function(e){r.pressKey(e.keyCode,e)},this._targetKeyUpBinding=function(e){r.releaseKey(e.keyCode,e)},this._targetResetBinding=function(e){r.releaseAllKeys(e)},this._bindEvent(t,"keydown",this._targetKeyDownBinding),this._bindEvent(t,"keyup",this._targetKeyUpBinding),this._bindEvent(e,"focus",this._targetResetBinding),this._bindEvent(e,"blur",this._targetResetBinding),this._targetElement=t,this._targetWindow=e,this._targetPlatform=n,this._targetUserAgent=s},Keyboard.prototype.stop=function(){this._targetElement&&this._targetWindow&&(this._unbindEvent(this._targetElement,"keydown",this._targetKeyDownBinding),this._unbindEvent(this._targetElement,"keyup",this._targetKeyUpBinding),this._unbindEvent(this._targetWindow,"focus",this._targetResetBinding),this._unbindEvent(this._targetWindow,"blur",this._targetResetBinding),this._targetWindow=null,this._targetElement=null)},Keyboard.prototype.pressKey=function(e,t){if(!this._paused){if(!this._locale)throw new Error("Locale not set");this._locale.pressKey(e),this._applyBindings(t)}},Keyboard.prototype.releaseKey=function(e,t){if(!this._paused){if(!this._locale)throw new Error("Locale not set");this._locale.releaseKey(e),this._clearBindings(t)}},Keyboard.prototype.releaseAllKeys=function(e){if(!this._paused){if(!this._locale)throw new Error("Locale not set");this._locale.pressedKeys.length=0,this._clearBindings(e)}},Keyboard.prototype.pause=function(){this._paused||(this._locale&&this.releaseAllKeys(),this._paused=!0)},Keyboard.prototype.resume=function(){this._paused=!1},Keyboard.prototype.reset=function(){this.releaseAllKeys(),this._listeners.length=0},Keyboard.prototype._bindEvent=function(e,t,n){return this._isModernBrowser?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},Keyboard.prototype._unbindEvent=function(e,t,n){return this._isModernBrowser?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},Keyboard.prototype._getGroupedListeners=function(){var e=[],t=[],n=this._listeners;return"global"!==this._currentContext&&(n=[].concat(n,this._contexts.global)),n.sort(function(e,t){return e.keyCombo.keyNames.length<t.keyCombo.keyNames.length}).forEach(function(n){for(var s=-1,r=0;r<t.length;r+=1)t[r].isEqual(n.keyCombo)&&(s=r);-1===s&&(s=t.length,t.push(n.keyCombo)),e[s]||(e[s]=[]),e[s].push(n)}),e},Keyboard.prototype._applyBindings=function(e){var t=!1;e||(e={}),e.preventRepeat=function(){t=!0},e.pressedKeys=this._locale.pressedKeys.slice(0);for(var n=this._locale.pressedKeys.slice(0),s=this._getGroupedListeners(),r=0;r<s.length;r+=1){var o=s[r],i=o[0].keyCombo;if(null===i||i.check(n)){for(var l=0;l<o.length;l+=1){var a=o[l];null===i&&(a={keyCombo:new KeyCombo(n.join("+")),pressHandler:a.pressHandler,releaseHandler:a.releaseHandler,preventRepeat:a.preventRepeat,preventRepeatByDefault:a.preventRepeatByDefault}),a.pressHandler&&!a.preventRepeat&&(a.pressHandler.call(this,e),t&&(a.preventRepeat=t,t=!1)),a.releaseHandler&&-1===this._appliedListeners.indexOf(a)&&this._appliedListeners.push(a)}if(i)for(var l=0;l<i.keyNames.length;l+=1){var p=n.indexOf(i.keyNames[l]);-1!==p&&(n.splice(p,1),l-=1)}}}},Keyboard.prototype._clearBindings=function(e){e||(e={});for(var t=0;t<this._appliedListeners.length;t+=1){var n=this._appliedListeners[t],s=n.keyCombo;null!==s&&s.check(this._locale.pressedKeys)||(n.preventRepeat=n.preventRepeatByDefault,n.releaseHandler.call(this,e),this._appliedListeners.splice(t,1),t-=1)}},module.exports=Keyboard;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./key-combo":2,"./locale":4}],4:[function(require,module,exports){
function Locale(e){this.localeName=e,this.pressedKeys=[],this._appliedMacros=[],this._keyMap={},this._killKeyCodes=[],this._macros=[]}var KeyCombo=require("./key-combo");Locale.prototype.bindKeyCode=function(e,s){"string"==typeof s&&(s=[s]),this._keyMap[e]=s},Locale.prototype.bindMacro=function(e,s){"string"==typeof s&&(s=[s]);var t=null;"function"==typeof s&&(t=s,s=null);var o={keyCombo:new KeyCombo(e),keyNames:s,handler:t};this._macros.push(o)},Locale.prototype.getKeyCodes=function(e){var s=[];for(var t in this._keyMap){var o=this._keyMap[t].indexOf(e);o>-1&&s.push(0|t)}return s},Locale.prototype.getKeyNames=function(e){return this._keyMap[e]||[]},Locale.prototype.setKillKey=function(e){if("string"!=typeof e)this._killKeyCodes.push(e);else for(var s=this.getKeyCodes(e),t=0;t<s.length;t+=1)this.setKillKey(s[t])},Locale.prototype.pressKey=function(e){if("string"!=typeof e){for(var s=this.getKeyNames(e),t=0;t<s.length;t+=1)-1===this.pressedKeys.indexOf(s[t])&&this.pressedKeys.push(s[t]);this._applyMacros()}else for(var o=this.getKeyCodes(e),t=0;t<o.length;t+=1)this.pressKey(o[t])},Locale.prototype.releaseKey=function(e){if("string"==typeof e)for(var s=this.getKeyCodes(e),t=0;t<s.length;t+=1)this.releaseKey(s[t]);else{var o=this.getKeyNames(e),r=this._killKeyCodes.indexOf(e);if(r>-1)this.pressedKeys.length=0;else for(var t=0;t<o.length;t+=1){var i=this.pressedKeys.indexOf(o[t]);i>-1&&this.pressedKeys.splice(i,1)}this._clearMacros()}},Locale.prototype._applyMacros=function(){for(var e=this._macros.slice(0),s=0;s<e.length;s+=1){var t=e[s];if(t.keyCombo.check(this.pressedKeys)){t.handler&&(t.keyNames=t.handler(this.pressedKeys));for(var o=0;o<t.keyNames.length;o+=1)-1===this.pressedKeys.indexOf(t.keyNames[o])&&this.pressedKeys.push(t.keyNames[o]);this._appliedMacros.push(t)}}},Locale.prototype._clearMacros=function(){for(var e=0;e<this._appliedMacros.length;e+=1){var s=this._appliedMacros[e];if(!s.keyCombo.check(this.pressedKeys)){for(var t=0;t<s.keyNames.length;t+=1){var o=this.pressedKeys.indexOf(s.keyNames[t]);o>-1&&this.pressedKeys.splice(o,1)}s.handler&&(s.keyNames=null),this._appliedMacros.splice(e,1),e-=1}}},module.exports=Locale;
},{"./key-combo":2}],5:[function(require,module,exports){
module.exports=function(e,d,n){e.bindKeyCode(3,["cancel"]),e.bindKeyCode(8,["backspace"]),e.bindKeyCode(9,["tab"]),e.bindKeyCode(12,["clear"]),e.bindKeyCode(13,["enter"]),e.bindKeyCode(16,["shift"]),e.bindKeyCode(17,["ctrl"]),e.bindKeyCode(18,["alt","menu"]),e.bindKeyCode(19,["pause","break"]),e.bindKeyCode(20,["capslock"]),e.bindKeyCode(27,["escape","esc"]),e.bindKeyCode(32,["space","spacebar"]),e.bindKeyCode(33,["pageup"]),e.bindKeyCode(34,["pagedown"]),e.bindKeyCode(35,["end"]),e.bindKeyCode(36,["home"]),e.bindKeyCode(37,["left"]),e.bindKeyCode(38,["up"]),e.bindKeyCode(39,["right"]),e.bindKeyCode(40,["down"]),e.bindKeyCode(41,["select"]),e.bindKeyCode(42,["printscreen"]),e.bindKeyCode(43,["execute"]),e.bindKeyCode(44,["snapshot"]),e.bindKeyCode(45,["insert","ins"]),e.bindKeyCode(46,["delete","del"]),e.bindKeyCode(47,["help"]),e.bindKeyCode(145,["scrolllock","scroll"]),e.bindKeyCode(187,["equal","equalsign","="]),e.bindKeyCode(188,["comma",","]),e.bindKeyCode(190,["period","."]),e.bindKeyCode(191,["slash","forwardslash","/"]),e.bindKeyCode(192,["graveaccent","`"]),e.bindKeyCode(219,["openbracket","["]),e.bindKeyCode(220,["backslash","\\"]),e.bindKeyCode(221,["closebracket","]"]),e.bindKeyCode(222,["apostrophe","'"]),e.bindKeyCode(48,["zero","0"]),e.bindKeyCode(49,["one","1"]),e.bindKeyCode(50,["two","2"]),e.bindKeyCode(51,["three","3"]),e.bindKeyCode(52,["four","4"]),e.bindKeyCode(53,["five","5"]),e.bindKeyCode(54,["six","6"]),e.bindKeyCode(55,["seven","7"]),e.bindKeyCode(56,["eight","8"]),e.bindKeyCode(57,["nine","9"]),e.bindKeyCode(96,["numzero","num0"]),e.bindKeyCode(97,["numone","num1"]),e.bindKeyCode(98,["numtwo","num2"]),e.bindKeyCode(99,["numthree","num3"]),e.bindKeyCode(100,["numfour","num4"]),e.bindKeyCode(101,["numfive","num5"]),e.bindKeyCode(102,["numsix","num6"]),e.bindKeyCode(103,["numseven","num7"]),e.bindKeyCode(104,["numeight","num8"]),e.bindKeyCode(105,["numnine","num9"]),e.bindKeyCode(106,["nummultiply","num*"]),e.bindKeyCode(107,["numadd","num+"]),e.bindKeyCode(108,["numenter"]),e.bindKeyCode(109,["numsubtract","num-"]),e.bindKeyCode(110,["numdecimal","num."]),e.bindKeyCode(111,["numdivide","num/"]),e.bindKeyCode(144,["numlock","num"]),e.bindKeyCode(112,["f1"]),e.bindKeyCode(113,["f2"]),e.bindKeyCode(114,["f3"]),e.bindKeyCode(115,["f4"]),e.bindKeyCode(116,["f5"]),e.bindKeyCode(117,["f6"]),e.bindKeyCode(118,["f7"]),e.bindKeyCode(119,["f8"]),e.bindKeyCode(120,["f9"]),e.bindKeyCode(121,["f10"]),e.bindKeyCode(122,["f11"]),e.bindKeyCode(123,["f12"]),e.bindMacro("shift + `",["tilde","~"]),e.bindMacro("shift + 1",["exclamation","exclamationpoint","!"]),e.bindMacro("shift + 2",["at","@"]),e.bindMacro("shift + 3",["number","#"]),e.bindMacro("shift + 4",["dollar","dollars","dollarsign","$"]),e.bindMacro("shift + 5",["percent","%"]),e.bindMacro("shift + 6",["caret","^"]),e.bindMacro("shift + 7",["ampersand","and","&"]),e.bindMacro("shift + 8",["asterisk","*"]),e.bindMacro("shift + 9",["openparen","("]),e.bindMacro("shift + 0",["closeparen",")"]),e.bindMacro("shift + -",["underscore","_"]),e.bindMacro("shift + =",["plus","+"]),e.bindMacro("shift + [",["opencurlybrace","opencurlybracket","{"]),e.bindMacro("shift + ]",["closecurlybrace","closecurlybracket","}"]),e.bindMacro("shift + \\",["verticalbar","|"]),e.bindMacro("shift + ;",["colon",":"]),e.bindMacro("shift + '",["quotationmark","'"]),e.bindMacro("shift + !,",["openanglebracket","<"]),e.bindMacro("shift + .",["closeanglebracket",">"]),e.bindMacro("shift + /",["questionmark","?"]);for(var i=65;90>=i;i+=1){var o=String.fromCharCode(i+32),b=String.fromCharCode(i);e.bindKeyCode(i,o),e.bindMacro("shift + "+o,b),e.bindMacro("capslock + "+o,b)}var a,r,c=n.match("Firefox")?59:186,t=n.match("Firefox")?173:189;d.match("Mac")&&(n.match("Safari")||n.match("Chrome"))?(a=91,r=93):d.match("Mac")&&n.match("Opera")?(a=17,r=17):d.match("Mac")&&n.match("Firefox")&&(a=224,r=224),e.bindKeyCode(c,["semicolon",";"]),e.bindKeyCode(t,["dash","-"]),e.bindKeyCode(a,["command","windows","win","super","leftcommand","leftwindows","leftwin","leftsuper"]),e.bindKeyCode(r,["command","windows","win","super","rightcommand","rightwindows","rightwin","rightsuper"]),e.setKillKey("command")};
},{}]},{},[1])(1)
});





var stage=$("#stage");



document.onkeydown=function(event){
  if(/Mac/.test(navigator.platform)){
    if(event.keyCode==8){
      if(document.activeElement.tagName.toLowerCase()!="input"){
        removeIcon($(".icon-img.active"));
        event.preventDefault();
        return false;
      }
    }
  }else{
    if(event.keyCode==46){
      if(document.activeElement.tagName.toLowerCase()!="input"){
        removeIcon($(".icon-img.active"));
        event.preventDefault();
        return false;
      }
    }
  }
}




//全选
keyboardJS.bind('ctrl + a', function(e) {
  choise_icon(stage.find(".icon-img"));
  $(".resize-icon input").eq(0).focus();
  return false;
});
keyboardJS.bind('command + a', function(e) {
  choise_icon(stage.find(".icon-img"));
  $(".resize-icon input").eq(0).focus();
  return false;
});

//反选
keyboardJS.bind('ctrl + i', function(e) {
  var choise=stage.find(".icon-img.active");
  var other=stage.find(".icon-img").not(".active");
  unchoise_icon(choise);
  choise_icon(other);
  e.preventDefault();
  return false;
});

keyboardJS.bind('command + i', function(e) {
  var choise=stage.find(".icon-img.active");
  var other=stage.find(".icon-img").not(".active");
  unchoise_icon(choise);
  choise_icon(other);
  e.preventDefault();
  return false;
});
//取消选择
keyboardJS.bind('ctrl + d', function(e) {
  var choise=stage.find(".icon-img.active");
  unchoise_icon(choise);
  e.preventDefault();
  return false;
});
keyboardJS.bind('command + d', function(e) {
  var choise=stage.find(".icon-img.active");
  unchoise_icon(choise);
  e.preventDefault();
  return false;
});