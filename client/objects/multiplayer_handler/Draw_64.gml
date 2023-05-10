/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_black)
draw_rectangle(5,5,405,55,false)
draw_set_color(c_green)
var width_new = (393-17)*(global.health/global.max_health)+17
draw_rectangle(17,17,width_new,43,false)
draw_set_color(c_white)