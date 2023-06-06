
import {GemType} from "./gems.js"
import {UpgradeTypes} from "./teams.js"

function compressMiscPacket(packet) {
    try {
    switch (packet.type) {
        case "teleport": {
            return `0|${(packet.x*100).toString(36).split(".")[0].toUpperCase()}|${(packet.y*100).toString(36).split(".")[0].toUpperCase()}|${(packet.dir*100).toString(36).split(".")[0].toUpperCase()}`
        }
        case "screenshake": {
            return `1|${(packet.time*100).toString(36).split(".")[0].toUpperCase()}|${(packet.magnitude*100).toString(36).split(".")[0].toUpperCase()}|${(packet.fade*100).toString(36).split(".")[0].toUpperCase()}`
        }
        case "title": {
            return `2|${(packet.time*100).toString(36).split(".")[0].toUpperCase()}|${packet.title}`
        }
        case "gamestate": {
            return `3|${packet.title=="win"?1:0}|${packet.stats.kills.toString(36).split(".")[0].toUpperCase()}|${packet.stats.damageDealt.toString(36).split(".")[0].toUpperCase()}|${packet.stats.bulletsFired.toString(36).split(".")[0].toUpperCase()}|${packet.stats.deaths.toString(36).split(".")[0].toUpperCase()}|${packet.stats.damageTaken.toString(36).split(".")[0].toUpperCase()}|${packet.stats.gemsCollected.toString(36).split(".")[0].toUpperCase()}`
        }
        case "playerleave": {
            return `4|o|${packet.player}`
        }
        case "health_update": {
            return `5|${packet.health.toString(36).split(".")[0].toUpperCase()}|${packet.max_health.toString(36).split(".")[0].toUpperCase()}`
        }
        case "damage": {
            return `6|d`
        }
        case "death": {
            return `6|D`
        }
        case "final_death": {
            return `6|f`
        }
        case "team_set": {
            return `7|${packet.team}`
        }
        case "gameplay_data_update": {
            return `8|${packet.shield_generator_max_health.toString(36).split(".")[0].toUpperCase()}|${packet.core_max_health.toString(36).split(".")[0].toUpperCase()}`
        }
        case "gem_spawn": {
            return `9|${packet.x.toString(36).split(".")[0].toUpperCase()}|${packet.y.toString(36).split(".")[0].toUpperCase()}|${packet.gem_type}|${packet.uuid}`
        }
        case "playerjoin": {
            return `4|i|${packet.player}`
        }
        case "respawn": {
            return `A|${packet.max_health.toString(36).split(".")[0].toUpperCase()}`
        }
        case "collect_gem": {
            return `B|${packet.uuid}`

        }
    }
} catch (e) {
    console.log(e)
}
}
function compressPacket(packet) {
    let compressedMiscPackets = packet.misc_packets.map(compressMiscPacket).join("||")
let exported = packet
let projectiles = exported.projectiles;
let fixedProjectiles = Object.keys(projectiles).map(v=>{
    return [
        v,
        projectiles[v].x,
        projectiles[v].y
    ]
})
let locations = exported.locations
let fixedLocations = locations.map(v=>{
    return [
        v.id,
        v.x,
        v.y,
        v.dir,
        v.name,
        v.health,
        v.max_health]
})
let processed = [
    exported.this_id,
    [
        exported.gems[GemType.RED],
        exported.gems[GemType.BLUE],
        exported.gems[GemType.GREEN],
        exported.gems[GemType.PURPLE],
    ],
    exported.health,
    exported.teamPlayers,
    exported.playerlist,
    [
        exported.upgrades[UpgradeTypes.BulletDamage],
        exported.upgrades[UpgradeTypes.BulletReload],
        exported.upgrades[UpgradeTypes.BulletSpeed],
        exported.upgrades[UpgradeTypes.MoveSpeed],
        exported.upgrades[UpgradeTypes.MaxHealth],
        exported.upgrades[UpgradeTypes.HealthRegen]
    ],
    [
        exported.upgradeTiers[UpgradeTypes.BulletDamage],
        exported.upgradeTiers[UpgradeTypes.BulletReload],
        exported.upgradeTiers[UpgradeTypes.BulletSpeed],
        exported.upgradeTiers[UpgradeTypes.MoveSpeed],
        exported.upgradeTiers[UpgradeTypes.MaxHealth],
        exported.upgradeTiers[UpgradeTypes.HealthRegen]
    ],
    exported.respawn_time,
    fixedLocations,
    fixedProjectiles,
    compressedMiscPackets,
    [
        exported.team_data.rightShieldHealth,
        exported.team_data.leftShieldHealth,
        exported.team_data.coreHealth,
        [
            exported.team_data.rightShield.id,
            exported.team_data.rightShield.x,
            exported.team_data.rightShield.y,
            exported.team_data.rightShield.alive
        ],
        [
            exported.team_data.leftShield.id,
            exported.team_data.leftShield.x,
            exported.team_data.leftShield.y,
            exported.team_data.leftShield.alive
        ],
        [
            exported.team_data.core.id,
            exported.team_data.core.x,
            exported.team_data.core.y,
            exported.team_data.core.alive
        ]
    ],
    [
        exported.other_team_info.rightShield,
        exported.other_team_info.leftShield,
        exported.other_team_info.core,
        [
            exported.other_team_info.rightShieldLoc.id,
            exported.other_team_info.rightShieldLoc.x,
            exported.other_team_info.rightShieldLoc.y,
            exported.other_team_info.rightShieldLoc.alive
        ],
        [
            exported.other_team_info.leftShieldLoc.id,
            exported.other_team_info.leftShieldLoc.x,
            exported.other_team_info.leftShieldLoc.y,
            exported.other_team_info.leftShieldLoc.alive
        ],
        [
            exported.other_team_info.coreLoc.id,
            exported.other_team_info.coreLoc.x,
            exported.other_team_info.coreLoc.y,
            exported.other_team_info.coreLoc.alive
        ]
    ],
    [
        exported.splashData.ip,
        exported.splashData.gameVersion,
        exported.splashData.connectionIp,
        Math.ceil(exported.splashData.nsPerTick),
        Math.ceil(exported.splashData.nsLastTick),
        Math.ceil(exported.splashData.maxTick)
    ],
    exported.beginned,
    [
        exported.availableUpgrades[UpgradeTypes.BulletDamage],
        exported.availableUpgrades[UpgradeTypes.BulletReload],
        exported.availableUpgrades[UpgradeTypes.BulletSpeed],
        exported.availableUpgrades[UpgradeTypes.MoveSpeed],
        exported.availableUpgrades[UpgradeTypes.MaxHealth],
        exported.availableUpgrades[UpgradeTypes.HealthRegen]
    ],
    [exported.teamSizes.own,exported.teamSizes.oth],
]
//console.log(JSON.stringify(processed))
return processed
}
export default compressPacket