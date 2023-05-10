const net = require("net")
const gamemakerMagic = "\udec0\uadde\u0c00\u0000\u4000\u0000"
const uuid = require("crypto").randomUUID
const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;
const Collision = require("./rect_collisions.js");
const { checkWalls, bulletRect, tankRect } = require("./arenaCollisions.js");
const { checkPlayer } = require("./playerCollisions.js")

var server = net.createServer();
let clientsPos = {}
let clients = {
    "lobby": new Set()
}
let packetListeners = {

}
const teams = {
    TEAM_A: "A",
    TEAM_B: "B"
}
let lastSelected = 0
let teamSizes = {A:0,B:0}
let teamSelector = ()=>{
    if (teamSizes[teams.TEAM_A] == teamSizes[teams.TEAM_B]) {
        return Math.random()>0.5?teams.TEAM_A:teams.TEAM_B;
    }
    return teamSizes[teams.TEAM_A]>teamSizes[teams.TEAM_B]?teams.TEAM_B:teams.TEAM_A;
}
let upgradeTiers = {
    damage: [10,12,14,16,18,20,22],
    bulletSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]
}
let teamUpgrades = {
    "A": {
        damage: 0,
        bulletSpeed: 0
    },
    "B": {
        damage: 0,
        bulletSpeed: 0
    }
}
const teamUpgradesDefault = JSON.stringify(teamUpgrades)
const do_lag_back = true
setInterval(async function SERVER_GAME_TICK(){
    Object.keys(packetListeners).map(player=>{
        packetListeners[player]()
    })
    Object.keys(rooms).map(room=>{
        var deletables = []
        Object.keys(rooms[room].projectiles).forEach(id=>{
            var projectile = rooms[room].projectiles[id]
            var dir = projectile.dir
            var vel = projectile.vel
            var damage = projectile.damage
            projectile.x = projectile.x - (Math.sin(toRadians(dir))*vel)
            projectile.y = projectile.y - (Math.cos(toRadians(dir))*vel)
            projectile.dist_left -= 1
            if (projectile.dist_left <= 0) {
                deletables.push(id)
            }
            let hits = checkPlayer(
                clients,
                clientsPos,
                projectile.x,
                projectile.y,
                dir,
                projectile.shooter,
                projectile.damage,
                room)
            if (hits.length != 0) {
                deletables.push(id)
                hits.map(p=>{damagePlayer(p,room,damage)})
                return;
            }
            if (checkWalls({
                ...bulletRect,
                x: projectile.x,
                y: projectile.y,
                angle: projectile.dir || 0
            })) {
                deletables.push(id)
            }
        })
        deletables.map(id=>{
            delete rooms[room].projectiles[id]
        })
    })
}, 1e3/60);
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
let clientPackets = {}
function doCollisions() {

}
function damagePlayer(id,room,damage) {
    console.log(id,room,damage)
    clientsPos[id].health -= damage;
    clientPackets[id].push({
        type: "health_update",
        health: clientsPos[id].health
    })
    if (clientsPos[id].health < 0) {
        clientPackets[id].push({
            type: "death",
        })
        clientsPos[id].hidden = true
        clientsPos[id].respawnTime = 5 * 60
    }
}
let teamMap = {}
function fireBullet(x=0,y=0,dir=0,shooter=uuid(),damage=1,room="lobby") {
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
server.on('connection', function (conn)
{
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    const id = uuid()
    const team = teamSelector()
    teamSizes[team]+=1
    teamMap[id]=team;
    console.log('[DEBUG] + %s', id);
    let currentRoom = "lobby"
    clients[currentRoom].add(id)
    clientPackets[id] = []
    clientsPos[id] = {
        id: id,
        x: 120,
        y: 120,
        dir: 0,
        health: 100,
        hidden: false,
        respawnTime: -1
    }
    clients[currentRoom].forEach(client=>{
        if (client == id) return;
        clientPackets[client].push({
            type: "playerjoin",
            player: id,
            ally: teamMap[client]==team
        })
    })
    function moveRoom(newRoom) {
        if (!clients[newRoom]) clients[newRoom] = new Set()
        clients[currentRoom].delete(id)
        currentRoom = newRoom
        clients[currentRoom].add(id)
    }
    
    packetListeners[id] = function(){
        let visiblePlayers = [...clients[currentRoom].keys()].filter(
            a=>{
                return !clientsPos[a].hidden
            }
        )
        if (clientsPos[id].respawnTime != -1) {
            clientsPos[id].respawnTime -= 1
        }
        if (clientsPos[id].respawnTime == 0) {
            clientPackets[id].respawnTime = -1
            clientPackets[id].push({
                type: "respawn"
            })
            clientsPos[id].hidden = false
        }
        conn.write(JSON.stringify({
            type: "positions",
            teamPlayers: [...Object.keys(teamMap)].map(t=>{return {id: t, ally: teamMap[t]==team}}).reduce((p,c)=>{
                p[c.id]=c.ally
                return p
            },{}),
            playerlist: [...clients[currentRoom].keys()],
            upgrades: teamUpgrades[team],
            locations: visiblePlayers.map(id=>clientsPos[id]),
            projectiles: rooms[currentRoom].projectiles,
            misc_packets: clientPackets[id]
        }))
        //console.log(clientPackets[id])
        clientPackets[id] = []
    }
    var bulletPacketLimiter = false;
    conn.on('data', onConnData);
    conn.once('close', onConnClose);
    conn.on('error', onConnError);
    function onConnData(d)
    {
        var sendBulletPack = false
        if (Buffer.from(d).toString().split(gamemakerMagic).length != 1) {
            console.log("Multiple packets detected! Dropping last sent packet!")
            clientPackets[id].push({
                        type: "teleport",
                        x: clientsPos[id].x,
                        y: clientsPos[id].y,
                        dir: clientsPos[id].dir
            })
        }
        try {
        //console.log('connection data from %s: %j', remoteAddress, d);
        //console.log(Buffer.from(d).toString())
        //console.log(`|${Buffer.from(d).toString("hex")}|`)
        var newpos = JSON.parse(/{.+}/g.exec(Buffer.from(d).toString())[0].replaceAll(/[^\u0000-\u007F]+/g, ""))
        for (let packet of newpos.packets)
        {
            if (packet.type == "pos") {
                let distanceTraveledSquared = (packet.x-clientsPos[id].x)**2+(packet.y-clientsPos[id].y)**2
                if (distanceTraveledSquared >= 25**2) {
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
            } else if (packet.type == "animation") {
                clients[currentRoom].forEach(client=>{
                    if (client == id) return;
                    clientPackets[client].push({
                        type: "animation",
                        player: id,
                        data: packet.data
                    })
                })
            } else if (packet.type == "fire_bullet") {
                if (bulletPacketLimiter) continue;
                sendBulletPack = true;
                bulletPacketLimiter = true;
                fireBullet(clientsPos[id].x,clientsPos[id].y,clientsPos[id].dir,id,teamUpgrades[team].damage)
            } else {
                console.log(packet)
            }
        }
    } catch {
        console.log("|The following json caused an error :/|\n"+Buffer.from(d).toString()+"\n||")
    }
    bulletPacketLimiter = sendBulletPack && bulletPacketLimiter
        //conn.write(d);  
    }
    function onConnClose()
    {
        console.log('[DEBUG] - %s', id);
        delete clientsPos[id]
        clients[currentRoom].delete(id)
        delete clientPackets[id]
        delete packetListeners[id]
        delete teamMap[id]
        teamSizes[team]-=1;
        clients[currentRoom].forEach(client=>{
            clientPackets[client].push({
                type: "playerleave",
                player: id,
            })
        })
    }
    function onConnError(err)
    {
        //console.log('Connection %s error: %s', remoteAddress, err.message);
    }
    conn.write(JSON.stringify({
        type: "id",
        this_id: id
    }))
});

server.listen(9000, function ()
{
    console.log('server listening to %j', server.address());
});
