precision mediump float;
// 定义常量
#define M_PI 3.1415926535897932384626433832795
// uniform float time;
varying vec2 resolution;
varying float time;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
//main入口

 
// float random (vec2 st) {
//     // return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
//     return vec2(1.0,1.0)
// }

void main() {
  //效果一
  // vec2 st = gl_FragCoord.xy/resolution.xy;
  // float random = fract(
  //   dot(sin(st.x)*10000.00,sin(st.y)*time)
  // );
  // gl_FragColor = vec4(
  //   vec3(random),
  //   1.0
  // ); 

  // vec2 st = gl_FragCoord.xy/resolution.xy;
  // //随机值
  // float random=fract(
  //   sin(
  //     dot(st.xy,vec2(10000.0,1002.0)) //横行和纵向“随机”乘积
  //   )*1000.0
  // );
  // //赋值
  // gl_FragColor = vec4(vec3(random), 1.0);
  // 

  vec2 st = gl_FragCoord.xy/resolution.xy;
  float a=20.0*10.0;
  st.x=st.x* 10.0;
  // st.x=.9*19;
  // float b   = st.x *  10.0; // Scale the coordinate system by 10
  // vec2 ipos = floor(st);  // get the integer coords
  // vec2 fpos = fract(st);  // get the fractional coords

  // Assign a random value based on the integer coord
  vec3 color = vec3(1.0,0.0,1.0);

  // Uncomment to see the subdivided grid
  // color = vec3(fpos,0.0);

  gl_FragColor = vec4(color,1.0);
}
