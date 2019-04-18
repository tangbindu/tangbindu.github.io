class OBJ {
  constructor(fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.objects = new Array(0);   // Initialize the property for Object
    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal
  }
  /**
   * @param  {加载obj文件}
   * @return {[type]}
   */
  load(callback){
    this.requestFile(this.fileName,(data)=>{
      callback && callback(data)
    })
  }
  //ajax请求文件
  /**
   * @param  {请求文件}
   * @param  {文件路径}
   * @return {回调}
   */
  requestFile(path,callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && callback) {
        callback(xmlhttp.responseText);
      }
    };
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
  }
}