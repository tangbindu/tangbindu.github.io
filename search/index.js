


let searchList=[
  {
    name: "search",
    // regExp:/[^\w\s\.\/]/g,
    list:{
      quora: "https://www.quora.com/search?q=",
      bing: "http://www.bing.com/search?q=",
      yahoo: "https://search.yahoo.com/search?p=",
      wikipedia: "https://en.wikipedia.org/wiki/",
      baidu: "https://www.baidu.com/s?wd=japan",
      duckduckgo: "https://duckduckgo.com/?q=",
      google: "https://www.google.com/search?q="
    }
  },
  {
    name: "translate",
    // regExp:/[^\w\s\.\/]/g,
    list:{
      googletranslate: "https://translate.google.com/?tl=zh-CN&text=",
      youtubetranslate: "https://www.youtube.com/results?search_query=",
      googleImagetranslate: "https://www.google.com/search?tbm=isch&q=",
      wikipediatranslate: "https://en.wikipedia.org/wiki/",
      quoratranslate: "https://www.quora.com/search?q=",
      googlePronunciationtranslate: "https://www.google.com/search?&q=pronunciation+",
      baidutranslate: "https://fanyi.baidu.com/#en/zh/"
    }
  },
  {
    name: "graphic design",
    list:{
      dribbble: "https://dribbble.com/search?q=",
      zcool: "https://www.zcool.com.cn/search/content?&word=",
      unsplash: "https://unsplash.com/search/photos/",
      iconfont: "https://www.iconfont.cn/search/index?q=",
      sketchrepo: "https://sketchrepo.com/?s="
    }
  },
  {
    name: "news",
    list:{
      googleNews: "https://news.google.com/search?q=",
      sogouNews: "https://www.sogou.com/tx?query=",
      baiduNews: "https://www.baidu.com/s?tn=news&word="
    }
  },
];




let search={
  "searchList":searchList,
  init:function(){
    this.searchList.map((item,index)=>{
      item.input=document.createElement("input");
      item.input.setAttribute("class","input c-border-tb");
      item.input.setAttribute("placeholder",item.name);
      item.input.addEventListener("keyup",this.search);
      item.input.data=item;
      document.body.appendChild(item.input);
    })
  },
  openPages:function(searchList,words){
    for(var ifr in searchList){
      window[ifr]=window.open(searchList[ifr]+words);
    }
  },
  closePages:function(searchList){
    for(var ifr in searchList){
      window[ifr] && window[ifr].close();
    }
  },
  search:function(e){
    // 8
    if (e.keyCode == 13) {
      search.openPages(e.target.data.list,this.value)
    }else{
      this.value=e.target.data.regExp?this.value.replace(e.target.data.regExp,''):this.value;
      search.closePages(e.target.data.list,this.value)
    }
  },
  run:function(){

  }
}
search.init();























