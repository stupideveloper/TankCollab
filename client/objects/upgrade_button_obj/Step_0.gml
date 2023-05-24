/// @description Insert description here
// You can write your code in this editor

x=camera_get_view_x(view_camera[0]) + x_offset
y= camera_get_view_y(view_camera[0]) + y_offset
try {

switch (spr) {
	case bullet_damage_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_damage
		disabled = not global.available_upgrades.bulletDamage
		break
	}
	case health_regen_spr: {
		image_index = upgrade_buttom_manager_obj.health_regen
		disabled = not global.available_upgrades.healthRegen
		break
	}
	case max_health_spr: {
		image_index = upgrade_buttom_manager_obj.max_health
		disabled = not global.available_upgrades.maxHealth
		break
	}
	case bullet_reload_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_reload
		disabled = not global.available_upgrades.bulletReload
		break
	}
	case bullet_speed_spr: {
		image_index = upgrade_buttom_manager_obj.bullet_speed
		disabled = not global.available_upgrades.bulletSpeed
		break
	}
	case move_speed_spr: {
		image_index = upgrade_buttom_manager_obj.move_speed
		disabled = not global.available_upgrades.moveSpeed
		break
	}
	
}} catch (e) {}