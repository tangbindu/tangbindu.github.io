
var searchList={
  googlePronunciation: "https://www.google.com/search?&q=pronunciation+",
  googleImage: "https://www.google.com/search?tbm=isch&q=",
  googleNews: "https://news.google.com/search?q=",
  youtube: "https://www.youtube.com/results?search_query=",
  baidu: "https://fanyi.baidu.com/#en/zh/"
}

function openPages(words){
  for(var ifr in searchList){
    window[ifr]=window.open(searchList[ifr]+words);
  }
}
function closePages(){
  for(var ifr in searchList){
   window[ifr] && window[ifr].close();
  }
}

var input=document.getElementById("translateInput");
input.addEventListener("keyup",translate)
function translate(e){
  // this.value="safsaf";
  // return;
  // console.log(this.value);
  // return;
  this.value=this.value.replace(/[^\w\s\.\/]/g,'');
  var words=this.value; 
  if (e.keyCode == 13) {
    openPages(words)
  }
  if (e.keyCode == 8) {
    closePages(words)
  }
}





