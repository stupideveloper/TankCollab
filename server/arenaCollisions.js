const Collisions = require("./rect_collisions")
/**
 * Add more arena geometry here
 */
const arenaGeometry = [
    {
        rough_radius: Math.sqrt(980 ** 2 + 500 ** 2), // Rough radius for the circle filtering
        x: 325, // Location X
        y: 890, // Location Y
        h: 980, // Height
        w: 650, // Width
        angle: 0, // Angle
        bullet: false,
        player: false,
        gem: true
    },
    {
        rough_radius: Math.sqrt(980 ** 2 + 500 ** 2), // Rough radius for the circle filtering
        x: 3400, // Location X
        y: 890, // Location Y
        h: 980, // Height
        w: 550, // Width
        angle: 0, // Angle
        bullet: false,
        player: false,
        gem: true
    }
]
/**
 * Bounding box of arena
 */
let arenaBounds = {
    x_min: 100,
    y_min: 100,
    x_max: 3633,
    y_max: 2230
}
/**
 * Size of a bullet
 */
const bulletRect = {
    w: .4 * 64,
    h: .4 * 64,
    rough_radius: Math.sqrt((.4 * 64) ** 2 + (.4 * 64) ** 2)
}
/**
 * Size of a tank
 */
const tankRect = {
    w: 63,
    h: 63,
    rough_radius: Math.sqrt(32 ** 2 + 32 ** 2)
}
const gemRect = {
    w: 43,
    h: 43,
    rough_radius: Math.ceil(Math.sqrt(43 ** 2 + 43 ** 2))
}
const shieldGeneratorRect = {
    rough_radius: 40
}
const shieldGeneratorLocations = [
    {
        x: 100,
        y: 100,
        team: "A"
    }
]
const coreRect = {
    w: 0,
    h: 0,
    rough_radius: 85
}
/**
 * @typedef {"bullet"|"player"|"gem"} CheckType
 */
/**
 * 
 * @param {{
 *  x: number,
* y: number,
 * w: number,
 * h: number,
 * rough_radius: number
 * }} rect
 * @param {CheckType} checkType
 * @returns 
 */
const checkWallCollisions = function (rect, checkType = "player") {
    const circleOfRect = {
        radius: rect.rough_radius,
        x: rect.x,
        y: rect.y
    }
    if (!Collisions.point(rect.x, rect.y, arenaBounds.x_min, arenaBounds.x_max, arenaBounds.y_min, arenaBounds.y_max)) {
        return true
    }
    let returnval = false
    arenaGeometry.forEach(function (arenaPart) {
        if (returnval) return;
        if (checkType == "bullet" && !arenaPart.bullet) return;
        if (checkType == "player" && !arenaPart.player) return;
        if (checkType == "gem" && !arenaPart.gem) return;
        const circleOfPart = {
            radius: arenaPart.rough_radius,
            x: arenaPart.x,
            y: arenaPart.y
        }
        /**
         * Checks whether the two objects are close enough to do the rectangle check
         */
        if (Collisions.circle(circleOfRect, circleOfPart)) {
            /**
             * Runs an expensive rectangle check
             */
            if (Collisions.rect(rect, arenaPart)) {
                returnval = true;
            }
        }
    })
    return returnval
}

module.exports = {
    checkWalls: checkWallCollisions,
    bulletRect,
    tankRect,
    gemRect,
    coreRect,
    shieldGeneratorRect
}