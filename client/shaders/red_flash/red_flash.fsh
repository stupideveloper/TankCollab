varying vec2 vTc;
varying float prms;
void main()
{
const vec3 ww=vec3(255,0,0);
vec3 irgb=texture2D(gm_BaseTexture,vTc).rgb;
float alpha=texture2D(gm_BaseTexture,vTc).a;
gl_FragColor=vec4(prms)*vec4(255,0,0,alpha)+vec4(1.0-prms)*texture2D(gm_BaseTexture,vTc).rgba;
}