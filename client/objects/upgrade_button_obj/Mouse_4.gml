/// @description Insert description here
// You can write your code in this editor
if (image_index < 6) {
	image_index = image_index +1
} 

switch (spr) {
	case bullet_damage_spr: {
		if (upgrade_buttom_manager_obj.bullet_damage != 6) upgrade_buttom_manager_obj.bullet_damage++
		addPacket({
		type: "upgrade_ability",
		upgrade_type: "bullet_damage",
		value: upgrade_buttom_manager_obj.bullet_damage
		})
		break
	}
	case health_regen_spr: {
		if (upgrade_buttom_manager_obj.health_regen != 6) upgrade_buttom_manager_obj.bullet_damage++
		addPacket({
		type: "upgrade_ability",
		upgrade_type: "health_regen",
		value: upgrade_buttom_manager_obj.health_regen
		})
		break
	}
	case max_health_spr: {
		if (upgrade_buttom_manager_obj.max_health != 6) upgrade_buttom_manager_obj.bullet_damage++
		addPacket({
		type: "upgrade_ability",
		upgrade_type: "max_health",
		value: upgrade_buttom_manager_obj.max_health
		})
		break
	}
	case bullet_reload_spr: {
		if (upgrade_buttom_manager_obj.bullet_reload != 6) upgrade_buttom_manager_obj.bullet_reload++
			addPacket({
		type: "upgrade_ability",
		upgrade_type: "bullet_reload",
		value: upgrade_buttom_manager_obj.bullet_reload
		})
		break
	}
	case bullet_speed_spr: {
		if (upgrade_buttom_manager_obj.bullet_speed != 6) upgrade_buttom_manager_obj.bullet_speed++
				addPacket({
		type: "upgrade_ability",
		upgrade_type: "bullet_speed",
		value: upgrade_buttom_manager_obj.bullet_speed
		})
		break
	}
	case move_speed_spr: {
		if (upgrade_buttom_manager_obj.move_speed != 6) upgrade_buttom_manager_obj.move_speed++
					addPacket({
		type: "upgrade_ability",
		upgrade_type: "move_speed",
		value: upgrade_buttom_manager_obj.move_speed
		})
		break
	}
	
}