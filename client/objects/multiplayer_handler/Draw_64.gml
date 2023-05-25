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
width_new = (393-17)*(global.core_health/global.constants.core_max_health)+17
if (global.core_health > 0) {
	draw_rectangle(17,70,width_new,83,false)
}

var centre = 205
var ymin = 9
var xmax = window_get_width() - 405 - 3
draw_set_color(c_black)
draw_rectangle(5+xmax,ymin+3,centre+xmax,ymin+32+3,false)
draw_set_color(c_green)
width_new = ((centre-12)-17)*(global.right_shield_own_health/global.constants.shield_generator_max_health)+17
if (global.right_shield_own_health > 0) {
	draw_rectangle(17+xmax,ymin+12+3,width_new+xmax,ymin+3+20,false)
}

draw_set_color(c_black)
draw_rectangle(centre+2+xmax,ymin+3,405+xmax,ymin+3+32,false)
draw_set_color(c_green)
width_new = (393-(centre+14))*(global.left_shield_own_health/global.constants.shield_generator_max_health) + (centre+14)
if (global.left_shield_own_health > 0) {
	draw_rectangle(centre+14+xmax,ymin+3+12,width_new+xmax,ymin+3+20,false)
}
draw_set_colour(c_black)
//show_debug_message(global.title)
var font = draw_get_font()
draw_set_font(Inventory_fnt)
if (global.title != "") {

	draw_text(
	window_get_width()/2,100,
		global.title
	)
if (global.title_time--==0) {
	global.title = ""
}
}
draw_set_halign(fa_right)
	draw_set_valign(fa_bottom)
	try draw_text(window_get_width() - 12,window_get_height() - 12,$"Teammates left: {global.teamsizes.own}\nEnemies left: {global.teamsizes.oth}");
	catch (e) e=e
draw_set_font(font)
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
	draw_set_halign(fa_center)
	}

}

if (!global.started && connected) {
draw_set_color(c_black)
	draw_rectangle(0,0,window_get_width(),window_get_height(),false)
	draw_set_alpha(1)
	var font = draw_get_font()
	draw_set_font(IP_fnt)
	draw_set_halign(fa_center)
	draw_set_valign(fa_bottom)
	draw_set_colour(c_white)
	draw_text(
	window_get_width()/2,window_get_height()/2-190,
		global.paused?"Game Paused":"Waiting for Game Start"
	)

	draw_set_font(Inventory_fnt)
	try	draw_text(
	window_get_width()/2,window_get_height()/2+120,
		$"{global.teamsizes.oth+global.teamsizes.own} Players Waiting\n\nControl Style: {global.control_style} (press C to change)\nServer IP: {global.splash_data.ip}\nConnected IP: {global.ip_construct}\nClient IP: {global.splash_data.connectionIp}\nGame Version: {global.splash_data.gameVersion}"
	)
	catch (e) e=e
	draw_set_halign(fa_left)
	draw_set_valign(fa_bottom)
	//draw_text(0,window_get_height(),"Press F to toggle fullscreen")
	draw_set_font(font)
	draw_set_halign(fa_center)
}

draw_set_color(c_white)

