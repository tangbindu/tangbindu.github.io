class OBJ {
  constructor(fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.usemtl=new  Array(0); 
    this.objectname = null   // Initialize the property for Object
    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal
    this.verticesIndexs=new Array(0);
    this.normalsIndexs=new Array(0);
  }
  /**
   * @param  {加载obj文件}
   * @return {[type]}
   */
  load(callback){
    this.requestFile(this.fileName,(data)=>{
      this.parse(data);
      callback && callback()
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
  parse(content){
    let that=this;
    //解析line
    let parseLine=(line)=>{
      let values=line.match(/[\w\.-\/]+/g);
      values=values || [];
      return {
        key:values[0],
        values:values.slice(1)
      }
    }
    let lines = content.split('\n');
    //遍历
    lines.map((line,index)=>{
      var lineObj=parseLine(line);
      switch(lineObj.key){
        //vertex
        case "v":
          that.addVertex(lineObj.values)
          break;
        case "vn":
          that.addNormals(lineObj.values)
          break;
        case "f":
          that.addFace(lineObj.values)
          break;
        case "o":
          that.objectname=lineObj.values[0];
          break;
        case "mtllib":
          that.mtls=lineObj.values;
          break;
        case "usemtl":
          that.usemtl=lineObj.values;
          break;
        //normals
        //uv
        //point
        //line
        //f face contains 
        //o objectname
        //g groupname
        //usemtl materialname
        //mtllib material library
      }
    })
  }
  addVertex(values,key){
    values.length!=3 &&  console.error("vertex parse error")
    this.vertices.push(
      values[0],
      values[1],
      values[2]
    )
  }
  addNormals(values,key){
    values.length!=3 &&  console.error("normals parse error")
    this.normals.push(
      values[0],
      values[1],
      values[2]
    )
  }
  addFace(values,key){
    values.length!=3 &&  console.error("请用'triangulate faces'导出obj,顶点索引|材质索引|法线索引")
    this.verticesIndexs.push(values[0]);
    this.normalsIndexs.push(values[1]);
  }
}





