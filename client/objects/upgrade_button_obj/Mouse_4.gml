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