//设置基础环境
const CANVAS=document.querySelector("canvas");
CANVAS.width=document.body.clientWidth*window.devicePixelRatio
CANVAS.height=document.body.clientWidth*window.devicePixelRatio
CANVAS.style.zoom=1/window.devicePixelRatio
const GL=CANVAS.getContext("webgl"); 


GL.enable(GL.DEPTH_TEST);
GL.enable(GL.BLEND);
GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);



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
let a_Normal=GL.getAttribLocation(shaderProgram, 'a_Normal');
let a_lightDirection=GL.getAttribLocation(shaderProgram, 'a_lightDirection');
let u_MvpMatrix=GL.getUniformLocation(shaderProgram, 'u_MvpMatrix');
let u_transformMatrix=GL.getUniformLocation(shaderProgram, 'u_transformMatrix');

//mvp start
let mvpMatrix = new Matrix4();
mvpMatrix.setPerspective(30, CANVAS.clientWidth/CANVAS.clientHeight, 1, 100);
mvpMatrix.lookAt(
    0 , 0, 10, //视点
    0, 0, 0,  // 观察点
    0, 1, 0 //上方向
);
GL.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
//灯光方向
GL.vertexAttrib3f(a_lightDirection,0.0, 0.0, 1.0);
//transformMatrix 矩阵
// let transformMatrix=new Matrix4();
// transformMatrix.setRotate(90,0,1,0);
// transformMatrix.translate(0,-2,0,0);
// GL.uniformMatrix4fv(u_transformMatrix, false, transformMatrix.elements);

let model=new OBJ("../3dmodels/werewolf.obj");
model.loaded(()=>{
    //顶点
    let vertexsBuffer = GL.createBuffer();// 创建一个缓存区存放顶点数据
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexsBuffer);// 把缓存区绑定给webgl
    let vertices=new Float32Array(model.mix_vertices);//类型化数组
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);// 在webgl的缓存区写入顶点数据
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    GL.vertexAttribPointer(position, 3, GL.FLOAT, false, FSIZE *6, 0);// 把写入的数据传给变量position
    GL.enableVertexAttribArray(position);// 启用变量

    //法线
    GL.vertexAttribPointer(a_Normal, 3, GL.FLOAT, true, FSIZE *6, FSIZE * 3);
    GL.enableVertexAttribArray(a_Normal);// 启用变量
    //颜色

    
    //uv

    //顶点索引
    let vertexsIndicesBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexsIndicesBuffer);
    let vertexsIndices = new Uint16Array(model.mix_verticesIndices);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, vertexsIndices, GL.STATIC_DRAW);
    //绘图
    var i=0;
    let transformMatrix=new Matrix4();
    let run=()=>{
        transformMatrix.setRotate(i++,0,1,0);
        transformMatrix.translate(0,-2,0,0);
        GL.uniformMatrix4fv(u_transformMatrix, false, transformMatrix.elements);
        GL.drawElements(GL.TRIANGLES, vertexsIndices.length, GL.UNSIGNED_SHORT, 0);
        requestAnimationFrame(run)
    }
    run();
})




