class OBJ {
  constructor(fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.usemtl=new  Array(0); 
    this.objectname = null   // Initialize the property for Object
    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal
    this.verticesIndices=new Array(0);
    this.normalsIndexs=new Array(0);
    //重建索引
    this._normals=new Array(0);
    this._vertices=new Array(0);
    this._no_index_vertices=new Array(0);
    this._no_index_normals=new Array(0);
    this.mix_vertices=new Array(0);
    this.mix_verticesIndices=new Array(0);
  }
  /**
   * @param  {加载obj文件}
   * @return {[type]}
   */
  loaded(callback){
    this.requestFile(this.fileName,(data)=>{
      this.parse(data);
      this.reIndex();
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
  /**
   * 重建索引
   * @return {[type]} [description]
   */
  reIndex(){
    let that=this;
    let vertexs=[];
    this._no_index_vertices.map((item,i)=>{
      vertexs.push(item.concat(this._no_index_normals[i]).join(","))
    })
    let tempVertexs =[...new Set(vertexs)]
    vertexs.map(function(item){
      that.mix_verticesIndices.push(tempVertexs.indexOf(item))
    })
    tempVertexs.map((item)=>{
      that.mix_vertices=that.mix_vertices.concat(item.split(","));
    })
    that.mix_vertices.map((item,i)=>{
      that.mix_vertices[i]=parseFloat(item)
    })
  }
  /**
   * 解析过程
   * @param  {[type]} content [description]
   * @return {[type]}         [description]
   */
  parse(content){
    let that=this;
    //解析line
    let parseLine=(line)=>{
      let values=line.match(/[\w\.\-\/]+/g);
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
          that._addVertex(lineObj.values)
          break;
        case "vn":
          that._addNormals(lineObj.values)
          break;
        case "f":
          that._addFace(lineObj.values)
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
  /**
   * 顶点解析
   * @param {[type]} values [description]
   * @param {[type]} key    [description]
   */
  _addVertex(values,key){
    values.length!=3 &&  console.error("vertex parse error")
    let point=[
      parseFloat(values[0]),
      parseFloat(values[1]),
      parseFloat(values[2])
    ];
    this._vertices.push(point)
    this.vertices.concat(point)
  }
  /**
   * 法向量解析
   * @param {[type]} values [description]
   * @param {[type]} key    [description]
   */
  _addNormals(values,key){
    values.length!=3 &&  console.error("normals parse error")
    let point=[
      parseFloat(values[0]),
      parseFloat(values[1]),
      parseFloat(values[2])
    ]
    this._normals.push(point)
    this.normals.concat(point);

  }
  /**
   * 索引解析
   * @param {[type]} values [description]
   * @param {[type]} key    [description]
   */
  _addFace(values,key){
    values.length!=3 &&  console.error("请用'triangulate faces'导出obj,顶点索引|材质索引|法线索引");
    let vf1=parseInt(values[0].split("/")[0])-1;
    let vf2=parseInt(values[1].split("/")[0])-1;
    let vf3=parseInt(values[2].split("/")[0])-1;
    this.verticesIndices.push(vf1,vf2,vf3);
    this._no_index_vertices.push(
      this._vertices[vf1],
      this._vertices[vf2],
      this._vertices[vf3],
    )
    let nf1=parseInt(values[0].split("/")[2])-1;
    let nf2=parseInt(values[1].split("/")[2])-1;
    let nf3=parseInt(values[2].split("/")[2])-1;
    this.normalsIndexs.push(nf1,nf2,nf3);
    this._no_index_normals.push(
      this._normals[nf1],
      this._normals[nf2],
      this._normals[nf3],
    )
  }
}


//重新建立索引














