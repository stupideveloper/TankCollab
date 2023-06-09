import { circle, rect, toDegrees, reflect } from "./rect_collisions.js";

import { bulletRect, tankRect, coreRect, shieldGeneratorRect } from "./arenaCollisions.js";
/**
 * Returns if a bullet is colliding with a player
 * @param {{
 *  [room]: Set<>
 * }} playerMap 
 * @param {{
 *  [UUID]: {
 * }
 * }} playerLocMap 
 * @param {number} x 
 * @param {number} y 
 * @param {number} dir 
 * @param {UUID} shooter 
 * @param {number} damage 
 * @param {string} room 
 * @returns 
 */
function checkPlayerBullet(playerMap, playerLocMap, x, y, dir, shooter, damage, room) {
    /**
     * Gets a list of all players in the room
     */
    const players = [...playerMap[room]?.keys() || []];
    /**
     * Rough rect of the bullet
     */
    const damageCircle = {
        radius: bulletRect.rough_radius,
        x: x,
        y: y
    }
    /**
     * Bullet collision rect
     */
    let bulletColl = {
        x,
        y,
        dir,
        w: bulletRect.w,
        h: bulletRect.h
    }
    /**
     * All the players the bullet has hit
     */
    let hits = []

    for (let player of players) {
        /**
         * Prevents the shooter from shooting themselves
         */
        if (player == shooter) continue
        let location = playerLocMap[player]
        /**
         * If the player is dead, dont collide
         */
        if (location.respawnTime != -1) continue;
        let tankCircle = {
            x: location.x,
            y: location.y,
            radius: tankRect.rough_radius
        }
        let tankColl = {
            x: location.x,
            y: location.y,
            w: tankRect.w,
            h: tankRect.h,
            dir: location.dir
        }
        /**
         * Sees if the bullet and tank are close enough to justify using the rectangle function
         */
        if (circle(tankCircle, damageCircle)) {
            /**
             * yet another use of the costly rectangle collision function
             */
            if (rect(bulletColl, tankColl)) {
                hits.push(player)
            }
        }
    }
    return hits;
}
function checkCoreBullet(cores = [], shieldGenerators = [], x, y, dir, shooterTeam, teamData) {
    const damageCircle = {
        radius: bulletRect.rough_radius,
        x: x,
        y: y
    }
    let coreCircles = cores.map(c => {
        return {
            ...c,
            radius: coreRect.rough_radius
        }
    })
    let shieldCircles = shieldGenerators.map(c => {
        return {
            ...c,
            radius: shieldGeneratorRect.rough_radius
        }
    })
    let returns = { hits: [], dirUpdate: dir }
    for (let coreCirc of coreCircles) {
        //if (coreCirc.id.startsWith(shooterTeam)) continue;
        if (!coreCirc.alive) continue;

        if (circle(coreCirc, damageCircle)) {
            let team;
            if (coreCirc.id.startsWith("A")) {
                team = "A"
            } else {
                team = "B"
            }
            if (teamData[team].rightShieldHealth > 0 || teamData[team].leftShieldHealth > 0) {
                let inangle = toDegrees(Math.atan2(x - coreCirc.x, y - coreCirc.y));
                returns.dirUpdate = reflect(dir, inangle - 90)
                continue
            }
            if (coreCirc.id.startsWith(shooterTeam)) {
                returns.hits.push(0)
                continue;
            };
            returns.hits.push(coreCirc.id)
        }
    }
    for (let shieldCirc of shieldCircles) {
        if (!shieldCirc.alive) continue;
        if (circle(shieldCirc, damageCircle)) {
            if (shieldCirc.id.startsWith(shooterTeam)) {
                returns.hits.push(0)
                continue;
            };
            returns.hits.push(shieldCirc.id)
        }
    }
    return returns
}

export const checkPlayer = checkPlayerBullet;
export const checkCores = checkCoreBullet;