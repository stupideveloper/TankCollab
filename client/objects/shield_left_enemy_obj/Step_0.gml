/// @description Insert description here
// You can write your code in this editor
image_angle += 5 * clamp(u,0,1)
if (dead) u -= 0.005

if (global.left_shield_other_health <= 0) dead = true

if (u > 0.1 && multiplayer_handler.ticks_since_update % 300 != 298 ) {
	part_emitter_region(part_system, 0, x+1,x-1,y+1,y-1, ps_shape_ellipse, ps_distr_gaussian)
} else {
	if (u > 0.05) effect_create_above(ef_explosion,x,y,2,c_orange)
	part_emitter_create(part_system)
	part_system_destroy(part_system)
}