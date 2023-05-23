/// @description Insert description here
// You can write your code in this editor

shader_set(grayscale_blend);

shader_set_uniform_f(blendPercent,1-u);
draw_self();
shader_reset();