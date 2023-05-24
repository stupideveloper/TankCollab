/**
 * Whether to reset player location if the client goes too fast
 */
const do_lag_back = true

const core_max_health = 1000
const shield_generator_max_health = 500

/**
 * Whether to allow friendly fire
 */
const do_friendly_fire = true;

/**
 * Import the networking library API
 */
const net = require("net")
let REPLAY = {
    recordFrame: ()=>{},
    saveToFile: ()=>{}
};
let splashData = {
    ip: "unknown",
    gameVersion: "1.0.0beta"
}
try {
REPLAY = require("./replay.hidden")
} catch {
    
}
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
const { teamSelector, teamUpgradesToTiers, teamSizes, upgradeTiers, UpgradeTypes, Upgrades } = require("./teams.js")
const { randomGem, GemType, gem_uuids} = require("./gems.js")
/**
 * Imports the collision helper functions
 */
const { checkWalls, bulletRect, tankRect, gemRect } = require("./arenaCollisions.js");
const { checkPlayer, checkCores } = require("./playerCollisions.js");

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
 * An object that stores different upgrades
 */


/**
 * Includes team-specific data
 */
let teamData = {
    "A": {
        coreHealth: core_max_health,
        core: {
            id: "A:core",
            x: 450,
            y: 500 + (1830-1000) * 0.5,
            alive: true
        },
        leftShieldHealth: shield_generator_max_health,
        leftShield: {
            id: "A:lshield",
            x: 400,
            y: 500 + (1830-1000) * 1,
            alive: true
        },
        rightShieldHealth: shield_generator_max_health,
        rightShield: {
            id: "A:rshield",
            x: 400,
            y: 500 + (1830-1000) * 0,
            alive: true
        },
        spawnpoint: [120, 120],
        getSpawnpoint: ()=>{
            return [
                800,
                500 + (1830-1000) * Math.random()
            ]
        }
    },
    "B": {
        coreHealth: core_max_health,
        core: {
            id: "B:core",
            x: 3733-450,
            y: 500 + (1830-1000) * 0.5,
            alive: true
        },
        leftShieldHealth: shield_generator_max_health,
        leftShield: {
            id: "B:lshield",
            x: 3733-400,
            y: 500 + (1830-1000) * 1,
            alive: true
        },
        rightShieldHealth: shield_generator_max_health,
        rightShield: {
            id: "B:rshield",
            x: 3733-400,
            y: 500 + (1830-1000) * 0,
            alive: true
        },
        spawnpoint: [420, 120],
        getSpawnpoint: ()=>{
            return [
                3733-800,
                500 + (1830-1000) * Math.random()
            ]
        }
    }
}

function damageCore(coreId="",damage) {
    let team;
    if (coreId.startsWith("A")) {
        team = "A"
    } else {
        team = "B"
    }
    let part;
    if (coreId.endsWith("core")) {
        if (teamData[team].rightShieldHealth > 0) return
        if (teamData[team].leftShieldHealth > 0) return
        part = "core"
    } else if (coreId.endsWith("rshield")) {
        part = "rightShield"
    } else {
        part = "leftShield"
    }
    teamData[team][part+"Health"]-=damage
    if (teamData[team][part+"Health"] < 0) {
        teamData[team][part].alive = false
        broadcast({
            type: "core_shield_destroy",
            id: coreId
        })
    }
}

function getCores() {
    let shields = {
        [teamData["B"].rightShield.id]: {...(teamData["B"].rightShield),health: teamData["B"].rightShieldHealth},
        [teamData["B"].leftShield.id]: {...(teamData["B"].leftShield),health: teamData["B"].leftShieldHealth},
        [teamData["A"].rightShield.id]: {...(teamData["A"].rightShield),health: teamData["A"].rightShieldHealth},
        [teamData["A"].leftShield.id]: {...(teamData["A"].leftShield),health: teamData["A"].leftShieldHealth},
    }
    let cores = {
        [teamData["A"].core.id]: {...(teamData["A"].core),health: teamData["A"].coreHealth},
        [teamData["B"].core.id]: {...(teamData["B"].core),health: teamData["B"].coreHealth}
    }
    return {shields,cores}
}




let started = false
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
    if (started && Math.random() > 0.995) {
        var gem = randomGem(3733,2330)
        broadcast({
            type: "gem_spawn",
            x: gem.x,
            y: gem.y,
            gem_type: gem.type,
            uuid: gem.uuid
        })

    }

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
            let cores = getCores()
            let coreHits = checkCores(
                Object.values(cores.cores),
                Object.values(cores.shields),
                projectile.x,
                projectile.y,
                dir,
                teamMap[projectile.shooter]
            );
            if (coreHits.length != 0) {
                deletables.push(id)
                coreHits=coreHits.filter(a=>{return a!=0})
                coreHits.map(p=>{
                    damageCore(p,damage)
                })
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
 * Self explanitory, broadcasts a packet
 * @param packet 
 */
function broadcast(packet) {
    for (let key in clientPackets) {
        clientPackets[key].push(packet)
    }
}
function broadcastConditional(packet,condition) {
    for (let key in clientPackets) {
        if (condition(key)) {
            clientPackets[key].push(packet)
        }
    }
}
/**
 * An object containing packets that get sent to specific clients.
 * 
 * For example, client 12345678-90ab-4def-1234-567890abcdef would have a packet sent by 
 * adding a packet to `clientPackets["12345678-90ab-4def-1234-567890abcdef"]`
 * 
 * @type {Map<import("crypto").UUID,Array<Packet>>}
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
        if (teamData[teamMap[id]]["core"].alive) {
            clientsPos[id].respawnTime = 5 * 60
        } else {
            clientsPos[id].respawnTime = -2
            clientPackets[id].push({
                type: "final_death"
            })
            clientPackets[id].push({
                type: "title",
                title: "YOU HAVE BEEN ELIMINATED",
                time: -1
            })
        }
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
            health: Upgrades.getUpgradeForTeam(team,UpgradeTypes.MaxHealth),
            max_health: Upgrades.getUpgradeForTeam(team,UpgradeTypes.MaxHealth)
        },
        {
            type: "team_set",
            team: team
        },
        {
            type: "title",
            title: "Welcome!",
            time: 10
        },
        {
            type: "gameplay_data_update",
            shield_generator_max_health,
            core_max_health
        }
    ]
    clientsPos[id] = {
        id: id,
        x: 120,
        y: 120,
        dir: 0,
        health: 100,
        hidden: false,
        respawnTime: -1,
        gems: {
            [GemType.BLUE.getName()]: 0,
            [GemType.RED.getName()]: 0,
            [GemType.PURPLE.getName()]: 0,
            [GemType.GREEN.getName()]: 0,
        }
    }
    clientsPos[id].health = Upgrades.getUpgradeForTeam(team,UpgradeTypes.MaxHealth)
    teleport(id, ...teamData[team].getSpawnpoint())
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
    let bulletPacketLimiter = 0
    /**
     * Packet listener, more like a game tick listener
     */
    packetListeners[id] = function () {
        //console.log(bulletPacketLimiter)
        bulletPacketLimiter = Math.max(0,bulletPacketLimiter-1)
        //console.log(bulletPacketLimiter)
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

        
        //console.log(gem)
        /**
         * If the client is no longer dead, send a respawn packet
         */
        if (clientsPos[id].respawnTime == 0) {
            clientsPos[id].respawnTime = -1
            clientPackets[id].push({
                type: "respawn",
                max_health: Upgrades.getUpgradeForTeam(team,UpgradeTypes.MaxHealth),
            })
            clientsPos[id].health = Upgrades.getUpgradeForTeam(team,UpgradeTypes.MaxHealth),
            teleport(id, ...teamData[team].getSpawnpoint())
            clientsPos[id].hidden = false
        }
        /**
         * Increases the last time a packet was received, for disconnect timeout reasons
         */
        lastPacketTime += 1
        /**
         * Sends a packet to the client
         */
        let otherTeam = teamData[(team=="A")?"B":"A"]
        let otherTeamInfo = {
            rightShield: otherTeam.rightShieldHealth,
            rightShieldLoc: otherTeam.rightShield,
            rightShieldAlive: otherTeam.rightShield.alive,
            leftShield: otherTeam.leftShieldHealth,
            leftShieldLoc: otherTeam.leftShield,
            leftShieldAlive: otherTeam.leftShield.alive,
            core: otherTeam.coreHealth,
            coreLoc: otherTeam.core,
            coreAlive: otherTeam.core.alive
        }
        var packets = {
            type: "positions",
            this_id: id,
            gems: clientsPos[id].gems,
            health: clientsPos[id].health,
            teamPlayers: [...Object.keys(teamMap)].map(t => { return { id: t, ally: teamMap[t] == team } }).reduce((p, c) => {
                p[c.id] = c.ally
                return p
            }, {}),
            playerlist: [...clients[currentRoom].keys()],
            upgrades: Upgrades.convertToJson(team),
            upgradeTiers: Upgrades.getTiersJson(team),
            respawn_time: clientsPos[id].respawnTime,
            locations: visiblePlayers.map(id => clientsPos[id]),
            projectiles: rooms[currentRoom].projectiles,
            misc_packets: clientPackets[id],
            team_data: teamData[team],
            other_team_info: otherTeamInfo,
            splashData
        }
        REPLAY.recordFrame(id,packets)
        conn.write(JSON.stringify(packets))
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
     * Prevents the use of the "fire_bullet" packet every tick
     */
    
    /**
     * Handle the packet sent
     * @param {{packets:[{type:string}]}} newpos 
     */
    function handlePacket(newpos) {
        //console.log(newpos)
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
                if (!started || distanceTraveledSquared >= 25 ** 2 && do_lag_back) {
                    clientPackets[id].push({
                        type: "teleport",
                        x: clientsPos[id].x,
                        y: clientsPos[id].y,
                        dir: packet.dir
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
                if (!started) continue
                /**
                 * Fire bullet packet, overload is handled by server
                 * {
                 *  type: "fire_bullet",
                 * }
                 */
                //console.log(bulletPacketLimiter)
                if (bulletPacketLimiter != 0) continue;
                if (clientsPos[id].respawnTime != -1) continue;
                sendBulletPack = true;
                bulletPacketLimiter = Upgrades.getUpgradeForTeam(team,UpgradeTypes.BulletReload);
                //console.log(bulletPacketLimiter)
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
                    Upgrades.getUpgradeForTeam(team,UpgradeTypes.BulletDamage))
            } else if (packet.type == "upgrade_ability") {
                console.log(packet)
                switch (packet.upgrade_type) {
                    case "bullet_damage": {
                        Upgrades.doUpgrade(team,UpgradeTypes.BulletDamage,clientPackets[id].gems)
                        break
                    }
                    case "health_regen": {
                        break
                    }
                    case "max_health": {
                        break
                    }
                    case "bullet_reload": {
                        Upgrades.doUpgrade(team,UpgradeTypes.BulletReload,clientPackets[id].gems)
                        break
                    }
                    case "bullet_speed": {
                        break
                    }
                    case "move_speed": {
                        break
                    }
                    default: console.log(packet)
                }
            } else if (packet.type == "collect_gem") {
                if (clientsPos[id].respawnTime != -1) continue;
                var legal = !!gem_uuids.has(packet.uuid)
                if (!legal) continue;
                gem_uuids.delete(packet.uuid)
                var gem_type = GemType.fromId(packet.gem_type)
                clientsPos[id].gems[gem_type.getName()]++;
                broadcast({
                    type: "collect_gem",
                    uuid: packet.uuid
                })
            }
             else if (packet.type == "begin") {
                //console.log(packet)
                started = !started;
            }
            else {
                /**
                 * If the packet is not currently in the list, log so the structure can be replicated
                 */
                //console.log(packet)
            }
        }
    }
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
        // bulletPacketLimiter = sendBulletPack && bulletPacketLimiter
    }
    let disconnected = false

    /**
     * Disconnect the current client
     */
    function disconnect() {
        REPLAY.saveToFile()
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
let IP = "localhost";
try {
 IP = require("./iptest.hidden.js").ip
 splashData.ip = IP;
} catch {
    console.warn("[WARN] Create a iptest.hidden.js file to get your device's local IP")
}
/**
 * Start the server
 */
server.listen(9000, function () {
    console.log('server listening to %s:%j', IP, server.address().port);
});
