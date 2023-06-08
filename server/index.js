/**
 * Import the networking library API
 */
import { createServer } from "net"
import { writeFileSync, readFileSync } from "fs"

process.on("uncaughtException", console.log)
const BANS = new Set(JSON.parse(readFileSync("./bans.json","utf8")))
process.on("beforeExit",(c)=>{
    writeFileSync('bans.json', JSON.stringify([...BANS.values()]), 'utf8')
})

/**
 * Whether to reset player location if the client goes too fast
 */
const do_lag_back = false

const debug = false

const should_stop_server = process.argv.includes("noreset")

const core_max_health = 1000 / 2
const shield_generator_max_health = 500 / 2

/**
 * Whether to allow friendly fire
 */
const do_friendly_fire = true;

import config from "./config.json" assert { type: "json" };

import compressPacket from "./networkcompressor.js"


import { logCode } from "./gamecodelogger.js"

// Replay funcionality, not yet implemented, unlikely to be ever implemented
let REPLAY = {
    recordFrame: (uuid) => { },
    saveToFile: () => { }
};
let gameTicks = 0
let splashData = {
    ip: "unknown",
    gameVersion: "0efe304", // last commit ID
    connectionIp: "unknown",
    nsPerTick: 0,
    nsLastTick: 0,
    maxTick: 0,
}
/** 
 * The separator between two gamemaker packets
 * Raw packets could be used, but gamemaker will concatenate them anyway, so this is easier
 * */
const gamemakerMagic = "dec0adde0c"
/**
 * Import the randomUUID function from `crypto`, which creates a cryptographically secure UUID
 */
import { randomUUID as _uuid } from "crypto"
function uuid() {
    return _uuid().slice(0, 6)
}
/**
 * Converts a degree angle to radians
 * @param {number} degrees 
 * @returns {number}
 */
const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;

import { teamSelector, teamUpgradesToTiers, teamSizes, upgradeTiers, UpgradeTypes, Upgrades, teamAlive } from "./teams.js"
import { randomGem, GemType, gem_uuids } from "./gems.js"

import iptest from "./iptest.js"
/**
 * Imports the collision helper functions
 */
import { checkWallCollisions as checkWalls, bulletRect, tankRect, gemRect } from "./arenaCollisions.js"
import { checkPlayer, checkCores } from "./playerCollisions.js"

var server = createServer();
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
            y: 500 + (1830 - 1000) * 0.5,
            alive: true
        },
        leftShieldHealth: shield_generator_max_health,
        leftShield: {
            id: "A:lshield",
            x: 400,
            y: 500 + (1830 - 1000) * 1,
            alive: true
        },
        rightShieldHealth: shield_generator_max_health,
        rightShield: {
            id: "A:rshield",
            x: 400,
            y: 500 + (1830 - 1000) * 0,
            alive: true
        },
        spawnpoint: [120, 120],
        getSpawnpoint: () => {
            return [
                800,
                500 + (1830 - 1000) * Math.random()
            ]
        },
        gems: {
            [GemType.BLUE.getName()]: 0,
            [GemType.RED.getName()]: 0,
            [GemType.PURPLE.getName()]: 0,
            [GemType.GREEN.getName()]: 0,
        },
        availableUpgrades: {
            [UpgradeTypes.BulletDamage]: false,
            [UpgradeTypes.BulletReload]: false,
            [UpgradeTypes.BulletSpeed]: false,
            [UpgradeTypes.HealthRegen]: false,
            [UpgradeTypes.MaxHealth]: false,
            [UpgradeTypes.MoveSpeed]: false
        }
    },
    "B": {
        coreHealth: core_max_health,
        core: {
            id: "B:core",
            x: 3733 - 450,
            y: 500 + (1830 - 1000) * 0.5,
            alive: true
        },
        leftShieldHealth: shield_generator_max_health,
        leftShield: {
            id: "B:lshield",
            x: 3733 - 400,
            y: 500 + (1830 - 1000) * 1,
            alive: true
        },
        rightShieldHealth: shield_generator_max_health,
        rightShield: {
            id: "B:rshield",
            x: 3733 - 400,
            y: 500 + (1830 - 1000) * 0,
            alive: true
        },
        spawnpoint: [420, 120],
        getSpawnpoint: () => {
            return [
                3733 - 800,
                500 + (1830 - 1000) * Math.random()
            ]
        },
        gems: {
            [GemType.BLUE.getName()]: 0,
            [GemType.RED.getName()]: 0,
            [GemType.PURPLE.getName()]: 0,
            [GemType.GREEN.getName()]: 0,
        },
        availableUpgrades: {
            [UpgradeTypes.BulletDamage]: false,
            [UpgradeTypes.BulletReload]: false,
            [UpgradeTypes.BulletSpeed]: false,
            [UpgradeTypes.HealthRegen]: false,
            [UpgradeTypes.MaxHealth]: false,
            [UpgradeTypes.MoveSpeed]: false
        }
    }
}

Upgrades.updateAvailability("A", teamData.A.availableUpgrades, teamData.A.gems)
Upgrades.updateAvailability("B", teamData.B.availableUpgrades, teamData.B.gems)

function damageCore(coreId = "", damage, damager) {
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
    teamData[team][part + "Health"] -= damage
    if (teamData[team][part + "Health"] < 0) {
        teamData[team][part].alive = false
        broadcast({
            type: "core_shield_destroy",
            id: coreId
        })
    }
    (clientsPos[damager] || { stats: { damageTaken: 0 } }).stats.damageDealt += 1
}

function getCores() {
    let shields = {
        [teamData["B"].rightShield.id]: { ...(teamData["B"].rightShield), health: teamData["B"].rightShieldHealth },
        [teamData["B"].leftShield.id]: { ...(teamData["B"].leftShield), health: teamData["B"].leftShieldHealth },
        [teamData["A"].rightShield.id]: { ...(teamData["A"].rightShield), health: teamData["A"].rightShieldHealth },
        [teamData["A"].leftShield.id]: { ...(teamData["A"].leftShield), health: teamData["A"].leftShieldHealth },
    }
    let cores = {
        [teamData["A"].core.id]: { ...(teamData["A"].core), health: teamData["A"].coreHealth },
        [teamData["B"].core.id]: { ...(teamData["B"].core), health: teamData["B"].coreHealth }
    }
    return { shields, cores }
}

/**
 * Countdown to server reset
 */
let reset = -1

let spawnedGems = 0

let started = false
/**
 * Every game tick this function runs
 */
setInterval(async function SERVER_GAME_TICK() {
    var hrTime = process.hrtime()
    let tickTimeStart = hrTime[0] * 1000000 + hrTime[1] / 1000

    // Server shutdown sequence, occurs if the game ends, it is far better to reset the server than reset every variable, also prevents memory leaks
    reset = Math.max(reset - 1, -1)
    if (reset == 0 && should_stop_server) {
        REPLAY.saveToFile()
        process.exit()
    }
    /**
     * Runs every packet listener, this acts more as a game tick listener
     */
    Object.keys(packetListeners).map(player => {
        packetListeners[player]()
    })
    if (started && spawnedGems < 40 && Math.random() > 0.99) {
        spawnedGems++;
        var gem = randomGem(3733, 2330)
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
            if (!started) return;
            var projectile = rooms[room].projectiles[id]
            var dir = projectile.dir
            var vel = projectile.vel
            var damage = projectile.damage

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
                    damagePlayer(p, room, damage, projectile.shooter)
                })
                return;
            }
            let cores = getCores()
            let coreHits = checkCores(
                Object.values(cores.cores),
                Object.values(cores.shields),
                projectile.x - (Math.sin(toRadians(dir)) * vel),
                projectile.y - (Math.cos(toRadians(dir)) * vel),
                dir,
                teamMap[projectile.shooter],
                teamData
            );
            if (coreHits.hits.length != 0) {
                deletables.push(id)
                let coreHitsL = coreHits.hits.filter(a => { return a != 0 })
                coreHitsL.map(p => {
                    damageCore(p, damage, projectile.shooter)
                })
            }
            projectile.dir = coreHits.dirUpdate

            /**
             * Move in the direction `dir`, with a velocity of `vel`
             */
            projectile.x = projectile.x - (Math.sin(toRadians(dir)) * vel)
            projectile.y = projectile.y - (Math.cos(toRadians(dir)) * vel)
            projectile.dist_left -= 1
            /**
             * If the projectile hits a wall, delete it
             */
            if (checkWalls({
                ...bulletRect,
                x: projectile.x,
                y: projectile.y,
                angle: projectile.dir || 0
            }, "bullet")) {
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
    hrTime = process.hrtime()
    let tickTimeEnd = hrTime[0] * 1000000 + hrTime[1] / 1000
    let tickTime = tickTimeEnd - tickTimeStart
    splashData.nsPerTick = (splashData.nsPerTick * gameTicks + tickTime) / (gameTicks + 1)
    splashData.nsLastTick = tickTime
    splashData.maxTick = Math.max(splashData.maxTick, tickTime)
    gameTicks += 1
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

/**
 * An object containing packets that get sent to specific clients.
 * 
 * For example, client 12345678-90ab-4def-1234-567890abcdef would have a packet sent by 
 * adding a packet to `clientPackets["12345678-90ab-4def-1234-567890abcdef"]`
 * 
 * @type {Map<import("crypto").UUID,Array<Packet>>}
 */
let clientPackets = {}

/**
 * Apply damage to a player
 * @param {import("crypto").UUID} id 
 * @param {import("crypto").UUID|null} room 
 * @param {number} damage 
 * @param {import("crypto").UUID|null}
 */
function damagePlayer(id, room, damage, damager) {
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
    }, {
        type: "damage"
    });
    (clientsPos[damager] || { stats: { damageDealt: 0 } }).stats.damageDealt += 1
    clientsPos[id].stats.damageTaken += 1
    if (clientsPos[id].health <= 0) {
        (clientsPos[damager] || { stats: { kills: 0 } }).stats.kills += 1
        clientsPos[id].stats.deaths += 1
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

            teamAlive[teamMap[id]] -= 1
            let killedTeam = teamMap[id]
            if (teamAlive[teamMap[id]] == 0) {
                if (should_stop_server) console.log(`[DEBUG]\n[DEBUG] TEAM ${killedTeam == "A" ? "B" : "A"} HAS WON, RESTARTING SERVER\n[DEBUG]`)
                reset = 5 * 60
                started = false
                for (let key in clientPackets) {
                    let team = teamMap[key]
                    if (team == killedTeam) {
                        clientPackets[key].push({
                            type: "gamestate",
                            title: "loss",
                            stats: clientsPos[key].stats
                        })

                    } else {
                        clientPackets[key].push({
                            type: "gamestate",
                            title: "win",
                            stats: clientsPos[key].stats
                        })
                    }
                }
            } else {
                clientPackets[id].push({
                    type: "title",
                    title: "YOU HAVE BEEN ELIMINATED",
                    time: -1
                })
            }
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
function fireBullet(x = 0, y = 0, dir = 0, shooter = uuid(), damage = 1, vel = 10, room = "lobby") {
    rooms[room].projectiles[uuid()] = {
        x: x,
        y,
        dir,
        vel,
        dist_left: 100,
        damage,
        shooter: shooter,
    }
    clientsPos[shooter].stats.bulletsFired += 1
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

function collectGem(team, gemType, quantity) {
    /// console.log(quantity)
    teamData[team].gems[gemType] += quantity;
    // console.log(teamData[team].gems)
    Upgrades.updateAvailability(team, teamData[team].availableUpgrades, teamData[team].gems)
}
let disconnectMap = new Map()
let nameSet = new Set();
function nameDiscriminator() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, "0")
}
/**
 * Main connection handler
 */
function connectionHandler (conn) {
    /**
     * Client's IP Address
     */
    var remoteAddress = conn.remoteAddress.replace("::ffff:","");
    if (BANS.has(remoteAddress)) {
        conn.end()
        console.log(`[WARN]  Player with IP ${remoteAddress} attempted to join, yet they are banned!`)
        return;
    }
    /**
     * Assigns the player a unique id, UUIDv4 has a collision chance of like, close to zero
     */
    const id = uuid()
    /**
     * Selects a team
     */
    const team = teamSelector()
    teamSizes[team] += 1
    teamAlive[team] += 1
    teamMap[id] = team;
    // log that IP and ID
    console.log('[DEBUG] + %s (%s)', id, remoteAddress);
    let currentRoom = "lobby"
    /**
     * Init all required variables
     */
    clients[currentRoom].add(id)
    clientPackets[id] = []
    clientPackets[id].push({
        type: "health_update",
        health: Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth),
        max_health: Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)
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
        })
    for (let gem of gem_uuids.values()) {
        clientPackets[id].push({
            type: "gem_spawn",
            x: gem.x,
            y: gem.y,
            gem_type: gem.type,
            uuid: gem.uuid
        })
    }
    clientsPos[id] = {
        ip: remoteAddress,
        id: id,
        x: 120,
        y: 120,
        dir: 0,
        health: 100,
        max_health: 100,
        hidden: false,
        respawnTime: -1,
        name: "",
        stats: {
            kills: 0,
            damageDealt: 0,
            bulletsFired: 0,
            deaths: 0,
            damageTaken: 0,
            gemsCollected: 0
        }
    }
    clientsPos[id].max_health = Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)
    clientsPos[id].health = Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)
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
    let bulletPacketLimiter = 0
    /**
     * Packet listener, more like a game tick listener
     */
    packetListeners[id] = function () {
        let regen = Upgrades.getUpgradeForTeam(team, UpgradeTypes.HealthRegen);
        if (clientsPos[id].health > 0) clientsPos[id].health = Math.min(clientsPos[id].health + regen / 60, Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth))
        if (!clientsPos[id].max_health == Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)) {
            clientPackets[id].push({
                type: "health_update",
                health: Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth) * (clientsPos[id].health / clientsPos[id].max_health),
                max_health: Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)
            })
            clientsPos[id].health = Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth) * (clientsPos[id].health / clientsPos[id].max_health)
            clientsPos[id].max_health = Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth)
        }
        bulletPacketLimiter = Math.max(0, bulletPacketLimiter - 1)
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
            clientsPos[id].respawnTime = -1
            clientPackets[id].push({
                type: "respawn",
                max_health: Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth),
            })
            clientsPos[id].health = Upgrades.getUpgradeForTeam(team, UpgradeTypes.MaxHealth),
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
        let otherTeam = teamData[(team == "A") ? "B" : "A"]
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
            gems: teamData[team].gems,
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
            splashData: { ...splashData, connectionIp: remoteAddress },
            beginned: started,
            availableUpgrades: teamData[team].availableUpgrades,
            teamSizes: [...Object.keys(teamAlive)].map(t => { return { count: t == team, team: teamAlive[t] } }).reduce((p, c) => {
                p[c.count ? "own" : "oth"] = c.team
                return p
            }, {}),
        }
        packets = compressPacket(packets)
        REPLAY.recordFrame(id, packets)
        conn.write(JSON.stringify(packets))
        /**
         * Clear packet queue
         */
        clientPackets[id] = []
        /**
         * If the client hasnt sent a packet withing 60 game ticks, disconnect them
         */
        if (lastPacketTime >= 1200) {
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
                // Prevent teleportation
                if (!started || distanceTraveledSquared >= 25 ** 2) {
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
                }, "player") && do_lag_back) {
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
                if (bulletPacketLimiter != 0) continue;
                if (clientsPos[id].respawnTime != -1) continue;
                bulletPacketLimiter = Upgrades.getUpgradeForTeam(team, UpgradeTypes.BulletReload);
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
                    Upgrades.getUpgradeForTeam(team, UpgradeTypes.BulletDamage),
                    Upgrades.getUpgradeForTeam(team, UpgradeTypes.BulletSpeed))
            } else if (packet.type == "upgrade_ability") {
                switch (packet.upgrade_type) {
                    case "bullet_damage": {
                        Upgrades.doUpgrade(team, UpgradeTypes.BulletDamage, teamData[team].gems)
                        break
                    }
                    case "health_regen": {
                        Upgrades.doUpgrade(team, UpgradeTypes.HealthRegen, teamData[team].gems)
                        break
                    }
                    case "max_health": {
                        Upgrades.doUpgrade(team, UpgradeTypes.MaxHealth, teamData[team].gems)
                        break
                    }
                    case "bullet_reload": {
                        Upgrades.doUpgrade(team, UpgradeTypes.BulletReload, teamData[team].gems)
                        break
                    }
                    case "bullet_speed": {
                        Upgrades.doUpgrade(team, UpgradeTypes.BulletSpeed, teamData[team].gems)
                        break
                    }
                    case "move_speed": {
                        Upgrades.doUpgrade(team, UpgradeTypes.MoveSpeed, teamData[team].gems)
                        break
                    }
                    default:
                }
                Upgrades.updateAvailability(team, teamData[team].availableUpgrades, teamData[team].gems)
            } else if (packet.type == "collect_gem") {
                if (clientsPos[id].respawnTime != -1) continue;
                var legal = !!gem_uuids.has(packet.uuid)
                if (!legal) continue;
                clientsPos[id].stats.gemsCollected += 1
                spawnedGems--;
                gem_uuids.delete(packet.uuid)
                var gem_type = GemType.fromId(packet.gem_type)
                teamData[team].gems[gem_type.getName()]++;
                Upgrades.updateAvailability(team, teamData[team].availableUpgrades, teamData[team].gems)
                broadcast({
                    type: "collect_gem",
                    uuid: packet.uuid
                })
            }
            else if (packet.type == "begin") {
                if (Object.values(teamSizes).reduce((p, v) => p + v, 0) < 2) {
                    clientPackets[id].push({
                        type: "title",
                        time: 1,
                        title: "Insufficient Players"
                    })
                    //continue
                }
                if (reset != -1) continue;
                started = !started;
            }
            else if (packet.type == "setname") {
                if (nameSet.has(packet.name)) {
                    let tempName = packet.name.substring(0, 12) + "_" + nameDiscriminator()
                    clientsPos[id].name = tempName
                    nameSet.add(tempName)
                } else {
                    nameSet.add(packet.name)
                    clientsPos[id].name = packet.name
                }
            }
            else if (packet.type == "cheat") {
                if (!debug) continue;
                if (packet.cheat == "gem") {
                    teamData[team].gems[GemType.BLUE] = 1000;
                    teamData[team].gems[GemType.RED] = 1000;
                    teamData[team].gems[GemType.GREEN] = 1000;
                    teamData[team].gems[GemType.PURPLE] = 1000;
                    Upgrades.updateAvailability(team, teamData[team].availableUpgrades, teamData[team].gems)
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
     * Listeners
     */
    conn.on('data', onConnData);
    conn.once('close', onConnClose);
    conn.on('error', onConnError);
    var lastPacketTime = 0;

    function onConnData(d) {
        lastPacketTime = 0;
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
                } catch (e) {
                    /**
                     * Writes the buffer as a hex file to a file for debugging purposes
                     */
                    writeFileSync("./error.hex", Buffer.from(d).toString("hex") + "\n" + e + "\n" + e.stack);
                    console.log(`An error has occured. Check 'error.hex' for more information`)
                }
            }
        } else {
            try {
                var newpos = JSON.parse(/{.+}/g.exec(Buffer.from(d).toString())[0].replaceAll(/[^\u0000-\u007F]+/g, ""))
                handlePacket(newpos)
            } catch (e) {
                /**
                 * Writes the buffer as a hex file to a file for debugging purposes
                 */
                writeFileSync("./error.hex", Buffer.from(d).toString("hex") + "\n" + e + "\n" + e.stack);
            }
        }
        // bulletPacketLimiter = sendBulletPack && bulletPacketLimiter
    }
    let disconnected = false
    /**
     * Disconnect the current client
     */
    function disconnect() {
        disconnected = true;
        conn.end()
        console.log('[DEBUG] - %s (Stats: %s)', id, JSON.stringify(clientsPos[id].stats).replaceAll("\"", ""));
        if (clientsPos[id].respawnTime >= -1) teamAlive[team] -= 1
        nameSet.delete(clientsPos[id].name)
        delete clientsPos[id]
        delete clientPackets[id]
        if (teamAlive[team] == 0 && started) {
            if (should_stop_server) console.log(`[DEBUG]\n[DEBUG] TEAM ${team == "A" ? "B" : "A"} HAS WON, RESTARTING SERVER\n[DEBUG]`)
            reset = 5 * 60
            started = false
            for (let key in clientPackets) {
                let team2 = teamMap[key]
                if (team2 == team) {
                    clientPackets[key].push({
                        type: "gamestate",
                        title: "loss",
                        stats: clientsPos[key].stats
                    })
                } else {
                    clientPackets[key].push({
                        type: "gamestate",
                        title: "win",
                        stats: clientsPos[key].stats
                    })
                }
            }
        }
        clients[currentRoom].delete(id)
        delete packetListeners[id]
        delete teamMap[id]
        teamSizes[team] -= 1;

        clients[currentRoom].forEach(client => {
            clientPackets[client].push({
                type: "playerleave",
                player: id,
            })
        })
        disconnectMap.delete(id)
    }
    disconnectMap.set(id,disconnect)
    function onConnClose() {
        if (!disconnected) disconnect()
    }
    function onConnError(err) {
    }
}
server.on('connection', connectionHandler);

/**
 * Get the IP address
 */
let IP = "localhost";
let CODE = ""
try {
    if (!config.server_ip || !config.forced_host) {
        IP = iptest.ip
        CODE = iptest.code
        if (iptest.oneninetwos.length > 1) console.log(`[WARN]  Multiple 192.168.x.x local IPs found!: ${iptest.oneninetwos.join(", ")}`)
        if (iptest.oneninetwos.length == 0 && iptest.ips.length != 0) console.log(`[WARN]  No 192.168.x.x local IPs found!\n[WARN]  Other possible local IPs: ${iptest.ips.join(", ")}, with codes [${iptest.codes.join(", ")}]`)
        if (iptest.oneninetwos.length == 0 && iptest.ips.length == 0) console.log(`[WARN]  No Network Interfaces found! Do you have Airplane mode enabled?`)
        splashData.ip = CODE;
    } else {
        CODE = iptest.getCode(config.server_ip)
        splashData.ip = CODE;
    }
} catch {
    console.warn("[WARN]  Unable to get local IP, Multiplayer may not work!")
}
/**
 * Start the server
 */
server.listen(9000, function () {
    console.log('[INFO]  Server listening to %s:%j', IP, server.address().port);
    logCode(CODE)
});
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    function commandHandler(command) {
        let commandType = command.split(" ")[0].toUpperCase()
        let args = command.split(" ")
        if (["LIST", "LS"].includes(commandType)) {
            return `${Object.keys(clientsPos).length} Player${Object.keys(clientsPos).length == 1 ? "" : "s"} online: [ ${Object.keys(clientsPos).map(v => {
                return `${clientsPos[v].name} (${v})`
            }).join(", ")} ]`
        }
        if (["DAMAGE", "DMG"].includes(commandType)) {
            if (args.length != 3) {
                return `Usage: DAMAGE (PlayerID) (Damage)`
            }
            if (Object.keys(clientsPos).includes(args[1])) {
                if (/^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$/.test(args[2])) {
                    damagePlayer(args[1], null, parseFloat(args[2]))
                    return `Dealt (${args[2]}) damage to (${args[1]})`
                } else {
                    return `Invalid Number (${args[2]})!`
                }
            } else {
                return `No such player (${args[1]})!`
            }
        }
        if (["GIVE"].includes(commandType)) {
            if (args.length != 3 && args.length != 4) {
                return `Usage: GIVE (TeamId) (GemType) [Quantity]`
            }
            if (!["A", "a", "B", "b"].includes(args[1])) {
                return `Invalid Team (${args[1]})! Must be "A" or "B"`
            }
            if (!["RED", "BLUE", "GREEN", "PURPLE"].includes(args[2].toUpperCase())) {
                return `Invalid Gem Type (${args[2]})!`
            }
            if (args.length == 3) {
                collectGem(args[1].toUpperCase(), args[2].toUpperCase(), 1)
                return `Gave Team ${args[1].toUpperCase()} 1 ${args[2].toUpperCase()} Gem`
            }
            if (/^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$/.test(args[3])) {
                collectGem(args[1].toUpperCase(), args[2].toUpperCase(), parseInt(args[3]))
                // console.log()
                return `Gave Team ${args[1].toUpperCase()} ${args[3]} ${args[2].toUpperCase()} Gems`
            } else {
                return `Invalid Quantity (${args[3]})!`
            }
        }
        if (["EXIT"].includes(commandType)) {
            process.exit()
            return `Stopping server!`
        }
        if (["KILL"].includes(commandType)) {
            if (args.length != 2) {
                return `Usage: KILL (PlayerId)`
            }
            if (Object.keys(clientsPos).includes(args[1])) {
                damagePlayer(args[1], null, clientsPos[args[1]].health)
                return `Killed ${args[1]}`
            } else {
                return `No such player (${args[1]})!`
            }
        }
        if (["HIDE"].includes(commandType)) {
            if (args.length != 2) {
                return `Usage: HIDE (PlayerId)`
            }
            if (Object.keys(clientsPos).includes(args[1].toLowerCase())) {
                clientsPos[args[1].toLowerCase()].hidden = !clientsPos[args[1].toLowerCase()].hidden
                return `Player ${args[1]}'s visibility has been toggled`
            } else {
                return `No such player (${args[1]})!`
            }
        }
        if (["TP", "TELEPORT"].includes(commandType)) {
            if (args.length != 4) {
                return `Usage: TELEPORT (PlayerId) (x) (y)`
            }
            if (Object.keys(clientsPos).includes(args[1].toLowerCase())) {
                if (/^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$/.test(args[2]) && /^(-?)(0|([1-9][0-9]*))(\\.[0-9]+)?$/.test(args[3])) {
                    teleport(args[1].toLowerCase(), parseInt(args[2]), parseInt(args[3]), clientsPos[args[1].toLowerCase()].dir)
                    return `Teleported ${args[1].toUpperCase()}  to (${args[2]}, ${args[3]})`
                } else {
                    return `Invalid X or Y coordinate (${args[2]}, ${args[3]})!`
                }
            } else {
                return `No such player (${args[1]})!`
            }
        }
        if (["START", "BEGIN", "PAUSE", "STOP"].includes(commandType)) {
            if (["PAUSE", "STOP"].includes(commandType)) {
                if (started == false) {
                    return `Nothing changed! The game was already stopped!`
                }
                started = false
                return `Stopped the game!`
            } else {
                if (started == true) {
                    return `Nothing changed! The game was already started!`
                }
                started = true
                return `Started the game!`
            }
        }
        if (["BANS"].includes(commandType)) {
            return `Current Bans: [${[...BANS.values()].join(", ")}]`
        }
        if (["PARDON"].includes(commandType)) {
            if (args.length != 2) return `Usage: PARDON (ip)`
            if (BANS.delete(args[1])) {
                writeFileSync('bans.json', JSON.stringify([...BANS.values()]), 'utf8')
                return `Ip ${args[1]} has been pardoned!`
            }
            return `Ip ${args[1]} was never banned!`
        }
        if (["IPBAN"].includes(commandType)) {
            if (args.length != 2) return `Usage: IPBAN (IP)`
            BANS.add(args[1])
            writeFileSync('bans.json', [...BANS.values()], 'utf8')
            return `Ip ${args[1]} has been banned!`
        }
        if (["BAN"].includes(commandType)) {
            if (args.length != 2) return `Usage: BAN (PlayerId)`
            if (Object.keys(clientsPos).includes(args[1].toLowerCase())) {
                BANS.add(clientsPos[args[1]].ip)
                writeFileSync('bans.json', JSON.stringify([...BANS.values()]), 'utf8')
                disconnectMap.get(args[1].toLowerCase())()
                return `Player ${args[1]} has been banned!`
            } else {
                return `No such player (${args[1]})!`
            }   
        }
        if (["KICK"].includes(commandType)) {
            if (args.length != 2) return `Usage: KICK (PlayerId)`
            if (Object.keys(clientsPos).includes(args[1].toLowerCase())) {
                disconnectMap.get(args[1].toLowerCase())()
                return `Player ${args[1]} has been kicked!`
            } else {
                return `No such player (${args[1]})!`
            }   
        }
        if (["HELLO"].includes(commandType)) {
            return `WORLD`
        }
        if (["?", "HELP"].includes(commandType)) {
            return `Available Commands: 
KILL (PlayerId): Kills a player
GIVE (TeamId) (GemType) [quantity]: Gives a team gems
DAMAGE (PlayerId) (Amount): Damages a player
LIST: Lists all online players
HIDE (PlayerId): Toggles the visibility of a player
TELEPORT (PlayerId) (x) (y): Teleports a player
START: Start the game
PAUSE: Stop the game
BAN (PlayerId): Ban a player
IPBAN (IP): Ban an IP address
PARDON (IP): Pardon an IP address
KICK (PlayerId): Kick a player
EXIT: Stop the server`
        }
        return `Unrecognised Command: ${commandType}`
    }
    function doTabComplete(command, choice) {
        let splitted = command.split(" ")
        switch (splitted[0].toUpperCase()) {
            case "KILL": 
            case "KICK":
            case "BAN":
            {
                switch (splitted.length) {
                    case 1: return command
                    case 2: return tabComplete(command, "player", choice)
                    default: return command
                }
            }
            case "GIVE": {
                switch (splitted.length) {
                    case 2: return tabComplete(command, "team", choice)
                    case 3: return tabComplete(command, "gem", choice)
                    default: return command
                }
            }
            case "DAMAGE": {
                switch (splitted.length) {
                    case 1: return command
                    case 2: return tabComplete(command, "player", choice)
                    default: return command
                }
            }
            case "HIDE": {
                switch (splitted.length) {
                    case 1: return command
                    case 2: return tabComplete(command, "player", choice)
                    default: return command
                }
            }
            case "TP": {
                switch (splitted.length) {
                    case 2: return tabComplete(command, "player", choice)
                    default: return command
                }
            }
            case "PARDON": {
                switch (splitted.length) {
                    case 2: return tabComplete(command, "bans", choice)
                    default: return command
                }
            }
        }
        return tabComplete(command,"commands", choice)
    }
    function tabComplete(command = "", tabCompleteType = "player",choice) {
        let splitted = command.split(" ")
        let completed = splitted.at(-1).toUpperCase()
        let results
        if (tabCompleteType == "player") {
            results = Object.keys(clientsPos).filter(a => {
                return a.startsWith(completed.toLowerCase())
            }).sort()
        } else if (tabCompleteType == "gem") {
            results = ["BLUE", "RED", "GREEN", "PURPLE"].filter(a => {
                return a.startsWith(completed)
            }).sort()
        } else if (tabCompleteType == "team") {
            results = ["A", "B"].filter(a => {
                return a.startsWith(completed)
            }).sort()
        } else if (tabCompleteType == "bans") {
            results = [...BANS.values()].filter(a => {
                return a.startsWith(completed)
            }).sort()
        } else if (tabCompleteType == "commands") {
            results = [
                "LIST","LS","DAMAGE","DMG",
                "GIVE","EXIT","KILL","HIDE",
                "TP","TELEPORT","START","BEGIN",
                "PAUSE","PAUSE","STOP",
                "BANS","BAN","PARDON","IPBAN",
                "KICK","HELP"
            ].filter(a => {
                return a.startsWith(completed)
            }).sort()
        }
        if (results.length >= 1) splitted[splitted.length - 1] = results[choice % (results.length)]
        return splitted.join(" ")
    }
    console._log = console.log;
    let pre = "> "
    console.log = (message, ...optionalParams) => {
        process.stdout.clearLine(0)
        process.stdout.moveCursor(-100, 0)
        console._log(message, ...optionalParams)
        process.stdout.write(pre + command)
    }
    let command = ""
    let lastTabComplete = ["",0,false]
    let lastCommand = ""
    process.stdin.on("data", (key) => {
        if (key === '\u0003') {
            process.exit();
        }
        if (key == '\u0008') {
            process.stdout.clearLine(0)
            process.stdout.moveCursor(-100, 0)
            command = command.slice(0, -1)
            process.stdout.write(pre + command)
            lastTabComplete = ["",0,false]
            return;
        }
        if (key == '\u000D') {
            console._log("\n[COMMAND] " + commandHandler(command.replace(pre, "")))
            lastCommand = command
            lastTabComplete = ["",0,false]
            process.stdout.write(pre)
            command = ""
            return;
        }
        if (key.charCodeAt(0) == 27) {
            command = lastCommand
            lastTabComplete = ["",0,false]
            process.stdout.clearLine(0)
            process.stdout.moveCursor(-100, 0)
            process.stdout.write(pre + command)
            return
        }
        if (key == "\u0009") {
            if (!lastTabComplete[2]) {
            lastTabComplete = [command,0,true]
            command = doTabComplete(command,0)
            } else {
                lastTabComplete[1] ++;
                command = doTabComplete(lastTabComplete[0],lastTabComplete[1])
            }
            process.stdout.clearLine(0)
            process.stdout.moveCursor(-100, 0)
            process.stdout.write(pre + command)
            return;
        }
        lastTabComplete = ["",0,false]
        command += key
        process.stdout.write(key)
    })

}