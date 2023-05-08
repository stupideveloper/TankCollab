const net = require("net")
const gamemakerMagic = "\udec0\uadde\u0c00\u0000\u4000\u0000"
const uuid = require("crypto").randomUUID
const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;
const Collision = require("./rect_collisions.js");
const { checkWalls } = require("./arenaCollisions.js");
const { checkPlayer } = require("./playerCollisions.js")
var server = net.createServer();
let clientsPos = {}
let clients = {
    "lobby": new Set()
}
let packetListeners = {

}
const do_lag_back = false
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
            projectile.x = projectile.x - (Math.sin(toRadians(dir))*vel)
            projectile.y = projectile.y - (Math.cos(toRadians(dir))*vel)
            projectile.dist_left -= 1
            if (projectile.dist_left <= 0) {
                deletables.push(id)
            }
            if (checkPlayer(clientPackets,projectile.x,projectile.y,dir,projectile.shooter)) {
                deletables.push(id)
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
let bulletRect = {
    w: 4,
    h: 7,
    rough_radius: 8.1
}
let tankRect = {
    w: 21,
    h: 21,
    rough_radius: Math.sqrt(32**2+32**2)
}
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
function fireBullet(x=0,y=0,dir=0,shooter=uuid(),room="lobby") {
    rooms[room].projectiles[uuid()] = {
        x: x,
        y,
        dir,
        vel: 10,
        dist_left: 100,
        shooter: shooter
    }
}
server.on('connection', function (conn)
{
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
    const id = uuid()
    console.log('[DEBUG] + %s', id);
    let currentRoom = "lobby"
    clients[currentRoom].add(id)
    clientPackets[id] = []
    clientsPos[id] = {
        id: id,
        x: 120,
        y: 120,
        dir: 0
    }
    clients[currentRoom].forEach(client=>{
        if (client == id) return;
        clientPackets[client].push({
            type: "playerjoin",
            player: id,
        })
    })
    function moveRoom(newRoom) {
        if (!clients[newRoom]) clients[newRoom] = new Set()
        clients[currentRoom].delete(id)
        currentRoom = newRoom
        clients[currentRoom].add(id)
    }
    
    packetListeners[id] = function(){
        let visiblePlayers = [...clients[currentRoom].keys()]
        conn.write(JSON.stringify({
            type: "positions",
            playerlist: [...clients[currentRoom].keys()],
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
                fireBullet(clientsPos[id].x,clientsPos[id].y,clientsPos[id].dir,id)
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
