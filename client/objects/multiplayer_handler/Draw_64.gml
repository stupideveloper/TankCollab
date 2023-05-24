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

var centre = 205
draw_set_color(c_black)
draw_rectangle(5,95+3,centre,95+32+3,false)
draw_set_color(c_green)
width_new = ((centre-12)-17)*(global.right_shield_own_health/500)+17
if (global.right_shield_own_health > 0) {
	draw_rectangle(17,107+3,width_new,98+20,false)
}

draw_set_color(c_black)
draw_rectangle(centre+2,98,405,98+32,false)
draw_set_color(c_green)
width_new = (393-(centre+14))*(global.left_shield_own_health/500) + (centre+14)
if (global.left_shield_own_health > 0) {
	draw_rectangle(centre+14,98+12,width_new,98+20,false)
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
	draw_set_valign(fa_bottom)
	draw_text(
	window_get_width()/2,window_get_height()/2-190,
		"Game Menu"
	)
	draw_set_font(Inventory_fnt)
	draw_text(
	window_get_width()/2,window_get_height()/2-40,
		$"Control Style: {global.control_style} (press C to change)\nServer IP: {global.splash_data.ip}\nConnected IP: {global.ip_construct}\nGame Version: {global.splash_data.gameVersion}"
	)
	draw_set_font(font)
	}

}

draw_set_color(c_white)

