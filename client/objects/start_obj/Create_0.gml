/// @description Insert description here
// You can write your code in this editor
//if (!struct_exists(global,"failed")) {
//global.failed = false
//}
global.right_shield_own_health = 0
global.left_shield_own_health = 0
global.right_shield_other_health = 0
global.left_shield_other_health = 0
global.core_own_health = 0
global.core_other_health = 0
global.this_team = "_"
global.has_spawned_shields = false
global.remove_on_disconnect = []
global.title_time = 0
global.upgrade_tiers = {}
global.available_upgrades = {}
global.started = false
global.console = {
	log: function (f) {show_debug_message(f)}
}
global.constants = {
	shield_generator_max_health: 500,
	core_max_health: 1000
}
global.splash_data = {ip: "unknown",serverVersion: "unknown",clientVerson: "unknown"}
has_success = false
global.ip_construct = "127.0.0.1"
global.first_pointer = 0
global.first_num = 0
global.second_pointer = 0
global.second_num = 0
global.third_pointer = 0
global.third_num = 0
global.fourth_pointer = 0
global.fourth_num = 0
pressed = 0
global.IP_ADDR = global.ip_construct