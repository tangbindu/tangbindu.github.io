
//base64
stage.on("click", ".icon-base64", function() {
  var imgBase64=$(this).parent().parent().find("img").attr("src");
    $.post("/base64",{"img":imgBase64},function(data){
      
    })
});