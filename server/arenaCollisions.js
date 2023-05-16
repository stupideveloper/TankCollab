const Collisions = require("./rect_collisions.js")
/**
 * Add more arena geometry here
 */
const arenaGeometry = [
    {
        rough_radius: 14.2 * 9, // Rough radius for the circle filtering
        x: 200, // Location X
        y: 200, // Location Y
        h: 30, // Height
        w: 30, // Width
        angle: 0 // Angle
    }
]
/**
 * Bounding box of arena
 */
let arenaBounds = {
    x_min: 0,
    y_min: 0,
    x_max: 7680,
    y_max: 4660
}
/**
 * Size of a bullet
 */
const bulletRect = {
    w: .4 * 64,
    h: .4 * 64,
    rough_radius: Math.sqrt((.4 * 64)**2+(.4 * 64)**2)
}
/**
 * Size of a tank
 */
const tankRect = {
    w: 63,
    h: 63,
    rough_radius: Math.sqrt(32**2+32**2)
}
/**
 * 
 * @param {{
 *  x: number,
* y: number,
 * w: number,
 * h: number,
 * rough_radius: number
 * }} rect
 * @returns 
 */
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
        /**
         * Checks whether the two objects are close enough to do the rectangle check
         */
        if (Collisions.circle(circleOfRect,circleOfPart)) {
            /**
             * Runs an expensive rectangle check
             */
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