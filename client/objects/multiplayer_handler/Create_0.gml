/// @description Insert description here
// You can write your code in this editor
// network_set_config(network_config_connect_timeout,10000)
var gameId = "hi"
//Init()
show_debug_message(parameter_string(0) + " " +
        parameter_string(1) + " " +
        parameter_string(2) + " " +
        parameter_string(3) + " -secondary")
last_was_clicked = false
packet_queue = {
	packets: []
}
dir = 0
spd = 90
image_xscale = 0.3;
image_yscale = 0.3;
fake_direction = 0;
global.max_health = 100
global.title = ""
global.dead = false
global.respawntime = 0
global.other_player_xy = []
global.other_players = {}
global.projectiles = {}
global.health = 100
global.camera_target = ""
this_id = ""
old_x = 0
old_y = 0
old_x2 = 0
ticks_since_update = 0
old_y2 = 0
last_pack_ticks = 0
avg_tick_time = 0
ticks = 0
halfit = false
is_x = true;
client = network_create_socket(network_socket_tcp);
var server = network_connect_raw_async( client,"localhost", 9000 );
show_debug_message(string(server))