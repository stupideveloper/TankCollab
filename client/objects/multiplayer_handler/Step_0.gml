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

if (mouse_check_button(mb_left)) {
	last_was_clicked = true
	addPacket({
		type: "fire_bullet",
	})
}
var imageanglekey = 0b0000
var _speed = 3
if (keyboard_check(ord("W")) || keyboard_check(vk_up)) {
		imageanglekey+= 0b1000;
		sendPosPack = true
	}
	if (keyboard_check(ord("S")) || keyboard_check(vk_down)) {
		imageanglekey+= 0b0100
		sendPosPack = true
	}
	if (keyboard_check(ord("D")) || keyboard_check(vk_right)) {
		imageanglekey+= 0b0010
		sendPosPack = true
	}
	if (keyboard_check(ord("A")) || keyboard_check(vk_left)) {
		imageanglekey+= 0b0001
		sendPosPack = true
	}
	switch (imageanglekey) {
		case 0b0000:
		case 0b1111:
		case 0b1100:
		case 0b0011:
		break;
		case 0b1000:
		case 0b1011:
			if (place_free(x,y-_speed)) y-=_speed
			break;
		case 0b0100:
		case 0b0111:
			if (place_free(x,y+_speed)) y+=_speed
			break;
		case 0b0010:
		case 0b1110:
			if (place_free(x+_speed,y)) x+=_speed
			break;
		case 0b0001:
		case 0b1101:
			if (place_free(x-_speed,y)) x-=_speed
			break;
		case 0b1010:
			if (place_free(x+_speed*(sin(0.25*pi)),y)){
				x+=_speed*(sin(0.25*pi))
			}
			if (place_free(x,y-_speed*(sin(0.25*pi)))){
				y-=_speed*(sin(0.25*pi))
			}
			break;
		case 0b1001:
			if (place_free(x-_speed*(sin(0.25*pi)),y)){
				x-=_speed*(sin(0.25*pi))
			}
			if (place_free(x,y-_speed*(sin(0.25*pi)))){
				y-=_speed*(sin(0.25*pi))
			}
			break;
		case 0b0110:
			if (place_free(x+_speed*(sin(0.25*pi)),y)){
				x+=_speed*(sin(0.25*pi))
			}
			if (place_free(x,y+_speed*(sin(0.25*pi)))){
				y+=_speed*(sin(0.25*pi))
			}
			break;
		case 0b0101:
			if (place_free(x-_speed*(sin(0.25*pi)),y)){
				x-=_speed*(sin(0.25*pi))
			}
			if (place_free(x,y+_speed*(sin(0.25*pi)))){
				y+=_speed*(sin(0.25*pi))
			}
			break;
	}
//if (mouse_check_button(mb_right) || keyboard_check(ord("X"))) {
//	 sendPosPack = true
//	x = x - sin(degtorad(dir))
//	y = y - cos(degtorad(dir))
//}
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





