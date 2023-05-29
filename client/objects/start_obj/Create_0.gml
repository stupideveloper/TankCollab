/// @description Insert description here
// You can write your code in this editor
//if (!struct_exists(global,"failed")) {
//global.failed = false
//}
flasher = 0
global.damage_flash = 0
global.gamestate = "ip_select"
global.forced_server = "localhost"
global.has_forced_server = false
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
global.constants = {
	shield_generator_max_health: 250,
	core_max_health: 500
}
global.splash_data = {ip: "unknown",gameVersion: "latest", connectionIp: "unknown",nsPerTick: 0,nsLastTick: 0,maxTick: 0}
has_success = false
global.ip_construct = "OVX687H"
audio_stop_all()
pressed = 0
global.IP_ADDR = global.ip_construct