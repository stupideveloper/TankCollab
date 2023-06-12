/// @description Insert description here
// You can write your code in this 

draw_set_color(c_black)
//draw_line(x,y,x+20*cos(degtorad(fake_direction)),y+20*sin(degtorad(fake_direction)))
if (mouse_check_button(mb_any)) draw_set_color(c_red)
// Alpha of the 
var alpha = global.dead ? 0.5 : 1
var chassis = (global.control_style == "classic") ? 0 : 4
if (global.damage_flash > 0) {
    shader_set(red_flash)
    shader_set_uniform_f(flash, global.damage_flash / 20)
}
draw_sprite_ext(tank_spr, chassis, x, y, .3, .3, -fake_direction, -1, alpha)
shader_reset()
draw_set_color(c_white)
for (var i = 0; i < array_length(global.other_player_xy); i++) {
    if (global.other_player_xy[i].id == global.this_id) continue;
    if (global.other_player_xy[i].hidden == true) continue;
    try {
        var _x = global.other_player_xy[i].x
        var _y = global.other_player_xy[i].y
        draw_healthbar(
		_x - 50, _y - 65, _x + 50, _y - 50, 
		(global.other_player_xy[i].health / global.other_player_xy[i].max_health) * 100, c_black, c_red, c_green, 0, true, true)
        var oldFont = draw_get_font()
        draw_set_font(nametag_fnt)
        draw_set_colour(c_black)
        draw_set_halign(fa_middle)
        draw_set_valign(fa_middle)
        draw_text(_x, _y - 80, global.other_player_xy[i].name)
        draw_set_font(oldFont)
    } catch (e) show_debug_message(e)
    if (global.teams[$ global.other_player_xy[i].id] == true) {
        draw_set_color(c_white)
        draw_sprite_ext(tank_spr, 3, global.other_player_xy[i].x, global.other_player_xy[i].y, .3, .3, global.other_player_xy[i].dir, -1, 1)
    } else {
        draw_set_color(c_red)
        draw_sprite_ext(tank_spr, 2, global.other_player_xy[i].x, global.other_player_xy[i].y, .3, .3, global.other_player_xy[i].dir, -1, 1)
        //draw_rectangle(global.other_player_xy[i][1]-10,global.other_player_xy[i][2]-10,global.other_player_xy[i][1]+10,global.other_player_xy[i][2]+10,false)
        draw_set_color(c_white)
    }
}
for (var i = 0; i < array_length(variable_struct_get_names(global.projectiles)); i++) {
    var projectile = variable_struct_get(global.projectiles, variable_struct_get_names(global.projectiles)[i])
    draw_set_color(c_red)
    draw_sprite_ext(bullet_spr, 0, projectile.x, projectile.y, 0.4, 0.4, 0, -1, 1)
    //draw_rectangle(global.other_player_xy[i][1]-10,global.other_player_xy[i][2]-10,global.other_player_xy[i][1]+10,global.other_player_xy[i][2]+10,false)
    draw_set_color(c_white)
}
if (global.damage_flash > 0) {
    shader_set(red_flash)
    global.damage_flash -= 0
    shader_set_uniform_f(flash, global.damage_flash / 20)
    global.damage_flash -= 1
}
draw_sprite_ext(tank_spr, 1, x, y, .3, .3, dir, -1, alpha)
shader_reset()