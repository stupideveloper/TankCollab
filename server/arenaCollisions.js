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

const checkWallCollisions = function (rect) {
    const circleOfRect = {
        radius: rect.rough_radius,
        x: rect.x,
        y: rect.y
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
    checkWalls: checkWallCollisions
}