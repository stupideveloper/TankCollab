/**
 * Whether to reset player location if the client goes too fast
 */
const do_lag_back = true

/**
 * Whether to allow friendly fire
 */
const do_friendly_fire = true;


/**
 * Import the networking library API
 */
const net = require("net")
/** 
 * The separator between two gamemaker packets
 * Raw packets could be used, but gamemaker will concatenate them anyway, so this is easier
 * */
const gamemakerMagic = "dec0adde0c"
/**
 * Import the randomUUID function from `crypto`, which creates a cryptographically secure UUID
 */
const uuid = require("crypto").randomUUID
const fs = require("fs")
/**
 * Converts a degree angle to radians
 * @param {number} degrees 
 * @returns {number}
 */
const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;
const Collision = require("./rect_collisions.js");
/**
 * Imports the collision helper functions
 */
const { checkWalls, bulletRect, tankRect } = require("./arenaCollisions.js");
const { checkPlayer } = require("./playerCollisions.js")

var server = net.createServer();
/**
 * An object that stores all of the positions for the clients
 */
let clientsPos = {}
/**
 * A set that contains additional information about the clients
 */
let clients = {
    "lobby": new Set()
}
/**
 * An object containing packet listeners, each will be called every game tick
 */
let packetListeners = {

}
/**
 * Different team names
 */
const teams = {
    TEAM_A: "A",
    TEAM_B: "B"
}
/**
 * Team selection algorithm
 */
let teamSizes = { A: 0, B: 0 }
let teamSelector = () => {
    if (teamSizes[teams.TEAM_A] == teamSizes[teams.TEAM_B]) {
        return Math.random() > 0.5 ? teams.TEAM_A : teams.TEAM_B;
    }
    return teamSizes[teams.TEAM_A] > teamSizes[teams.TEAM_B] ? teams.TEAM_B : teams.TEAM_A;
}
class GemType {
    static BLUE = 0b00;
    static GREEN = 0b01;
    static PURPLE = 0b10;
    static RED = 0b11;
    static random() {
        return (
            (Math.random()>0.5)?(Math.random()>0.5)?this.BLUE:this.GREEN:(Math.random()>0.5)?this.PURPLE:this.RED
        )
    }
}
function randomGem(width,height,type=GemType.random()) {
    var gran = 100
    var widthQ, heightQ;
    if (width > height) {
        heightQ = gran;
        widthQ = Math.floor(gran * (width/height))
    } else {
        widthQ = gran;
        heightQ = Math.floor(gran * (height/width))
    }
    return {
        type,
        x: width * Math.floor(Math.random()*(widthQ+1)) / widthQ,
        y: height * Math.floor(Math.random()*(heightQ+1)) / heightQ
    }
}
console.log(randomGem(100,100))
/**
 * An object that stores different upgrades
 */
let upgradeTiers = {
    damage: [10, 12, 14, 16, 18, 20, 22],
    bulletSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
    health: [100, 120, 128, 135, 141, 146, 150],
    damageResistance: [0, 4, 8, 11, 14, 17, 20], // %
    speed: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]
}

/**
 * Includes team-specific data
 */
let teamData = {
    "A": {
        coreHealth: 1000,
        leftShield: 500,
        rightShield: 500,
        spawnpoint: [120, 120]
    },
    "B": {
        coreHealth: 1000,
        leftShield: 500,
        rightShield: 500,
        spawnpoint: [420, 120]
    }
}

/**
 * Team-specific upgrades
 */
function teamUpgradesToTiers(upgrades) {
return Object.keys(upgradeTiers).map(v=>{
    return {
        key: v,
        value: upgradeTiers[v][upgrades[v]]
    }
}).reduce((p,v)=>{
    return {
        ...p,
        [v.key]: v.value
    }
},{})
}
let teamUpgrades = {
    "A": {
        damage: 0,
        bulletSpeed: 0,
        health: 0,
        damageResistance: 0,
        speed: 0
    },
    "B": {
        damage: 0,
        bulletSpeed: 0,
        health: 0,
        damageResistance: 0,
        speed: 0
    }
}
/**
 * Default team upgrades, can be used to revert the above team upgrades
 */
const teamUpgradesDefault = JSON.stringify(teamUpgrades)

/**
 * Every game tick this function runs
 */
setInterval(async function SERVER_GAME_TICK() {
    /**
     * Runs every packet listener, this acts more as a game tick listener
     */
    Object.keys(packetListeners).map(player => {
        packetListeners[player]()
    })

    /**
     * For every room
     */
    Object.keys(rooms).map(room => {
        /**
         * Projectiles to remove later, concurrent modification and iteration of an array could cause issues
         */
        var deletables = []
        /**
         * Every projectile in that room, run ticking code
         */
        Object.keys(rooms[room].projectiles).forEach(id => {
            var projectile = rooms[room].projectiles[id]
            var dir = projectile.dir
            var vel = projectile.vel
            var damage = projectile.damage
            /**
             * Move in the direction `dir`, with a velocity of `vel`
             */
            projectile.x = projectile.x - (Math.sin(toRadians(dir)) * vel)
            projectile.y = projectile.y - (Math.cos(toRadians(dir)) * vel)
            projectile.dist_left -= 1

            /**
             * If the projectile runs out of distance, delte it
             */
            if (projectile.dist_left <= 0) {
                deletables.push(id)
            }

            /**
             * Runs player hit detection
             */
            let hits = checkPlayer(
                clients,
                clientsPos,
                projectile.x,
                projectile.y,
                dir,
                projectile.shooter,
                projectile.damage,
                room)
                /**
                 * If there are hits
                 */
            if (hits.length != 0) {
                /**
                 * Delete this projectile
                 */
                deletables.push(id)

                hits.map(p => { 
                    /**
                     * If the shooter is on the same team, and friendly fire is disabled
                     * Damage the player
                     */
                    if (teamMap[p] == teamMap[projectile.shooter] && !do_friendly_fire) return
                    damagePlayer(p, room, damage) 
                })
                return;
            }
            /**
             * If the projectile hits a wall, delete it
             */
            if (checkWalls({
                ...bulletRect,
                x: projectile.x,
                y: projectile.y,
                angle: projectile.dir || 0
            })) {
                deletables.push(id)
            }
        })
        /**
         * Prevent race conditions by deleting later
         */
        deletables.map(id => {
            delete rooms[room].projectiles[id]
        })
    })
}, 1e3 / 60);
/**
 * Contains room-specific data, such as projectiles
 */
let rooms = {
    "lobby": {
        projectiles: {
            [uuid()]: {
                x: 100,
                y: 100,
                dir: 0,
                vel: 0,
                dist_left: 100,
                shooter: ""
            }
        }
    }
}
/**
 * An object containing packets that get sent to specific clients.
 * 
 * For example, client 12345678-90ab-4def-1234-567890abcdef would have a packet sent by 
 * adding a packet to `clientPackets["12345678-90ab-4def-1234-567890abcdef"]`
 */
let clientPackets = {}
function doCollisions() {

}
/**
 * Apply damage to a player
 * @param {import("crypto").UUID} id 
 * @param {import("crypto").UUID|null} room 
 * @param {number} damage 
 */
function damagePlayer(id, room, damage) {
    /**
     * Reduce the health on the server
     */
    clientsPos[id].health -= damage;
    /**
     * Send a packet to the client with the new health
     */
    clientPackets[id].push({
        type: "health_update",
        health: clientsPos[id].health,
        max_health: -1
    })
    if (clientsPos[id].health <= 0) {
        /**
         * If the player loses all health, send a death packet
         */
        clientPackets[id].push({
            type: "death",
        })
        clientsPos[id].hidden = true
        clientsPos[id].respawnTime = 5 * 60
    }
}
/**
 * An Object that maps the player to the team the player is on
 */
let teamMap = {}

/**
 * Fires a bullet
 * @param {number} x 
 * @param {number} y 
 * @param {number} dir 
 * @param {import("crypto").UUID} shooter 
 * @param {number} damage 
 * @param {import("crypto").UUID} room 
 */
function fireBullet(x = 0, y = 0, dir = 0, shooter = uuid(), damage = 1, room = "lobby") {
    rooms[room].projectiles[uuid()] = {
        x: x,
        y,
        dir,
        vel: 10,
        dist_left: 100,
        damage,
        shooter: shooter,
    }
}

/**
 * Teleports a player
 * @param {import("crypto").UUID} id 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dir 
 */
function teleport(id, x, y, dir) {
    clientsPos[id].x = x;
    clientsPos[id].y = y;
    clientsPos[id].dir = dir || clientsPos[id].dir;
    clientPackets[id].push({
        type: "teleport",
        x: clientsPos[id].x,
        y: clientsPos[id].y,
        dir: clientsPos[id].dir
    })
}

/**
 * Main connection handler
 */
server.on('connection', function (conn) {
    /**
     * Client's IP Address
     */
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    /**
     * Assigns the player a unique id, UUIDv4 has a collision chance of like, close to zero
     */
    const id = uuid()
    /**
     * Selects a team
     */
    const team = teamSelector()
    teamSizes[team] += 1
    teamMap[id] = team;
    // log that IP and ID
    console.log('[DEBUG] + %s (%s)', id, remoteAddress);
    let currentRoom = "lobby"
    /**
     * Init all required variables
     */
    clients[currentRoom].add(id)
    clientPackets[id] = [
        {
            type: "health_update",
            health: upgradeTiers.health[teamUpgrades[team].health],
            max_health: upgradeTiers.health[teamUpgrades[team].health]
        }
    ]
    clientsPos[id] = {
        id: id,
        x: 120,
        y: 120,
        dir: 0,
        health: 100,
        hidden: false,
        respawnTime: -1
    }
    clientsPos[id].health = upgradeTiers.health[teamUpgrades[team].health]
    teleport(id, teamData[team].spawnpoint[0], teamData[team].spawnpoint[1])
    /**
     * Sends a join packet to all clients. Currently unrecieved
     */
    clients[currentRoom].forEach(client => {
        if (client == id) return;
        clientPackets[client].push({
            type: "playerjoin",
            player: id,
            ally: teamMap[client] == team
        })
    })
    /**
     * Function that can change the room, currently unused
     * @param {import("crypto").UUID} newRoom 
     */
    function moveRoom(newRoom) {
        if (!clients[newRoom]) clients[newRoom] = new Set()
        clients[currentRoom].delete(id)
        currentRoom = newRoom
        clients[currentRoom].add(id)
    }
    /**
     * Packet listener, more like a game tick listener
     */
    packetListeners[id] = function () {
        /**
         * Players visible in the room
         */
        let visiblePlayers = [...clients[currentRoom].keys()].filter(
            a => {
                return !clientsPos[a].hidden
            }
        )
        /**
         * Reduces respawn time
         */
        if (clientsPos[id].respawnTime != -1) {
            clientsPos[id].respawnTime -= 1
        }
        /**
         * If the client is no longer dead, send a respawn packet
         */
        if (clientsPos[id].respawnTime == 0) {
            clientPackets[id].respawnTime = -1
            clientPackets[id].push({
                type: "respawn",
                max_health: upgradeTiers.health[teamUpgrades[team].health]
            })
            clientsPos[id].health = upgradeTiers.health[teamUpgrades[team].health]
            teleport(id, teamData[team].spawnpoint[0], teamData[team].spawnpoint[1])
            clientsPos[id].hidden = false
        }
        /**
         * Increases the last time a packet was received, for disconnect timeout reasons
         */
        lastPacketTime += 1
        /**
         * Sends a packet to the client
         */
        
        conn.write(JSON.stringify({
            type: "positions",
            this_id: id,
            teamPlayers: [...Object.keys(teamMap)].map(t => { return { id: t, ally: teamMap[t] == team } }).reduce((p, c) => {
                p[c.id] = c.ally
                return p
            }, {}),
            playerlist: [...clients[currentRoom].keys()],
            upgrades: teamUpgradesToTiers(teamUpgrades[team]),
            respawn_time: clientsPos[id].respawnTime,
            locations: visiblePlayers.map(id => clientsPos[id]),
            projectiles: rooms[currentRoom].projectiles,
            misc_packets: clientPackets[id],
        }))
        //console.log(clientPackets[id])
        /**
         * Clear packet queue
         */
        clientPackets[id] = []
        /**
         * If the client hasnt sent a packet withing 60 game ticks, disconnect them
         */
        if (lastPacketTime >= 60) {
            disconnect()
        }
    }
    /**
     * Handle the packet sent
     * @param {{packets:[{type:string}]}} newpos 
     */
    function handlePacket(newpos) {
        for (let packet of newpos.packets) {
            if (packet.type == "pos") {
                /**
                 * Position update packet
                 * {
                 *  type: "pos",
                 *  x: number,
                 *  y: number,
                 *  dir: number
                 * }
                 */
                let distanceTraveledSquared = (packet.x - clientsPos[id].x) ** 2 + (packet.y - clientsPos[id].y) ** 2
                if (distanceTraveledSquared >= 25 ** 2 && do_lag_back) {
                    clientPackets[id].push({
                        type: "teleport",
                        x: clientsPos[id].x,
                        y: clientsPos[id].y,
                        dir: clientsPos[id].dir
                    })
                    continue;
                }
                if (checkWalls({
                    ...tankRect,
                    x: packet.x,
                    y: packet.y,
                    angle: packet.dir || 0
                }) && do_lag_back) {
                    clientPackets[id].push({
                        type: "teleport",
                        x: clientsPos[id].x,
                        y: clientsPos[id].y,
                        dir: clientsPos[id].dir
                    })
                } else {
                    clientsPos[id].x = packet.x
                    clientsPos[id].y = packet.y
                    clientsPos[id].dir = packet.dir || 0
                }
            } else if (packet.type == "keepalive") {
                /**
                 * Keepalive packet
                 * {
                 *  type: "keepalive"
                 * }
                 */
            } else if (packet.type == "animation") {
                /**
                 * Animation packet
                 * {
                 *  type: "animation",
                 *  player: UUID,
                 *  data: AnimationData
                 * }
                 */
                clients[currentRoom].forEach(client => {
                    if (client == id) return;
                    clientPackets[client].push({
                        type: "animation",
                        player: id,
                        data: packet.data
                    })
                })
            } else if (packet.type == "fire_bullet") {
                /**
                 * Fire bullet packet, overload is handled by server
                 * {
                 *  type: "fire_bullet",
                 * }
                 */
                if (bulletPacketLimiter) continue;
                if (clientsPos[id].respawnTime >= 0) continue;
                sendBulletPack = true;
                bulletPacketLimiter = true;
                clientPackets[id].push({
                    type: "screenshake",
                    time: 5,
                    magnitude: 2,
                    fade: .2
                })
                fireBullet(
                    clientsPos[id].x - (Math.sin(toRadians(clientsPos[id].dir)) * 50),
                    clientsPos[id].y - (Math.cos(toRadians(clientsPos[id].dir)) * 50),
                    clientsPos[id].dir,
                    id,
                    upgradeTiers.damage[teamUpgrades[team].damage])
            } else if (packet.type == "upgrade_thing") {
                switch (packet.upgradeType) {
                    // TODO: 
                    default:
                }
            }
            else {
                /**
                 * If the packet is not currently in the list, log so the structure can be replicated
                 */
                console.log(packet)
            }
        }
    }
    /**
     * Prevents the use of the "fire_bullet" packet every tick
     */
    var bulletPacketLimiter = false;
    /**
     * Listeners
     */
    conn.on('data', onConnData);
    conn.once('close', onConnClose);
    conn.on('error', onConnError);
    var lastPacketTime = 0;

    function onConnData(d) {
        lastPacketTime = 0;
        var sendBulletPack = false;
        /**
         * Check how many packets gamemaker has sent
         */
        let packets = Buffer.from(d).toString("hex").split(gamemakerMagic).length - 1;
        if (packets >= 2) {
            let packets_raw = Buffer.from(d).toString("hex").split(gamemakerMagic).map(v => {
                return Buffer.from(v, "hex").toString("utf8")
            }).filter(v => { return !!v })
            for (let packet of packets_raw) {
                try {
                    var newpos = JSON.parse(/{.+}/g.exec(packet)[0].replaceAll(/[^\u0000-\u007F]+/g, ""))

                    handlePacket(newpos)
                } catch {
                    console.log(packet)
                }
            }
        } else {
            try {
                var newpos = JSON.parse(/{.+}/g.exec(Buffer.from(d).toString())[0].replaceAll(/[^\u0000-\u007F]+/g, ""))
                handlePacket(newpos)
            } catch {
                /**
                 * Writes the buffer as a hex file to a file
                 */
                fs.writeFileSync("./error.hex", Buffer.from(d).toString("hex"));
            }
        }
        bulletPacketLimiter = sendBulletPack && bulletPacketLimiter
    }
    let disconnected = false

    /**
     * Disconnect the current client
     */
    function disconnect() {
        disconnected = true;
        conn.end()
        console.log('[DEBUG] - %s', id);
        delete clientsPos[id]
        clients[currentRoom].delete(id)
        delete clientPackets[id]
        delete packetListeners[id]
        delete teamMap[id]
        teamSizes[team] -= 1;
        clients[currentRoom].forEach(client => {
            clientPackets[client].push({
                type: "playerleave",
                player: id,
            })
        })
    }
    function onConnClose() {
        if (!disconnected) disconnect()
    }
    function onConnError(err) {
    }
    /**
     * Immediately send the player's ID to the socket,
     * no longer needed, yet still here
     */
    conn.write(JSON.stringify({
        type: "id",
        this_id: id
    }))
});

/**
 * Get the IP address
 */
//const IP = require("./iptest.hidden.js").ip

/**
 * Start the server
 */
server.listen(9000, function () {
    console.log('server listening to %s:%j', /*IP,*/ server.address().port);
});
