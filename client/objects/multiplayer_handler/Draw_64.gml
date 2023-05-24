/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_black)
if (!connected) {
	draw_rectangle(0,0,window_get_width(),
	window_get_height(),false)
} else {
draw_rectangle(5,5,405,55,false)
draw_set_color(c_green)
var width_new = (393-17)*(global.health/global.max_health)+17
if (global.health > 0) {
	draw_rectangle(17,17,width_new,43,false)
}
draw_set_color(c_black)
draw_rectangle(5,58,405,95,false)
draw_set_color(c_green)
width_new = (393-17)*(global.core_health/1000)+17
if (global.core_health > 0) {
	draw_rectangle(17,70,width_new,83,false)
}


draw_text_ext_transformed(40,40,string_format(global.title,1,[global.respawntime]),0,0,4,4,0)

if (global.gamemenu) {
	draw_set_alpha(0.75)
	draw_set_color(c_black)
	draw_rectangle(0,0,window_get_width(),window_get_height(),false)
	draw_set_alpha(1)
	var font = draw_get_font()
	draw_set_font(IP_fnt)
	draw_set_halign(fa_center)
	draw_set_valign(fa_center)
	draw_text(
	window_get_width()/2,window_get_height()/2-120,
		"Game Menu"
	)

draw_set_font(font)
	}

}
try {
draw_text(200,700,"LEFTS "+string(global.left_shield_own_health))
draw_text(200,730,"RIGHTS "+string(global.right_shield_own_health))
} catch (e) {
//show_debug_message(e)
}

draw_set_color(c_white)

