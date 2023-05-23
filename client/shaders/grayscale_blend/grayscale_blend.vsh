attribute vec3 in_Position;
attribute vec2 in_TextureCoord;

uniform float params;

varying float prms;
varying vec2 vTc;
void main()
{
	prms = clamp(params,0.0,1.0);
gl_Position = gm_Matrices[MATRIX_WORLD_VIEW_PROJECTION]*vec4(in_Position.xyz,1.);
vTc=in_TextureCoord;
}