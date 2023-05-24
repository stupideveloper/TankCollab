const teams = {
    TEAM_A: "A",
    TEAM_B: "B"
}
/**
 * Team selection algorithm
 */
let teamSizes = { A: 0, B: 0 }
let teamSelector = () => {
    if (teamSizes[teams.TEAM_A] == teamSizes[teams.TEAM_B]) {
        return Math.random() > 0.5 ? teams.TEAM_A : teams.TEAM_B;
    }
    return teamSizes[teams.TEAM_A] > teamSizes[teams.TEAM_B] ? teams.TEAM_B : teams.TEAM_A;
}

/**
 * Team-specific upgrades
 */

let teamUpgrades = {
    "A": {
        bulletDamage: 0,
    bulletSpeed: 0,
    bulletReload: 0,
    moveSpeed: 0,
    maxHealth: 0,
    healthRegen: 0
    },
    "B": {
        bulletDamage: 0,
    bulletSpeed: 0,
    bulletReload: 0,
    moveSpeed: 0,
    maxHealth: 0,
    healthRegen: 0
    }
}

let upgradeTiers = {
    bulletDamage: [10, 12, 14, 16, 18, 20, 22],
    bulletSpeed: [10, 11, 12, 14, 16, 19, 22],
    bulletReload: [60, 40, 30, 20, 10, 5, 3],
    moveSpeed: [100, 120, 128, 135, 141, 146, 150],
    maxHealth: [100, 120, 128, 135, 141, 146, 150],
    healthRegen: [0, 1, 2, 4, 6, 9, 13]
}

class UpgradeTypes {
    static BulletDamage = "bulletDamage"
    static BulletSpeed = "bulletSpeed"
    static BulletReload = "bulletReload"
    static MoveSpeed = "moveSpeed"
    static MaxHealth = "maxHealth"
    static HealthRegen = "healthRegen"
}
class Upgrades {
    /**
     * 
     * @param {*} team
     * @param {UpgradeTypes.BulletDamage|UpgradeTypes.BulletSpeed|UpgradeTypes.BulletReload|UpgradeTypes.MoveSpeed|UpgradeTypes.MaxHealth|UpgradeTypes.HealthRegen} type
     * @returns 
     */
    static getUpgradeForTeam(team,type) {
        return upgradeTiers[type][teamUpgrades[team][type]]
    }
    static convertToJson(team) {
        return teamUpgradesToTiers(teamUpgrades[team])
    }
    static getTiersJson(team) {
        return teamUpgrades[team]
    }
    static canUpgrade(team,type,bank) {

    }
    static doUpgrade(team,type,bank) {
        teamUpgrades[team][type]+=1
        return bank
    }
}

function teamUpgradesToTiers(upgrades) {
    return Object.keys(upgradeTiers).map(v=>{
        return {
            key: v,
            value: upgradeTiers[v][upgrades[v]]
        }
    }).reduce((p,v)=>{
        return {
            ...p,
            [v.key]: v.value
        }
    },{})
}
/**
 * Default team upgrades, can be used to revert the above team upgrades
 */
const teamUpgradesDefault = JSON.stringify(teamUpgrades)

module.exports = {
    teamSelector,
    teamSizes,
    upgradeTiers,
    teamUpgradesToTiers,
    teamUpgrades,
    UpgradeTypes,
    Upgrades
}