// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
global.right_shield_own_health = 0
			global.left_shield_own_health = 0
			global.right_shield_other_health = 0
			global.left_shield_other_health = 0
			global.core_own_health = 0
			global.core_other_health = 0
			global.this_team = "_"
			global.has_spawned_shields = false
global.remove_on_disconnect = []
function IPCheck(ip_addr) {
	var split = string_split(ip_addr,".")
	if (array_length(split)==4) {
		try {
		var first = real(split[0])
		var second = real(split[1])
		var third = real(split[2])
		var fourth = real(split[3])
		if (first < 256 && second < 256 && third < 256 && fourth < 256) {
			return true
		} else {
			return false
		}
		} catch (e) {
			return false
		}
	} else {
		return false
	}
}
function spawnShields() {
//instance_create_layer(shield_enemy_obj)
}
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
function destroy_disconnect() {
	for (var i = 0; i < array_length(global.remove_on_disconnect); i++) {
		instance_destroy(global.remove_on_disconnect[i])
	}
	global.remove_on_disconnect = []
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
				case "team_set": {
					global.this_team = extra_packet.team
					break;
				}
				case "gem_spawn": {
					instance_create_layer(extra_packet.x,extra_packet.y,"Instances",gem_obj,{image_index: extra_packet.gem_type,
						image_xscale: 1,
						image_yscale: 1,
						uuid: extra_packet.uuid
					})
					
					break;
				}
				case "collect_gem": {
					try {
						var gemtodelete = struct_get(global.gems,extra_packet.uuid)
						instance_destroy(gemtodelete)
						struct_remove(global.gems,extra_packet.uuid)
					} catch (e) {e=e}
					break;
				}
				case "core_shield_destroy": {
					switch (extra_packet.id) {
						case "A:core": {
							if (global.this_team == "A") {
								core_self_obj.dead = true;
							} else {
								core_ememy_obj.dead = true;
							}
							break;
						}
						case "B:core": {
							if (global.this_team == "B") {
								core_self_obj.dead = true;
							} else {
								core_ememy_obj.dead = true;
							}
							break;
						}
						case "A:rshield": {
							if (global.this_team == "A") {
								shield_right_self_obj.dead = true;
							} else {
								shield_right_enemy_obj.dead = true;
							}
							break;
						}
						case "B:rshield": {
							if (global.this_team == "B") {
								shield_right_self_obj.dead = true;
							} else {
								shield_right_enemy_obj.dead = true;
							}
							break;
						}
						case "A:lshield": {
							if (global.this_team == "A") {
								shield_left_self_obj.dead = true;
							} else {
								shield_left_enemy_obj.dead = true;
							}
							break;
						}
						case "B:lshield": {
							if (global.this_team == "B") {
								shield_left_self_obj.dead = true;
							} else {
								shield_left_enemy_obj.dead = true;
							}
							break;
						}
						default: {
							show_debug_message(extra_packet)
						}
					}
					break;
				}
				default: {
					show_debug_message(extra_packet)
				}
			}
			} catch (e) {
				//show_debug_message(e)
			}
		}
		global.upgrades = packets.upgrades
		global.speeed = global.upgrades.speed
		global.respawntime = packets.respawn_time
		if (global.respawntime == -1) {
			global.dead = false	
		}
		try {
			global.right_shield_own_health = packets.team_data.rightShieldHealth
			global.left_shield_own_health = packets.team_data.rightShieldHealth
			global.right_shield_other_health = packets.other_team_info.rightShield
			global.left_shield_other_health = packets.other_team_info.leftShield
			global.core_own_health = packets.team_data.coreHealth
			global.core_other_health = packets.other_team_info.core
			if (!global.has_spawned_shields) {
				var sls = packets.team_data.leftShield
				var sle = packets.other_team_info.leftShieldLoc
				var srs = packets.team_data.rightShield
				var sre = packets.other_team_info.rightShieldLoc
				var ce = packets.other_team_info.coreLoc
				var cs = packets.team_data.core
				
				
				var a = instance_create_layer(sle.x,sle.y,"Instances",shield_left_enemy_obj,{sdead: !sle.alive, image_xscale: 0.5, image_yscale: 0.5})
				var b = instance_create_layer(sls.x,sls.y,"Instances",shield_left_self_obj,{sdead: !sls.alive, image_xscale: 0.5, image_yscale: 0.5})
				var c = instance_create_layer(srs.x,srs.y,"Instances",shield_right_self_obj, {sdead: !srs.alive, image_xscale: 0.5, image_yscale: 0.5})
				var d = instance_create_layer(sre.x,sre.y,"Instances",shield_right_enemy_obj, {sdead: !sre.alive, image_xscale: 0.5, image_yscale: 0.5})
				var e = instance_create_layer(ce.x,ce.y,"Instances",core_ememy_obj, {sdead: !ce.alive, image_xscale: 0.5, image_yscale: 0.5})
				var f = instance_create_layer(cs.x,cs.y,"Instances",core_self_obj, {sdead: !cs.alive, image_xscale: 0.5, image_yscale: 0.5})
				
				global.has_spawned_shields = true;
				array_push(global.remove_on_disconnect,a,b,c,d,e,f)
			}
		} catch (e) {
		show_debug_message(e)
		}
		global.core_health = packets.team_data.coreHealth
		global.teams = packets.teamPlayers
		global.projectiles = packets.projectiles
		global.gems = packets.gems
		global.health = packets.health
		global.other_player_xy = packets.locations
		
		//show_debug_message(array_length(variable_struct_get_names(packets.projectiles)))
	} else if (packets.type == "id") {
		global.this_id = packets.this_id
	}
	} catch (e) {
		show_debug_message(e)
	}
}