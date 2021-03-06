
//初始化webgl
function initwebgl(canvas,VSHADER_SOURCE, FSHADER_SOURCE){
  //canvas 对象
  //VSHADER_SOURCE 顶点着色器代码
  //FSHADER_SOURCE 片元着色器代码
  var gl;//webgl object
  //定宽高（适配retina）
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
  //获取gl
  gl = canvas.getContext('webgl');
  //定视图区
  gl.viewport(0, 0, canvas.width, canvas.height);
  //定色彩模型
  gl.clearColor(23 / 255, 48 / 250, 41 / 255, 1.0);
  //清理画布
  gl.clear(gl.COLOR_BUFFER_BIT);
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
  // var vertexShaderDebug = gl.getExtension('WEBGL_debug_shaders').getTranslatedShaderSource(vertexShader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
  // var fragmentShaderDebug = gl.getExtension('WEBGL_debug_shaders').getTranslatedShaderSource(fragmentShader);
  //创建一个程序
  gl.program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(gl.program);
  gl.vertexShader = vertexShader;
  gl.fragmentShader = fragmentShader;
  return gl;
}
/**
 * Create 着色器对象
 * @param gl webgl
 * @param 不同类型着色器对象
 * @param 着色器源程序（字符串）
 */
function createShader(gl, type, source) {
  //创建着色器
  var shader = gl.createShader(type);
  //给着色器添加着色代码
  gl.shaderSource(shader, source);
  //编译着色器
  gl.compileShader(shader);
  //检查着色器的编译状态
  //gl.getShaderParameter(shader,gl.COMPILE_STATUS)
  return shader;
}
/**
 * 创建webgl使用的程序对象
 * @param vshader 顶点着色器
 * @param fshader 片源着色器
 */
function createProgram(gl, vshader, fshader) {
  //创建顶点着色器和片元着色器;
  //创建程序对象，程序对象涵盖了着色器，可以和着色器进行数据交互
  var program = gl.createProgram();
  //为程序对象分配顶点着色器和片元着色器
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  //连接着色器
  gl.linkProgram(program);
  // 检查连接结果
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('程序连接失败: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(vshader);
    gl.deleteShader(fshader);
    return null;
  }
  return program;
}



//ajax请求文件
function AjaxGetFile(path,callback){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && callback) {
      callback(xmlhttp.responseText);
    }
  };
  xmlhttp.open("GET", path, true);
  xmlhttp.send();
}

//加载着色齐资源
Promise.all([
  //顶点着色器
  new Promise(function(resolve,reject){
    AjaxGetFile("../js/vertex.glsl",function(filedata){
      resolve(filedata);
    });
  }),
  //片元着色器
  new Promise(function(resolve,reject){
    AjaxGetFile("../js/fragment.glsl",function(filedata){
      resolve(filedata);
    });
  })
]).then(function(data){
  //获取gl
  var gl=initwebgl(
    document.getElementById("webgl_demo"),
    data[0], 
    data[1]
  );


  var n = initVertexBuffers(gl);
  // Set texture
  initTextures(gl, n)

  function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
      -0.5,  0.5,   
      -0.5, -0.5,   
       0.5,  0.5,   
       0.5, -0.5,   
    ]);
    var vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    // var V_FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    var position = gl.getAttribLocation(gl.program, 'position');
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);  

    var texturecoords=new Float32Array([
      0.0, 1.0,
      0.0, 0.0,
      1.0, 1.0,
      1.0, 0.0,
    ])
    var texturecoordsBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texturecoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texturecoords,gl.STATIC_DRAW);
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    // var T_FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false,0, 0);
    gl.enableVertexAttribArray(a_TexCoord); 

    var n = 4;  
    return n;
  }

  function initTextures(gl, n) {
    var image = new Image();
    image.onload = function(){ 
      var texture = gl.createTexture();
      var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
      loadTexture(gl, n, texture, u_Sampler, image); 
    };
    image.src = '../img/sky.png';
  }

  function loadTexture(gl, n, texture, u_Sampler, image) {
    //解决png的问题
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
    //gl.clearColor(255/255, 255/250, 255/255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  }
});












