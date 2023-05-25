/// @description Insert description here
// You can write your code in this editor

shader_set(grayscale_blend);

shader_set_uniform_f(blendPercent,1-u);
draw_self();
shader_reset();

try draw_healthbar(x - 60,y - 120,x + 60,y  - 100,(global.left_shield_own_health/global.constants.shield_generator_max_health)*100,c_black,c_red,c_green,0,true,true)
catch (e) e=e