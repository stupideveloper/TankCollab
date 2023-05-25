/// @description Insert description here
// You can write your code in this editor
if (global.has_forced_server) {
global.IP_ADDR = global.forced_server
room_goto(Room1)
}
if (keyboard_check_pressed(ord("0"))) {
	global.ip_construct += "0"
}
if (keyboard_check_pressed(ord("1"))) {
	global.ip_construct += "1"
}
if (keyboard_check_pressed(ord("2"))) {
	global.ip_construct += "2"
}
if (keyboard_check_pressed(ord("3"))) {
	global.ip_construct += "3"
}
if (keyboard_check_pressed(ord("4"))) {
	global.ip_construct += "4"
}
if (keyboard_check_pressed(ord("5"))) {
	global.ip_construct += "5"
}
if (keyboard_check_pressed(ord("6"))) {
	global.ip_construct += "6"
}
if (keyboard_check_pressed(ord("7"))) {
	global.ip_construct += "7"
}
if (keyboard_check_pressed(ord("8"))) {
	global.ip_construct += "8"
}
if (keyboard_check_pressed(ord("9"))) {
	global.ip_construct += "9"
}
if (keyboard_check_pressed(190)) {
	global.ip_construct += "."
}

if (keyboard_check(vk_backspace)) {
	pressed = (pressed + 1) mod 5
	if (pressed == 1) global.ip_construct = string_delete(global.ip_construct,string_length(global.ip_construct),1)
} else {
	pressed = 0
}
if (keyboard_check_pressed(vk_enter)) {
	if (IPCheck(global.ip_construct)) {
		if (global.ip_construct == "127.0.0.1") global.ip_construct = "localhost"
		global.IP_ADDR = global.ip_construct
		room_goto(Room1)
	}
}