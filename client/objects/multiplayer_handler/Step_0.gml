/// @description Insert description here
// You can write your code in this editor
packet_queue = {
	packets: []
}
var sendPosPack = false
if (!(mouse_x==old_x2 && mouse_y == old_y2)) {
	old_dir = (dir + 360) % 360
	target_dir = point_direction(mouse_x,mouse_y,x,y) + 90
	diff = angle_difference(target_dir,old_dir); // The difference between the direction and the player's current angle
	dir = old_dir + clamp(diff,-spd,spd);
	old_x2 = mouse_x
	old_y2 = mouse_y
 sendPosPack = true
}
if (ticks_since_update % 300 == 299 ) {
	var server = network_connect_raw_async( client,"localhost", 9000 );
}



last_pack_ticks += 1
ticks_since_update += 1

if (mouse_check_button_pressed(mb_left)) {
	last_was_clicked = true
	addPacket({
		type: "fire_bullet",
	})
}
var imageanglekey = 0b0000
var _speed = 10
phy_speed_x*=0.9
phy_speed_y*=0.9
if (keyboard_check(ord("W"))||keyboard_check(vk_up)) {
	sendPosPack = true
	phy_speed_x=5*cos_(fake_direction)
	phy_speed_y=5*sin_(fake_direction)
}
if (keyboard_check(ord("S"))||keyboard_check(vk_down)) {
	sendPosPack = true
	physics_apply_force(x-100*cos_(fake_direction),y-100*sin_(fake_direction),500,500)
}
if (keyboard_check(ord("A"))||keyboard_check(vk_left)) {
	fake_direction -= 3.65
}
if (keyboard_check(ord("D"))||keyboard_check(vk_right)) {
	fake_direction += 3.65
}


//if (mouse_check_button(mb_right) || keyboard_check(ord("X"))) {
//	 sendPosPack = true
//	x = x - sin(degtorad(dir))
//	y = y - cos(degtorad(dir))
//}
x=phy_position_x;
y=phy_position_y
if (sendPosPack) {
	addPacket({
	x: x,
	y: y,
	dir: dir,
	type: "pos"
	})
}
camera_set_view_pos(view_camera[0],x-camera_get_view_width(view_camera[0])/2,y-camera_get_view_height(view_camera[0])/2)
sendPacket()





