/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_black)
draw_rectangle(5,5,405,55,false)
draw_set_color(c_green)
var width_new = (393-17)*(global.health/global.max_health)+17
if (global.health > 0) {
	draw_rectangle(17,17,width_new,43,false)
}
draw_set_color(c_white)
draw_text_ext_transformed(40,40,string_format(global.title,1,[global.respawntime]),0,0,4,4,0)