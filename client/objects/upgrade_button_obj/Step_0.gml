/// @description Insert description here
// You can write your code in this editor

x=camera_get_view_x(view_camera[0]) + x_offset
y= camera_get_view_y(view_camera[0]) + y_offset


switch (spr) {
	case bullet_damage_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_damage
		break
	}
	case health_regen_spr: {
		image_index = upgrade_buttom_manager_obj.health_regen
		break
	}
	case max_health_spr: {
		image_index = upgrade_buttom_manager_obj.max_health
		break
	}
	case bullet_reload_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_reload
		break
	}
	case bullet_speed_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_speed
		break
	}
	case move_speed_spr: {
		image_index = upgrade_buttom_manager_obj.move_speed
		break
	}
	
}