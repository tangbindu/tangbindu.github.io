const Storage =  {
  get : function (name) {
      return JSON.parse(localStorage.getItem(name))
  },
  set : function (name, val) {
      localStorage.setItem(name, JSON.stringify(val))
  },
  add : function (name, addVal) {
      let oldVal = Storage.get(name)
      if(!oldVal){
        Storage.set(name,[addVal])
      }
      if(oldVal.indexOf(addVal)>=0){
        return;
      }
      let newVal = oldVal.concat([addVal])
      Storage.set(name, newVal)
  }
}



let searchList=[
  {
    name: "translate",
    // regExp:/[^\w\s\.\/]/g,
    list:{
      youtubetranslate: "https://www.youtube.com/results?search_query=",
      googleImagetranslate: "https://www.google.com/search?tbm=isch&q=",
      // wikipediatranslate: "https://en.wikipedia.org/wiki/",
      quoratranslate: "https://www.quora.com/search?q=",
      baidutranslate: "https://fanyi.baidu.com/#en/zh/",
      googlePronunciationtranslate: "https://www.google.com/search?&q=pronunciation+",
      googletranslate: "https://translate.google.com/?tl=zh-CN&text="
    }
  },
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
    name: "graphic design",
    list:{
      dribbble: "https://dribbble.com/search?q=",
      zcool: "https://www.zcool.com.cn/search/content?&word=",
      unsplash: "https://unsplash.com/search/photos/",
      iconfont: "https://www.iconfont.cn/search/index?q=",
      sketchrepo: "https://sketchrepo.com/?s=",
      pexels: "https://www.pexels.com/search/",
      sccnn: "http://so.sccnn.com/search/",
      reshot: "https://www.reshot.com/search/",
      picjumbo: "https://picjumbo.com/?s=",
      pixabay: "https://pixabay.com/images/search/",
      stockvault: "https://www.stockvault.net/free-photos/"
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
  openPages:function(searchList,name,words){
    Storage.add(name,words);
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
      search.openPages(e.target.data.list,e.target.data.name,this.value)
    }else{
      this.value=e.target.data.regExp?this.value.replace(e.target.data.regExp,''):this.value;
      search.closePages(e.target.data.list,this.value)
    }
  },
  run:function(){

  }
}
search.init();


function favoriteSites(){
  var list=[
    {
      name: "花圃",
      href: "https://tangbindu.github.io/huapu/"
    },{
      name: "CUI",
      href: "https://tangbindu.github.io/cui/demo/dist/html/demo.html"
    },{
      name: "knowledge",
      href: "https://tangbindu.github.io/knowledge/"
    }
  ]
  list.map(
    function(item){
      var linkNode= document.createElement("a");
      linkNode.setAttribute("href",item["href"]); 
      linkNode.setAttribute("target","_blank"); 
      linkNode.setAttribute("class","favoriteSite");
      linkNode.innerText=item["name"]
      document.body.appendChild(linkNode);
    }
  )
};
favoriteSites();





















