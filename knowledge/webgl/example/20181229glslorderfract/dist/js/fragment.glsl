precision mediump float;
// 定义常量
#define M_PI 3.1415926535897932384626433832795
// uniform float time;
varying vec2 resolution;
varying float time;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
//main入口

 
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st *= 10.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    // Assign a random value based on the integer coord
    vec3 color = vec3(random( ipos ));
    // Uncomment to see the subdivided grid ,显示了渐变颜色，不纯色了
    // color = vec3(fpos,0.0);
    gl_FragColor = vec4(color,1.0);
    // gl_FragColor=vec4(1.0,1.0,0.0,1.0);
}
