// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
function PacketFunctions(){

}
//function DLL(){
//	return "ImportantLibrary" + ".dll"
//}
//function Init() {
//	external_call(external_define(DLL(),"INIT",dll_stdcall,ty_real,0))
//}
//function Disable() {
//	external_call(external_define(DLL(),"QUIT",dll_stdcall,ty_real,0))
//}
//function Run(command) {
//	return external_call(external_define(DLL(),"RSC",dll_stdcall,ty_real,1,ty_string),command)
//}
function sin_(d) {
	return sin(degtorad(d))
}
function cos_(d) {
	return cos(degtorad(d))
}
function array_includes(array, value) {
	for (var i = 0; i < array_length(array); i++) {
			if (array[i] == value) return true
		}
		return false
}
function addPacket(packetobject){
	//show_debug_message(object)
	if (variable_struct_exists(multiplayer_handler.packet_queue,"packets")) {
		array_push(multiplayer_handler.packet_queue.packets,packetobject)
	} else {
		variable_struct_set(multiplayer_handler.packet_queue,"packets",[packetobject])
	}
	//show_debug_message(object)
}
function sendPacket() {
var json = json_stringify(multiplayer_handler.packet_queue)
var buff = buffer_create(0,buffer_grow,1)
buffer_write(buff,buffer_text,json)
network_send_packet(multiplayer_handler.client,buff,buffer_get_size(buff))
}
function handlePackets(packets) {
	try {
		
	if (packets.type == "positions") {
		global.this_id = packets.this_id
		for (var i = 0; i < array_length(packets.playerlist); i++) {
			if (!variable_struct_exists(global.other_players,packets.playerlist[i])) {
				variable_struct_set(global.other_players,packets.playerlist[i],{colour: "normal"})
				show_debug_message("[DEBUG] + "+packets.playerlist[i])
			}
		}
		for (var i = 0; i < array_length(variable_struct_get_names(global.other_players)); i++) {
			if (!array_includes(packets.playerlist,variable_struct_get_names(global.other_players)[i])) {
				show_debug_message("[DEBUG] - "+variable_struct_get_names(global.other_players)[i])
				variable_struct_remove(global.other_players,variable_struct_get_names(global.other_players)[i])
			}
		}
		for (var i = 0; i < array_length(packets.misc_packets); i++) {
			var extra_packet = packets.misc_packets[i];
			//show_debug_message(extra_packet)
			try {
			switch extra_packet.type {
				case "animation": {
					if (extra_packet.player == global.this_id) break;
					if (extra_packet.data == "press") {
					variable_struct_get(global.other_players,extra_packet.player).colour = "notnormal";
					} else {
					variable_struct_get(global.other_players,extra_packet.player).colour = "normal";
					}
					break;	
				}
				case "teleport": {
					//show_debug_message(extra_packet)
					multiplayer_handler.x = extra_packet.x
					multiplayer_handler.phy_position_x = extra_packet.x
					multiplayer_handler.y = extra_packet.y
					multiplayer_handler.phy_position_y = extra_packet.y
					multiplayer_handler.dir = extra_packet.dir
					break;
				}
				case "health_update": {
					global.health = extra_packet.health
					if (variable_struct_exists(extra_packet,"max_health")) {
						global.maxhealth = extra_packet.max_health
					}
					break;
				}
				case "death": {
					global.dead = true
					global.title = "You died! Respawning in %i seconds!"
					break;
				}
				case "respawn": {
					global.dead = false
					global.health = extra_packet.max_health
					global.maxhealth = extra_packet.max_health
					break;
				}
				case "screenshake": {
					global.shake = true
					global.shake_time = extra_packet.time;
					global.shake_magnitude = extra_packet.magnitude;
					global.shake_fade = extra_packet.fade;
					break;
				}
			}
			} catch (e) {e=e}
		}
		global.upgrades = packets.upgrades
		global.speeed = global.upgrades.speed
		global.respawntime = packets.respawn_time
		if (global.respawntime == -1) {
			global.dead = false	
		}
		global.teams = packets.teamPlayers
		global.projectiles = packets.projectiles
		global.other_player_xy = packets.locations
		//show_debug_message(array_length(variable_struct_get_names(packets.projectiles)))
	} else if (packets.type == "id") {
		global.this_id = packets.this_id
	}
	} catch (e) {
		//show_debug_message(e)
	}
}