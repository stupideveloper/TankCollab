/// @description Insert description here
// You can write your code in this 

// Draw a square (useless)
draw_rectangle(200-15,200-15,200+15,200+15,false)
draw_set_color(c_black)
//draw_line(x,y,x+20*cos(degtorad(fake_direction)),y+20*sin(degtorad(fake_direction)))
if (mouse_check_button(mb_any)) draw_set_color(c_red)
// Alpha of the 
var alpha = global.dead?0.5:1
var chassis = (global.control_style=="classic")?0:4
draw_sprite_ext(tank_spr,chassis,x,y,.3,.3,-fake_direction,-1,alpha)
draw_set_color(c_white)
for (var i = 0; i < array_length(global.other_player_xy); i++) {
	//try {
	if (global.other_player_xy[i].id == global.this_id) continue;
	if (global.other_player_xy[i].hidden == true) continue;
	try {
		draw_set_colour(c_black)
		draw_rectangle(global.other_player_xy[i].x,global.other_player_xy[i].y,global.other_player_xy[i].x+50,global.other_player_xy[i].y+30, false)
		draw_set_colour(c_green)
		draw_rectangle(global.other_player_xy[i].x+5,global.other_player_xy[i].y+5,global.other_player_xy[i].x+45,global.other_player_xy[i].y+25, false)
	} catch (e) {e=e}
	if (global.teams[$ global.other_player_xy[i].id] == true) {
		draw_set_color(c_white)
		draw_sprite_ext(tank_spr,3,global.other_player_xy[i].x,global.other_player_xy[i].y,.3,.3,global.other_player_xy[i].dir,-1,1)
	} else {
		draw_set_color(c_red)
		draw_sprite_ext(tank_spr,2,global.other_player_xy[i].x,global.other_player_xy[i].y,.3,.3,global.other_player_xy[i].dir,-1,1)
		//draw_rectangle(global.other_player_xy[i][1]-10,global.other_player_xy[i][2]-10,global.other_player_xy[i][1]+10,global.other_player_xy[i][2]+10,false)
		draw_set_color(c_white)
	}
	//} catch (e) {
	
	//}
}
for (var i = 0; i < array_length(variable_struct_get_names(global.projectiles)); i++) {
			var projectile = variable_struct_get(global.projectiles,variable_struct_get_names(global.projectiles)[i])
			draw_set_color(c_red)
		draw_sprite_ext(bullet_spr,0,projectile.x,projectile.y,0.4,0.4,projectile.dir+90,-1,1)
		//draw_rectangle(global.other_player_xy[i][1]-10,global.other_player_xy[i][2]-10,global.other_player_xy[i][1]+10,global.other_player_xy[i][2]+10,false)
		draw_set_color(c_white)
		}
		draw_sprite_ext(tank_spr,1,x,y,.3,.3,dir,-1,alpha)

