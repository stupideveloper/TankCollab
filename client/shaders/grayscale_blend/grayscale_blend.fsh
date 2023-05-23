varying vec2 vTc;
varying float prms;
void main()
{
const vec3 ww=vec3(0.2125,0.7154,0.0721);
vec3 irgb=texture2D(gm_BaseTexture,vTc).rgb;
float alpha=texture2D(gm_BaseTexture,vTc).a;
float luminance=dot(irgb,ww);
gl_FragColor=vec4(prms)*vec4(luminance,luminance,luminance,alpha)+vec4(1.0-prms)*texture2D(gm_BaseTexture,vTc).rgba;
}