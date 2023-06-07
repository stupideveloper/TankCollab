/// @description Insert description here
// You can write your code in this editor
global.gamestate = "play"
global.stats = {
    kills: 0,
    damageDealt: 0,
    bulletsFired: 0,
    deaths: 0,
    damageTaken: 0,
    gemsCollected: 0
}
flash = shader_get_uniform(red_flash, "params");

music_readied = true

// Whether a bullet was fired last game tick
last_was_clicked = false

// Packet send queue, packets added here will be sent to the server
packet_queue = {
    packets: []
}
// Whether the game menu is open
global.gamemenu = false

global.paused = false

global.spawned_gems = {}
global.core_health = 1000
// Direcion and speed (?unused?)
dir = 0
spd = 200
// Whether the server is connected
connected = false

// If not, how many ticks since server connection attempt started
tics = 0
/**
   Screenshake variables
 */
global.shake = false;
global.shake_time = 0;
global.shake_magnitude = 0;
global.shake_fade = 0.25;


image_xscale = 0.3;
image_yscale = 0.3;

// Fake image direction
fake_direction = 0;

// Speed of the tank
global.speeed = 10

/**
Which control style to use.
Classic: Rotation and forward/backwards
Simple: Standard WASD controls
 */
global.control_style = "simple"

// Maximum health
global.max_health = 100

// Dispayed title, unused
global.title = ""

// Whether the client thinks it is dead
global.dead = false

// How long until the respawn
global.respawntime = 0

// An array containing every other player's X, Y and direction
global.other_player_xy = []

// Other player other information
global.other_players = {}

// List of all projectiles
global.projectiles = {}

// How much health the client has
global.health = 100


// What the client thinks it's UUID is
this_id = ""

// Gem Inventory
blue_n = 0
green_n = 0
red_n = 0
purple_n = 0
global.gems = {
    BLUE: 0,
    RED: 0,
    GREEN: 0,
    PURPLE: 0
}


// [UNUSED]
old_x2 = 0
ticks_since_update = 0
old_y2 = 0
last_pack_ticks = 0

// connect to the server
client = network_create_socket(network_socket_tcp);
var server = network_connect_raw_async(client, global.IP_ADDR, 9000);
show_debug_message(string(server))