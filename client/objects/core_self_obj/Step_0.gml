/// @description Insert description here
// You can write your code in this editor
image_angle += 2 * clamp(u,0,1)
if (dead) u -= 0.001
if (global.core_own_health == 0 and not dead) {
	u = 0
}