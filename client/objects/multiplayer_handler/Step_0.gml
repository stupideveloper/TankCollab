/// @description Insert description here
// You can write your code in this editor


if (keyboard_check_pressed(vk_escape)) {
    global.gamemenu = !global.gamemenu
}

if (!connected) {
    tics += 1
    if (tics == 100) {
        global.failed = true
        room_goto(StartRoom)

    }
} else {
    global.failed = false
}
// Queue of packets to send
// Whether to send the position packet
var sendPosPack = false

// If the mouse has moved, re angle the tank
if (!(mouse_x == old_x2 && mouse_y == old_y2)) {
    // old direction, normalised
    old_dir = (dir + 360) % 360
    // direction to mouse
    target_dir = point_direction(mouse_x, mouse_y, x, y) + 90
    // difference between the two
    diff = angle_difference(target_dir, old_dir); // The difference between the direction and the player's current angle
    // new direction
    dir = old_dir + clamp(diff, -spd, spd);
    // set the old mouse pos to the new mouse pos
    old_x2 = mouse_x
    old_y2 = mouse_y
    sendPosPack = true
}
// if a disconnect is detected
if (ticks_since_update % 300 == 299) {
    room_goto(StartRoom)
}

global.paused = global.paused || global.started

if (keyboard_check_pressed(ord("C")) && (global.gamemenu || !global.started)) {
    if (global.control_style == "classic") {
        global.control_style = "simple"

    } else {
        global.control_style = "classic"
    }
}


last_pack_ticks += 1
ticks_since_update += 1

var _speed = global.speeed
phy_speed_x *= 0.9
phy_speed_y *= 0.9
if ((keyboard_check(ord("W")) xor keyboard_check(ord("S"))) and(keyboard_check(ord("D")) xor keyboard_check(ord("A")))) _speed *= global.squareroot_two_over_two
if (keyboard_check(ord("W")) || keyboard_check(vk_up)) and not(keyboard_check(ord("S")) || keyboard_check(vk_down)) {
    sendPosPack = true
    if (global.control_style == "classic") {
        phy_speed_x = _speed * cos_(fake_direction)
        phy_speed_y = _speed * sin_(fake_direction)
    } else phy_speed_y = -_speed //*sin_(fake_direction)
}
if (keyboard_check(ord("S")) || keyboard_check(vk_down)) and not(keyboard_check(ord("W")) || keyboard_check(vk_up)) {
    // physics_apply_force(x-global.speeed*100*cos_(fake_direction),y-global.speeed*100*sin_(fake_direction),500,500)
    sendPosPack = true
    if (global.control_style == "classic") {
        phy_speed_x = -_speed * cos_(fake_direction)
        phy_speed_y = -_speed * sin_(fake_direction)
    } else phy_speed_y = _speed
}
if (keyboard_check(ord("A")) || keyboard_check(vk_left)) and not(keyboard_check(ord("D")) || keyboard_check(vk_right)) {
    if (global.control_style == "classic") fake_direction -= 3.65
    else {
        phy_speed_x = -_speed;
        sendPosPack = true
    }
}
if (keyboard_check(ord("D")) || keyboard_check(vk_right)) and not(keyboard_check(ord("A")) || keyboard_check(vk_left)) {
    if (global.control_style == "classic") fake_direction += 3.65
    else {
        phy_speed_x = _speed;
        sendPosPack = true
    }
}
x = phy_position_x
y = phy_position_y
if (!global.dead) {
    var list = ds_list_create()
    instance_place_list(x, y, gem_obj, list, true)
    if (not ds_list_empty(list)) {
        for (var i = 0; i < ds_list_size(list); i++) {
            var coll = ds_list_find_value(list, i)
            //with (coll) {
            addPacket({
                type: "collect_gem",
                uuid: coll.uuid,
                gem_type: coll.image_index
            })
            audio_play_sound(Pickup_sound, 2, false)
            switch (coll.image_index) {
                case 0: {
                    red_n++
                    break;
                }
                case 1: {
                    blue_n++
                    break;
                }
                case 2: {
                    green_n++
                    break;
                }
                case 3: {
                    purple_n++
                    break;
                }

            }
            instance_destroy(coll)
            //}
        }
    }
}

//if (mouse_check_button(mb_right) || keyboard_check(ord("X"))) {
//	 sendPosPack = true
//	x = x - sin(degtorad(dir))
//	y = y - cos(degtorad(dir))
//}

// What?
//x=phy_position_x;
//y=phy_position_y
if (sendPosPack) {
    addPacket({
        x: x,
        y: y,
        dir: dir,
        type: "pos"
    })
}

if ((mouse_check_button(mb_left) || keyboard_check(vk_space)) && (!global.gamemenu)) {
    last_was_clicked = true
    addPacket({
        type: "fire_bullet",
    })
}

if (keyboard_check_pressed(ord("P")) && (global.gamemenu || !global.started)) {
    addPacket({
        type: "begin"
    })
}
/**
	Screenshake
	Adding a whole new object when this object works fine would be unwise
 */
if (global.shake) {
    global.shake_time -= 1;
    var _xval = choose(-global.shake_magnitude, global.shake_magnitude);
    var _yval = choose(-global.shake_magnitude, global.shake_magnitude);
    camera_set_view_pos(view_camera[0], x - camera_get_view_width(view_camera[0]) / 2 + _xval, y - camera_get_view_height(view_camera[0]) / 2 + _yval)

    if (global.shake_time <= 0) {
        global.shake_magnitude -= global.shake_fade;
        if (global.shake_magnitude <= 0) {
            camera_set_view_pos(view_camera[0], x - camera_get_view_width(view_camera[0]) / 2, y - camera_get_view_height(view_camera[0]) / 2)
            global.shake = false;
        }
    }
} else {
    camera_set_view_pos(view_camera[0], x - camera_get_view_width(view_camera[0]) / 2, y - camera_get_view_height(view_camera[0]) / 2)
}
//camera_set_view_pos(view_camera[0],x-camera_get_view_width(view_camera[0])/2,y-camera_get_view_height(view_camera[0])/2)
sendPacket()
