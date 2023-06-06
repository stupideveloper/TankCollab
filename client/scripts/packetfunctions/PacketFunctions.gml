// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information

// Decompress the packets using the same compression as the server, just reversed
function decompressMiscPacket(packet) {
    var splitted = string_split(packet, "|")
    try {
        switch (splitted[0]) {
            case "0": {
                return {
                    type: "teleport",
                    x: parseInt(splitted[1], 36) / 100,
                    y: parseInt(splitted[2], 36) / 100,
                    dir: parseInt(splitted[3], 36) / 100,
                }
            }
            case "1": {
                return {
                    type: "screenshake",
                    time: parseInt(splitted[1], 36) / 100,
                    magnitude: parseInt(splitted[2], 36) / 100,
                    fade: parseInt(splitted[3], 36) / 100,
                }
            }
            case "2": {
                return {
                    type: "title",
                    time: parseInt(splitted[1], 36) / 100,
                    title: splitted[2]
                }
            }
            case "3": {
                var state = splitted[1] == "1" ? "win" : "lose"
                return {
                    type: "gamestate",
                    title: state,
                    stats: {
                        kills: parseInt(splitted[2], 36),
                        damageDealt: parseInt(splitted[3], 36),
                        bulletsFired: parseInt(splitted[4], 36),
                        deaths: parseInt(splitted[5], 36),
                        damageTaken: parseInt(splitted[6], 36),
                        gemsCollected: parseInt(splitted[7], 36)
                    }
                }
            }
            case "4": {
                if (splitted[1] == "o") {
                    return {
                        type: "playerleave",
                        player: splitted[2]
                    }
                } else {
                    return {
                        type: "playerjoin",
                        player: splitted[2]
                    }
                }
            }
            case "5": {
                return {
                    type: "health_update",
                    health: parseInt(splitted[1], 36),
                    max_health: parseInt(splitted[2], 36),
                }
            }
            case "6": {
                if (splitted[1] == "d") {
                    return {
                        type: "damage"
                    }
                } else if (splitted[1] == "D") {
                    return {
                        type: "death"
                    }
                } else {
                    return {
                        type: "final_death"
                    }
                }
            }
            case "7": {
                return {
                    type: "team_set",
                    team: splitted[1]
                }
            }
            case "8": {
                return {
                    type: "gameplay_data_update",
                    shield_generator_max_health: parseInt(splitted[1], 36),
                    core_max_health: parseInt(splitted[1], 36)
                }
            }
            case "9": {
                return {
                    type: "gem_spawn",
                    x: parseInt(splitted[1], 36),
                    y: parseInt(splitted[2], 36),
                    gem_type: splitted[3],
                    uuid: splitted[4]
                }
            }
            case "A": {
                return {
                    type: "respawn",
                    max_health: parseInt(splitted[1], 36)
                }
            }
            case "B": {
                return {
                    type: "collect_gem",
                    uuid: splitted[1]
                }
            }
            default: {
                show_debug_message(splitted)
            }
        }
    } catch (e) {
        show_debug_message(e)
    }
}

function decompressPacket(packet) {
    try {
        var positionCompressed = packet[8]
        var positionDecompressed = []
        var projectileCompressed = packet[9]
        var projectileDecompressed = {}
        var miscPacketscompressed = string_split(packet[10], "||")
        var miscPacketsDecompressed = []
        for (var i = 0; i < array_length(miscPacketscompressed); i++) {
            var pos = array_get(miscPacketscompressed, i)
            if (string_length(pos) == 0) continue;
            var decomp = decompressMiscPacket(pos)
            //  show_debug_message(decomp)
            array_push(miscPacketsDecompressed, decomp)
        }

        for (var i = 0; i < array_length(positionCompressed); i++) {
            var pos = array_get(positionCompressed, i)
            var poss = {
                id: pos[0],
                x: pos[1],
                y: pos[2],
                dir: pos[3],
                name: pos[4],
                health: pos[5],
                max_health: pos[6]
            }
            array_push(positionDecompressed, poss)
        }
        for (var i = 0; i < array_length(projectileCompressed); i++) {
            var pos = array_get(projectileCompressed, i)
            var poss = {
                id: pos[0],
                x: pos[1],
                y: pos[2]
            }
            struct_set(projectileDecompressed, pos[0], poss)
        }
        var decompressed = {
            type: "positions",
            this_id: packet[0],
            gems: {
                RED: packet[1][0],
                BLUE: packet[1][1],
                GREEN: packet[1][2],
                PURPLE: packet[1][3]
            },
            health: packet[2],
            teamPlayers: packet[3],
            playerlist: packet[4],
            upgrades: {
                bulletDamage: packet[5][0],
                bulletReload: packet[5][1],
                bulletSpeed: packet[5][2],
                moveSpeed: packet[5][3],
                maxHealth: packet[5][4],
                healthRegen: packet[5][5]
            },
            upgradeTiers: {
                bulletDamage: packet[6][0],
                bulletReload: packet[6][1],
                bulletSpeed: packet[6][2],
                moveSpeed: packet[6][3],
                maxHealth: packet[6][4],
                healthRegen: packet[6][5]
            },
            respawn_time: packet[7],
            locations: positionDecompressed,
            projectiles: projectileDecompressed,
            misc_packets: miscPacketsDecompressed,
            team_data: {
                rightShieldHealth: packet[11][0],
                leftShieldHealth: packet[11][1],
                coreHealth: packet[11][2],
                rightShield: {
                    id: packet[11][3][0],
                    x: packet[11][3][1],
                    y: packet[11][3][2],
                    alive: packet[11][3][3]
                },
                leftShield: {
                    id: packet[11][4][0],
                    x: packet[11][4][1],
                    y: packet[11][4][2],
                    alive: packet[11][4][3]
                },
                core: {
                    id: packet[11][5][0],
                    x: packet[11][5][1],
                    y: packet[11][5][2],
                    alive: packet[11][5][3]
                }
            },
            other_team_info: {
                rightShield: packet[12][0],
                leftShield: packet[12][1],
                core: packet[12][2],
                rightShieldLoc: {
                    id: packet[12][3][0],
                    x: packet[12][3][1],
                    y: packet[12][3][2],
                    alive: packet[12][3][3]
                },
                leftShieldLoc: {
                    id: packet[12][4][0],
                    x: packet[12][4][1],
                    y: packet[12][4][2],
                    alive: packet[12][4][3]
                },
                coreLoc: {
                    id: packet[12][5][0],
                    x: packet[12][5][1],
                    y: packet[12][5][2],
                    alive: packet[12][5][3]
                }
            },
            splashData: {
                ip: packet[13][0],
                gameVersion: packet[13][1],
                connectionIp: packet[13][2],
                nsPerTick: packet[13][3],
                nsLastTick: packet[13][4],
                maxTick: packet[13][5]
            },
            beginned: packet[14],
            availableUpgrades: {
                bulletDamage: packet[15][0],
                bulletReload: packet[15][1],
                bulletSpeed: packet[15][2],
                moveSpeed: packet[15][3],
                maxHealth: packet[15][4],
                healthRegen: packet[15][5]
            },
            teamSizes: {
                own: packet[16][0],
                oth: packet[16][1],
            }
        }
        return decompressed
    } catch (e) {
        show_debug_message(e)
    }
}

// Checks whether an IP address is valid
// No Regular Expressions in GML :(

function IPCheck(ip_addr) {
    var split = string_split(ip_addr, ".")
    if (array_length(split) == 4) {
        try {
            var first = real(split[0])
            var second = real(split[1])
            var third = real(split[2])
            var fourth = real(split[3])
            if (first < 256 && second < 256 && third < 256 && fourth < 256) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    } else {
        return false
    }
}
// a handy sine and cosine function with degrees rather than radians
function sin_(d) {
    return sin(degtorad(d))
}

function cos_(d) {
    return cos(degtorad(d))
}

// check whether an array includes a value, cannot believe this is not in gamemaker already
function array_includes(array, value) {
    for (var i = 0; i < array_length(array); i++) {
        if (array[i] == value) return true
    }
    return false
}
// add a packet to packet queue
function addPacket(packetobject) {

    if (struct_exists(multiplayer_handler.packet_queue, "packets")) {
        array_push(multiplayer_handler.packet_queue.packets, packetobject)
    } else {
        struct_set(multiplayer_handler.packet_queue, "packets", [packetobject])
    }
}
// send all the queued packets to the server
function sendPacket() {
    var json = json_stringify(multiplayer_handler.packet_queue)
    struct_set(multiplayer_handler.packet_queue, "packets", [])
    var buff = buffer_create(0, buffer_grow, 1)
    buffer_write(buff, buffer_text, json)
    network_send_packet(multiplayer_handler.client, buff, buffer_get_size(buff))
}
// handle the recieving end of packets, it is over 250 lines long and thus will not be commented
function handlePackets(packets) {
    try {

        if (packets.type == "positions") {
            global.this_id = packets.this_id
            for (var i = 0; i < array_length(packets.playerlist); i++) {
                if (!variable_struct_exists(global.other_players, packets.playerlist[i])) {
                    variable_struct_set(global.other_players, packets.playerlist[i], {
                        colour: "normal"
                    })
                    show_debug_message("[DEBUG] + " + packets.playerlist[i])
                }
            }
            for (var i = 0; i < array_length(variable_struct_get_names(global.other_players)); i++) {
                if (!array_includes(packets.playerlist, variable_struct_get_names(global.other_players)[i])) {
                    show_debug_message("[DEBUG] - " + variable_struct_get_names(global.other_players)[i])
                    variable_struct_remove(global.other_players, variable_struct_get_names(global.other_players)[i])
                }
            }
            try {
                global.right_shield_own_health = packets.team_data.rightShieldHealth
                global.left_shield_own_health = packets.team_data.leftShieldHealth
                global.right_shield_other_health = packets.other_team_info.rightShield
                global.left_shield_other_health = packets.other_team_info.leftShield
                global.core_own_health = packets.team_data.coreHealth
                global.core_other_health = packets.other_team_info.core
                if (!global.has_spawned_shields) {
                    var sls = packets.team_data.leftShield
                    var sle = packets.other_team_info.leftShieldLoc
                    var srs = packets.team_data.rightShield
                    var sre = packets.other_team_info.rightShieldLoc
                    var ce = packets.other_team_info.coreLoc
                    var cs = packets.team_data.core

                    var a = instance_create_layer(sle.x, sle.y, "Instances", shield_left_enemy_obj, {
                        sdead: !sle.alive,
                        image_xscale: 0.5,
                        image_yscale: 0.5
                    })
                    var b = instance_create_layer(sls.x, sls.y, "Instances", shield_left_self_obj, {
                        sdead: !sls.alive,
                        image_xscale: 0.5,
                        image_yscale: 0.5
                    })
                    var c = instance_create_layer(srs.x, srs.y, "Instances", shield_right_self_obj, {
                        sdead: !srs.alive,
                        image_xscale: 0.5,
                        image_yscale: 0.5
                    })
                    var d = instance_create_layer(sre.x, sre.y, "Instances", shield_right_enemy_obj, {
                        sdead: !sre.alive,
                        image_xscale: 0.5,
                        image_yscale: 0.5
                    })
                    var e = instance_create_layer(ce.x, ce.y, "Instances", core_ememy_obj, {
                        sdead: !ce.alive,
                        image_xscale: 0.75,
                        image_yscale: 0.75
                    })
                    var f = instance_create_layer(cs.x, cs.y, "Instances", core_self_obj, {
                        sdead: !cs.alive,
                        image_xscale: 0.75,
                        image_yscale: 0.75
                    })

                    global.has_spawned_shields = true;
                    array_push(global.remove_on_disconnect, a, b, c, d, e, f)
                }
            } catch (e) {
                show_debug_message(e)
                show_debug_message(packets)
            }
            for (var i = 0; i < array_length(packets.misc_packets); i++) {
                var extra_packet = packets.misc_packets[i];
                //show_debug_message(extra_packet)
                try {
                    switch extra_packet.type {
                        case "animation": {
                            if (extra_packet.player == global.this_id) break;
                            if (extra_packet.data == "press") {
                                variable_struct_get(global.other_players, extra_packet.player).colour = "notnormal";
                            } else {
                                variable_struct_get(global.other_players, extra_packet.player).colour = "normal";
                            }
                            break;
                        }
                        case "teleport": {

                            //show_debug_message(extra_packet)
                            multiplayer_handler.x = extra_packet.x
                            multiplayer_handler.phy_position_x = extra_packet.x
                            multiplayer_handler.y = extra_packet.y
                            multiplayer_handler.phy_position_y = extra_packet.y
                            multiplayer_handler.dir = extra_packet.dir
                            break;
                        }
                        case "health_update": {
                            global.health = extra_packet.health
                            if (variable_struct_exists(extra_packet, "max_health")) {
                                global.maxhealth = extra_packet.max_health
                            }
                            break;
                        }
                        case "death": {
                            DisplayAlert(4, 4)
                            global.dead = true
                            // global.title = "You died! Respawning in %i seconds!"
                            break;
                        }
                        case "respawn": {
                            global.dead = false
                            global.health = extra_packet.max_health
                            global.maxhealth = extra_packet.max_health
                            break;
                        }
                        case "screenshake": {
                            audio_play_sound(Shoot_sound, 2, false)
                            global.shake = true
                            global.shake_time = extra_packet.time;
                            global.shake_magnitude = extra_packet.magnitude;
                            global.shake_fade = extra_packet.fade;
                            break;
                        }
                        case "team_set": {
                            //show_debug_message(extra_packet)
                            global.this_team = extra_packet.team
                            break;
                        }
                        case "gem_spawn": {
                            instance_create_layer(extra_packet.x, extra_packet.y, "Instances", gem_obj, {
                                image_index: extra_packet.gem_type,
                                image_xscale: 1,
                                image_yscale: 1,
                                uuid: extra_packet.uuid
                            })

                            break;
                        }
                        case "collect_gem": {

                            try {
                                var gemtodelete = struct_get(global.spawned_gems, extra_packet.uuid)
                                // show_debug_message(global.spawned_gems)
                                // show_debug_message(extra_packet.uuid)
                                instance_destroy(gemtodelete)
                                struct_remove(global.spawned_gems, extra_packet.uuid)
                            } catch (e) {
                                // show_debug_message(e)
                            }
                            break;
                        }
                        case "core_shield_destroy": {
                            switch (extra_packet.id) {
                                case "A:core": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "A") {
                                        DisplayAlert(5, 5)
                                        global.title_time = -1
                                        core_self_obj.dead = true;
                                    } else {
                                        DisplayAlert(6, 5)
                                        core_ememy_obj.dead = true;
                                    }
                                    break;
                                }
                                case "B:core": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "B") {
                                        DisplayAlert(5, 5)
                                        global.title_time = -1
                                        core_self_obj.dead = true;
                                    } else {
                                        DisplayAlert(6, 5)

                                        core_ememy_obj.dead = true;
                                    }
                                    break;
                                }
                                case "A:rshield": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "A") {
                                        OwnShieldDestroyed()

                                        global.title_time = -1
                                        shield_right_self_obj.dead = true;
                                    } else {
                                        EnemyShieldDestroyed()
                                        shield_right_enemy_obj.dead = true;
                                    }
                                    break;
                                }
                                case "B:rshield": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "B") {

                                        OwnShieldDestroyed()
                                        global.title_time = -1
                                        shield_right_self_obj.dead = true;
                                    } else {
                                        EnemyShieldDestroyed()
                                        shield_right_enemy_obj.dead = true;
                                    }
                                    break;
                                }
                                case "A:lshield": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "A") {
                                        OwnShieldDestroyed()
                                        global.title_time = -1
                                        shield_left_self_obj.dead = true;
                                    } else {
                                        EnemyShieldDestroyed()
                                        shield_left_enemy_obj.dead = true;
                                    }
                                    break;
                                }
                                case "B:lshield": {
                                    audio_play_sound(Shutdown_sound, 1, false)
                                    if (global.this_team == "B") {
                                        OwnShieldDestroyed()
                                        global.title_time = -1
                                        shield_left_self_obj.dead = true;
                                    } else {
                                        EnemyShieldDestroyed()
                                        shield_left_enemy_obj.dead = true;
                                    }
                                    break;
                                }
                                default: {
                                    show_debug_message(extra_packet)
                                }
                            }
                            break;
                        }
                        case "gameplay_data_update": {
                            global.constants.shield_generator_max_health = extra_packet.shield_generator_max_health;
                            global.constants.core_max_health = extra_packet.core_max_health;
                            break;
                        }
                        case "title": {
                            global.title = extra_packet.title
                            global.title_time = extra_packet.time * ceil(game_get_speed(gamespeed_fps))
                            break;
                        }
                        case "gamestate": {
                            if (extra_packet.title == "loss") {
                                global.gamestate = "loss"
                            } else {
                                global.gamestate = "win"
                            }
                            global.stats = extra_packet.stats
                            break;
                        }
                        case "damage": {
                            global.damage_flash = 10
                            break;
                        }
                        default: {
                            show_debug_message(extra_packet)
                        }
                    }
                } catch (e) {
                    show_debug_message(packets)
                    show_debug_message(e)
                }
            }
            global.upgrades = packets.upgrades
            global.speeed = global.upgrades.moveSpeed
            global.respawntime = packets.respawn_time
            if (global.respawntime == -1) {
                global.dead = false
            }

            global.core_health = packets.team_data.coreHealth
            global.teams = packets.teamPlayers
            global.projectiles = packets.projectiles
            global.gems = packets.gems
            global.upgrade_tiers = packets.upgradeTiers
            global.health = packets.health
            global.other_player_xy = packets.locations
            var packetsize = global.splash_data.packetsize;
            global.splash_data = packets.splashData
            global.splash_data.packetsize = packetsize;
            global.teamsizes = packets.teamSizes;
            global.available_upgrades = packets.availableUpgrades
            global.started = packets.beginned
            global.max_health = global.upgrades.maxHealth
            //global.maxhealth = global.upgrades.maxHealth
            // show_debug_message(packets.availableUpgrades)
            //show_debug_message(array_length(variable_struct_get_names(packets.projectiles)))
        } else if (packets.type == "id") {
            global.this_id = packets.this_id
        }
    } catch (e) {
        show_debug_message(packets)
        show_debug_message(e)
    }
}

function toBase(number, radix, digits) {
    number = argument0
    radix = argument_count > 1 ? argument1 : 10;
    digits = argument_count > 2 ? argument2 : "0123456789abcdefghijklmnopqrstuvwxyz";
    if (radix > string_length(digits)) {
        throw "invalid digits and radix"
    }
    if (number == 0) return string_char_at(digits, 1);
    var a = [];
    while (number != 0) {
        array_insert(a, 0, string_char_at(digits, number mod radix + 1));
        number = floor(number / radix);
    }
    return string_join_ext("", a);
};

function parseInt(_string, _radix) {
    var number, oldbase, newbase, out;
    number = string_upper(argument0);
    oldbase = argument1;
    newbase = 10;
    out = "";
    var len, tab;
    len = string_length(number);
    tab = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var i, num;
    for (i = 0; i < len; i += 1) {
        num[i] = string_pos(string_char_at(number, i + 1), tab) - 1;
    }
    do {
        var divide, newlen;
        divide = 0;
        newlen = 0;
        for (i = 0; i < len; i += 1) {
            divide = divide * oldbase + num[i];
            if (divide >= newbase) {
                num[newlen] = divide div newbase;
                newlen += 1;
                divide = divide mod newbase;
            } else if (newlen > 0) {
                num[newlen] = 0;
                newlen += 1;
            }
        }
        len = newlen;
        out = string_char_at(tab, divide + 1) + out;
    }
    until(len == 0);
    return real(out);
}

function decodeCode(code) {
    var dictionary = string_split("0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z", ",")
    firstLetter = string_char_at(code, 0)
    var index = array_find_index(dictionary, function search(v) {
        return v == firstLetter
    })
    var randomLetter = index >> 1
    var newcode = string_replace(code, firstLetter, dictionary[index & 0b1])
    var binary = toBase(parseInt(newcode, 36), 2, "01")
    if (string_length(binary) != 32) {
        binary = string_repeat("0", 32 - string_length(binary)) + binary
    }
    var segments = []
    for (var i = 0; i < 4; i++) {
        var parts = [
            string_char_at(binary, 8 * i + 1),
            string_char_at(binary, 8 * i + 2),
            string_char_at(binary, 8 * i + 3),
            string_char_at(binary, 8 * i + 4),
            string_char_at(binary, 8 * i + 5),
            string_char_at(binary, 8 * i + 6),
            string_char_at(binary, 8 * i + 7),
            string_char_at(binary, 8 * i + 8),
        ]
        var section = string_join_ext("", parts)
        var ip_part_xorred = parseInt(section, 2)
        array_push(segments, ip_part_xorred ^ randomLetter)
    }
    return string_join_ext(".", segments)
}