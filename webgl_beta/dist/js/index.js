//设置基础环境
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
let u_MvpMatrix=GL.getUniformLocation(shaderProgram, 'u_MvpMatrix');
let a_Normal=GL.getUniformLocation(shaderProgram, 'a_Normal');
//mvp
let mvpMatrix = new Matrix4();
mvpMatrix.setPerspective(40, CANVAS.clientWidth/CANVAS.clientHeight, 1, 100);
mvpMatrix.lookAt(
    5 , 5, 7,
    0, 0, 0, 
    0, 1, 0
);
GL.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
//mvp


let model3d=new OBJ("../3dmodels/box.obj");
model3d.loaded(()=>{
    //顶点
    let vertexsBuffer = GL.createBuffer();// 创建一个缓存区存放顶点数据
    GL.bindBuffer(GL.ARRAY_BUFFER, vertexsBuffer);// 把缓存区绑定给webgl
    let vertices=new Float32Array(model3d.vertices);//类型化数组
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);// 在webgl的缓存区写入顶点数据
    GL.vertexAttribPointer(position, 3, GL.FLOAT, false, 0, 0);// 把写入的数据传给变量position
    GL.enableVertexAttribArray(position);// 启用变量
    //顶点索引
    let vertexsIndicesBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, vertexsIndicesBuffer);
    let vertexsIndices = new Uint8Array(model3d.verticesIndices);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, vertexsIndices, GL.STATIC_DRAW);
    //颜色
    //uv
    //法线
    let normalsBuffer = GL.createBuffer();// 创建一个缓存区存放法线数据
    GL.bindBuffer(GL.ARRAY_BUFFER, normalsBuffer);// 把缓存区绑定给webgl
    let normals=new Float32Array(model3d.normals);//类型化数组
    GL.bufferData(GL.ARRAY_BUFFER, normals, GL.STATIC_DRAW);// 在webgl的缓存区写入法线数据
    GL.vertexAttribPointer(a_Normal, 3, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray(a_Normal);// 启用变量
    //法线索引
    let normalsIndicesBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, normalsIndicesBuffer);
    let normalsIndices = new Uint8Array(model3d.normalsIndexs);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, normalsIndices, GL.STATIC_DRAW);

    //绘图
    // GL.drawElements(GL.TRIANGLES, vertexsIndices.length, GL.UNSIGNED_BYTE, 0);
})



