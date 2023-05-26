/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_black)
if (!connected) {
	draw_rectangle(0,0,window_get_width(),
	window_get_height(),false)
} else {
//draw_rectangle(5,5,405,55,false)
//draw_set_color(c_green)
//var width_new = (393-17)*(global.health/global.max_health)+17
//if (global.health > 0) {
//	draw_rectangle(17,17,width_new,43,false)
//}
//draw_set_color(c_black)
//draw_rectangle(5,58,405,95,false)
//draw_set_color(c_green)
//width_new = (393-17)*(global.core_health/global.constants.core_max_health)+17
//if (global.core_health > 0) {
//	draw_rectangle(17,70,width_new,83,false)
//}

//var centre = 205
//var ymin = 9
//var xmax = window_get_width() - 405 - 3
//draw_set_color(c_black)
//draw_rectangle(5+xmax,ymin+3,centre+xmax,ymin+32+3,false)
//draw_set_color(c_green)
//width_new = ((centre-12)-17)*(global.right_shield_own_health/global.constants.shield_generator_max_health)+17
//if (global.right_shield_own_health > 0) {
//	draw_rectangle(17+xmax,ymin+12+3,width_new+xmax,ymin+3+20,false)
//}

//draw_set_color(c_black)
//draw_rectangle(centre+2+xmax,ymin+3,405+xmax,ymin+3+32,false)
//draw_set_color(c_green)
//width_new = (393-(centre+14))*(global.left_shield_own_health/global.constants.shield_generator_max_health) + (centre+14)
//if (global.left_shield_own_health > 0) {
//	draw_rectangle(centre+14+xmax,ymin+3+12,width_new+xmax,ymin+3+20,false)
//}
draw_set_font(label_fnt)
y_offset = -10
if (global.this_team == "A") {
	
	draw_set_halign(fa_left)
	draw_text(50,40 + y_offset,"Core") // Draw title
	draw_healthbar(50, 50 + y_offset, 400, 70+ y_offset, (global.core_own_health/global.constants.core_max_health)*100, c_black, c_green, c_green, 0, true, true) // Draw core health

	draw_text(50,90+ y_offset,"Shield Generators")
	draw_healthbar(50, 100+ y_offset, 200, 110+ y_offset, (global.left_shield_own_health/global.constants.shield_generator_max_health)*100, c_black, c_blue, c_blue, 0, true, true) // draw shield gen health
	draw_healthbar(210, 100+ y_offset, 360, 110+ y_offset, (global.right_shield_own_health/global.constants.shield_generator_max_health)*100, c_black, c_blue, c_blue, 0, true, true)
} else { // Flip if on other side
	draw_set_halign(fa_right)
	draw_text(window_get_width()-50,40+ y_offset,"Core")
	draw_healthbar(window_get_width()-50, 50+ y_offset, window_get_width()-400, 70+ y_offset, (global.core_own_health/global.constants.core_max_health)*100, c_black, c_green, c_green, 0, true, true)

	draw_text(window_get_width()-50,90+ y_offset,"Shield Generators")
	draw_healthbar(window_get_width()-50, 100+ y_offset, window_get_width()-200, 110+ y_offset, (global.left_shield_own_health/global.constants.shield_generator_max_health)*100, c_black, c_blue, c_blue, 0, true, true)
	draw_healthbar(window_get_width()-210, 100+ y_offset, window_get_width()-360, 110+ y_offset, (global.right_shield_own_health/global.constants.shield_generator_max_health)*100, c_black, c_blue, c_blue, 0, true, true)
}
draw_set_halign(fa_middle)
draw_text(window_get_width()/2,95+ y_offset,"Health")
draw_healthbar((window_get_width()/2)-175, 100, (window_get_width()/2)+175, 120, (global.health/global.max_health)*100, c_black, c_red, c_green, 0, true, true)
draw_set_colour(c_black)
draw_set_halign(fa_left)
//show_debug_message(global.title)
var font = draw_get_font()
draw_set_font(Inventory_fnt)
if (global.title != "") {

	//draw_text(
	//window_get_width()/2,100,
	//	global.title
	//)
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
} else {
	if (music_readied) {
		audio_play_sound(BG_music, 4, true)
		notification_obj.visible = false
		music_readied = false
	}
}

draw_set_color(c_white)


// Draw Banner
if (global.started) {
if (global.left_shield_other_health > 0 || global.right_shield_other_health > 0) {
	draw_sprite(banner_spr, 0, (window_get_width()/2), 50)
} else if (global.core_other_health > 0) {
	draw_sprite(banner_spr, 1, (window_get_width()/2) , 50)
} else {
	draw_sprite(banner_spr, 2, (window_get_width()/2) , 50)
}
}

