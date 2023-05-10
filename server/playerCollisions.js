const Collisions = require("./rect_collisions.js")

let {bulletRect,tankRect} = require("./arenaCollisions.js")

function checkPlayerBullet(playerMap,playerLocMap,x,y,dir,shooter,damage,room) {
    const players = [...playerMap[room]?.keys()||[]];
    const damageCircle = {
        radius: bulletRect.rough_radius,
        x: x,
        y: y
    }
    let bulletColl = {
        x,
        y,
        dir,
        w: bulletRect.w,
        h: bulletRect.h
    }
    let hits = []
    //console.log(players)
    for (let player of players) {
        //console.log(player)
        if (player == shooter) continue
        //console.log(playerLocMap,player)
        let location = playerLocMap[player]
        if (location.respawnTime != -1) continue;
        let tankCircle = {
            x:location.x,
            y:location.y,
            radius: tankRect.rough_radius
        }
        let tankColl = {
            x: location.x,
            y: location.y,
            w: tankRect.w,
            h: tankRect.h,
            dir: location.dir
        }
        //console.log(tankCircle,damageCircle)
        if (Collisions.circle(tankCircle,damageCircle)) {
            //console.log("Circle! %s",damageCircle)
            if (Collisions.rect(bulletColl,tankColl)) {
                //console.log(`Collision!`)
                hits.push(player)
            }
        }
    }
    return hits;
}

module.exports = {
    checkPlayer: checkPlayerBullet
}