/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_black)
if (!connected) {
    draw_rectangle(0, 0, view_wport[0],
        view_hport[0], false)
} else {
    draw_set_font(label_fnt)
    y_offset = -10
    if (global.this_team == "A") {

        draw_set_halign(fa_left)
        draw_text(50, 40 + y_offset, "Core") // Draw title
        draw_healthbar(50, 50 + y_offset, 400, 70 + y_offset, (global.core_own_health / global.constants.core_max_health) * 100, c_black, c_green, c_green, 0, true, true) // Draw core health

        draw_text(50, 90 + y_offset, "Shield Generators")
        draw_healthbar(50, 100 + y_offset, 200, 110 + y_offset, (global.left_shield_own_health / global.constants.shield_generator_max_health) * 100, c_black, c_blue, c_blue, 0, true, true) // draw shield gen health
        draw_healthbar(210, 100 + y_offset, 360, 110 + y_offset, (global.right_shield_own_health / global.constants.shield_generator_max_health) * 100, c_black, c_blue, c_blue, 0, true, true)
    } else { // Flip if on other side
        draw_set_halign(fa_right)
        draw_text(view_wport[0] - 50, 40 + y_offset, "Core")
        draw_healthbar(view_wport[0] - 50, 50 + y_offset, view_wport[0] - 400, 70 + y_offset, (global.core_own_health / global.constants.core_max_health) * 100, c_black, c_green, c_green, 0, true, true)

        draw_text(view_wport[0] - 50, 90 + y_offset, "Shield Generators")
        draw_healthbar(view_wport[0] - 50, 100 + y_offset, view_wport[0] - 200, 110 + y_offset, (global.left_shield_own_health / global.constants.shield_generator_max_health) * 100, c_black, c_blue, c_blue, 0, true, true)
        draw_healthbar(view_wport[0] - 210, 100 + y_offset, view_wport[0] - 360, 110 + y_offset, (global.right_shield_own_health / global.constants.shield_generator_max_health) * 100, c_black, c_blue, c_blue, 0, true, true)
    }
    draw_set_halign(fa_middle)
    draw_text(view_wport[0] / 2, 95 + y_offset, "Health")
    draw_healthbar((view_wport[0] / 2) - 175, 100, (view_wport[0] / 2) + 175, 120, (global.health / global.max_health) * 100, c_black, c_red, c_green, 0, true, true)
    draw_set_colour(c_black)
    draw_set_halign(fa_left)
    //show_debug_message(global.title)
    var font = draw_get_font()
    draw_set_font(Inventory_fnt)
    if (global.title != "") {

        //draw_text(
        //view_wport[0]/2,100,
        //	global.title
        //)
        if (global.title_time-- == 0) {
            global.title = ""
        }
    }
    draw_set_halign(fa_right)
    draw_set_valign(fa_bottom)
    try draw_text(view_wport[0] - 12, view_hport[0] - 12, $"Teammates left: {global.teamsizes.own - 1}\nEnemies left: {global.teamsizes.oth}");
    catch (e) e = e
    draw_set_font(font)
    if (global.gamemenu) {
        draw_set_alpha(0.75)
        draw_set_color(c_black)
        draw_rectangle(0, 0, view_wport[0], view_hport[0], false)
        draw_set_alpha(1)
        var font = draw_get_font()
        draw_set_font(IP_fnt)
        draw_set_halign(fa_center)
        draw_set_valign(fa_bottom)
        draw_text(
            view_wport[0] / 2, view_hport[0] / 2 - 190,
            "Game Menu"
        )
        draw_set_font(Inventory_fnt)
        draw_text(
            view_wport[0] / 2, view_hport[0] / 2 + 60,
            $"Control Style: {global.control_style} (press C to change)\nServer Code: {global.splash_data.ip}\nConnected Code: {global.ip_construct}\nGame Version: {global.splash_data.gameVersion}\nServer Avg Tick Time: {global.splash_data.nsPerTick}ns\nServer Last Tick Time: {global.splash_data.nsLastTick}ns\nMaximum Tick Time: {global.splash_data.maxTick}ns\nLast Packet Size: {global.splash_data.packetsize}B"
        )
        draw_set_font(font)
        draw_set_halign(fa_center)
    }

}

if (!global.started && connected) {
    notification_obj.immediatelyhide = true
    draw_set_color(c_black)
    draw_rectangle(0, 0, view_wport[0], view_hport[0], false)
    draw_set_alpha(1)
    var font = draw_get_font()
    draw_set_font(IP_fnt)
    draw_set_halign(fa_center)
    draw_set_valign(fa_bottom)
    draw_set_colour(c_white)
    draw_text(
        view_wport[0] / 2, view_hport[0] / 2 - 190,
        global.paused ? "Game Paused" : "Waiting for Game Start"
    )

    draw_set_font(Inventory_fnt)
    try draw_text(
        view_wport[0] / 2, view_hport[0] / 2 + 140,
        $"{global.teamsizes.oth+global.teamsizes.own} Players Waiting\n\nControl Style: {global.control_style} (press C to change)\nServer IP: {global.splash_data.ip}\nConnected IP: {global.ip_construct}\nClient IP: {global.splash_data.connectionIp}\nGame Version: {global.splash_data.gameVersion}\n{global.this_team=="A"?"Team A":"Team B"}")
    catch (e) e = e
    draw_set_halign(fa_left)
    draw_set_valign(fa_bottom)
    //draw_text(0,view_hport[0],"Press F to toggle fullscreen")
    draw_set_font(font)
    draw_set_halign(fa_center)
} else {
    if (music_readied) {
        audio_play_sound(BG_music, 4, true)
        notification_obj.visible = false
        music_readied = false
    }
}

draw_set_color(c_white)


// Draw Banner
if (global.started) {
    if (global.left_shield_other_health > 0 || global.right_shield_other_health > 0) {
        draw_sprite(banner_spr, 0, (view_wport[0] / 2), 50)
    } else if (global.core_other_health > 0) {
        draw_sprite(banner_spr, 1, (view_wport[0] / 2), 50)
    } else {
        draw_sprite(banner_spr, 2, (view_wport[0] / 2), 50)
    }
}


// Draw either the win or lose sprite if applicable
if (global.gamestate == "loss") {
    draw_sprite(winlose_spr, 0, 0, 0)
    draw_set_colour(c_black)
    draw_set_halign(fa_right)
    draw_set_font(IP_fnt)
    draw_text(650, 570, string(global.stats.bulletsFired))
    draw_text(650, 693, string(global.stats.kills))
    draw_text(650, 816, string(global.stats.deaths))
    draw_text(650, 939, string(global.stats.gemsCollected))
} else if (global.gamestate == "win") {
    draw_sprite(winlose_spr, 1, 0, 0)
    draw_set_colour(c_black)
    draw_set_halign(fa_right)
    draw_set_font(IP_fnt)
    draw_text(650, 570, string(global.stats.bulletsFired))
    draw_text(650, 693, string(global.stats.kills))
    draw_text(650, 816, string(global.stats.deaths))
    draw_text(650, 939, string(global.stats.gemsCollected))
}