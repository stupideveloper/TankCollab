const Collisions = require("./rect_collisions.js")

const arenaGeometry = [
    {
        rough_radius: 14.2 * 9,
        x: 200,
        y: 200,
        h: 30,
        w: 30,
        angle: 0
    }
]
let arenaBounds = {
    x_min: 0,
    y_min: 0,
    x_max: 7680,
    y_max: 4660
}
const bulletRect = {
    w: .4 * 64,
    h: .4 * 64,
    rough_radius: Math.sqrt((.4 * 64)**2+(.4 * 64)**2)
}
const tankRect = {
    w: 63,
    h: 63,
    rough_radius: Math.sqrt(32**2+32**2)
}
const checkWallCollisions = function (rect) {
    const circleOfRect = {
        radius: rect.rough_radius,
        x: rect.x,
        y: rect.y
    }
    if (!Collisions.point(rect.x,rect.y,arenaBounds.x_min,arenaBounds.x_max,arenaBounds.y_min,arenaBounds.y_max)) {
        return true
    }
    let returnval = false
    arenaGeometry.forEach(function(arenaPart){
        if (returnval) return;
        const circleOfPart = {
            radius: arenaPart.rough_radius,
            x: arenaPart.x,
            y: arenaPart.y
        }
        if (Collisions.circle(circleOfRect,circleOfPart)) {
            if (Collisions.rect(rect,arenaPart)) {
                //console.log(`Collision!`)
                returnval=true;
            }
        }
    })
    return returnval
}

module.exports = {
    checkWalls: checkWallCollisions,
    bulletRect,
    tankRect
}