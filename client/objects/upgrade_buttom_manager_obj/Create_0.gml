/// @description Insert description here
// You can write your code in this editor

inital_x = 200
x_pos=inital_x
inital_y = 950
offset_x = 140
tile_sprts = [bullet_damage_spr, bullet_reload_spr, bullet_speed_spr, move_speed_spr]

for(i = 0; i < 4; ++i; ){
	instance_create_layer(0,0,"upgrade_buttons",upgrade_button_obj,{x_offset:x_pos, y_offset:inital_y,spr:tile_sprts[i]})
	x_pos=x_pos+offset_x
}
  

