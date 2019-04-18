const CANVAS=document.querySelector("canvas");
const GL=CANVAS.getContext("webgl"); 

const VERTEXSOURCE=document.querySelectorAll("textarea")[0].value
const FRAGMENTSOURCE=document.querySelectorAll("textarea")[1].value

//创建program or shader
let shaderProgram=GL.createProgram();
let vertexShader=GL.createShader(GL.VERTEX_SHADER)
let fragmentShader=GL.createShader(GL.FRAGMENT_SHADER)
//赋值
GL.shaderSource(vertexShader,VERTEXSOURCE);
GL.shaderSource(fragmentShader,FRAGMENTSOURCE);
//编译
GL.compileShader(vertexShader);
!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS) && console.log('顶点error: ' + GL.getShaderInfoLog(vertexShader));
GL.compileShader(fragmentShader);
!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS) && console.log('片元error: ' + GL.getShaderInfoLog(fragmentShader));


//shader关联到程序
GL.attachShader(shaderProgram,vertexShader)
GL.attachShader(shaderProgram,fragmentShader);
//program连接到gl
GL.linkProgram(shaderProgram);
! GL.getProgramParameter(shaderProgram, GL.LINK_STATUS) && GL.getProgramInfoLog('program error: ' + shaderProgram);

//指定使用的program
GL.useProgram(shaderProgram);
//绘制program
let position=GL.getAttribLocation(shaderProgram,"position");
let a_TexCoord = GL.getAttribLocation(shaderProgram, 'a_TexCoord');
let u_Sampler = GL.getUniformLocation(shaderProgram, 'u_Sampler');
let itime =GL.getAttribLocation(shaderProgram, 'itime');
let iresolution =GL.getAttribLocation(shaderProgram, 'iresolution');   
//顶点
let vertexBuffer = GL.createBuffer(new Float32Array([
  -1.0,  1.0,
  -1.0, -1.0,
   1.0,  1.0,
   1.0, -1.0,
]));


//索引

//颜色

//uv

//法线




let circle=new OBJ("../3dmodels/circle.obj")
circle.load((data)=>{
    console.dir(data.slice(0,400))
})




