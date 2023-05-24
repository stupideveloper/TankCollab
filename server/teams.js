
/** JSDOC @typedef {"bulletDamage"|"bulletSpeed"|"bulletReload"|"moveSpeed"|"maxHealth"|"healthRegen"} AbstractUpgradeType @typedef {"A","B"} AbstractTeam*/
const { GemType } = require("./gems")

const teams = {
    TEAM_A: "A",
    TEAM_B: "B"
}
/**
 * Team selection algorithm
 */
let teamSizes = { A: 0, B: 0 }
let teamAlive = { A: 0, B: 0 }
let teamSelector = () =>
{
    if (teamSizes[teams.TEAM_A] == teamSizes[teams.TEAM_B])
    {
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
    moveSpeed: [10.0, 12.0, 12.8, 13.5, 14.1, 14.6, 15.0],
    maxHealth: [100, 120, 128, 135, 141, 146, 150],
    healthRegen: [0, 1, 2, 4, 6, 9, 13]
}

class UpgradeTypes
{
    static BulletDamage = "bulletDamage"
    static BulletSpeed = "bulletSpeed"
    static BulletReload = "bulletReload"
    static MoveSpeed = "moveSpeed"
    static MaxHealth = "maxHealth"
    static HealthRegen = "healthRegen"
}
let bankType = {
    [GemType.RED]: 0,
    [GemType.BLUE]: 0,
    [GemType.GREEN]: 0,
    [GemType.PURPLE]: 0,
}
class UpgradeRequirements
{
    static #reqs = {
        [UpgradeTypes.BulletDamage]: [
            { [GemType.RED]: 1, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.BulletSpeed]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 1, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.BulletReload]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 1, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.MoveSpeed]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 1 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.HealthRegen]: [
            { [GemType.RED]: 1, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.MaxHealth]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ]
    }
    static checkRequirement(bank, team, type)
    {
        try
        {
            return this.checkCostRequirement(bank, this.#reqs[type][Upgrades.getTier(team, type)])
        } catch {
            return false;
        }
    }
    static checkCostRequirement(bank, requirement = {
        [GemType.RED]: 0,
        [GemType.BLUE]: 0,
        [GemType.GREEN]: 0,
        [GemType.PURPLE]: 0,
    })
    {
        return (
            bank[GemType.RED] >= requirement[GemType.RED] &&
            bank[GemType.BLUE] >= requirement[GemType.BLUE] &&
            bank[GemType.GREEN] >= requirement[GemType.GREEN] &&
            bank[GemType.PURPLE] >= requirement[GemType.PURPLE]
        )
    }
}
class Upgrades
{
    /**
     * 
     * @param {AbstractTeam} team
     * @param {AbstractUpgradeType} type
     * @returns 
     */
    static getUpgradeForTeam(team, type)
    {
        return upgradeTiers[type][teamUpgrades[team][type]]
    }
    static getUpgrade = this.getUpgradeForTeam
    static convertToJson(team)
    {
        return teamUpgradesToTiers(teamUpgrades[team])
    }
    static getTiersJson(team)
    {
        return teamUpgrades[team]
    }
    static getTier(team, type)
    {
        return teamUpgrades[team][type]
    }
    static updateAvailability(team, availability, bank) 
    {
        let categories = Object.keys(availability)
        for (let type of categories) {
            availability[type] = UpgradeRequirements.checkRequirement(bank,team,type);
        }
    }
    static canUpgrade(team, type, bank)
    {
        return UpgradeRequirements.checkRequirement(bank, team, type)
    }
    static doUpgrade(team, type, bank)
    {
        if (this.canUpgrade(team, type, bank))
        {
            teamUpgrades[team][type] += 1
        }
        return bank
    }
}

function teamUpgradesToTiers(upgrades)
{
    return Object.keys(upgradeTiers).map(v =>
    {
        return {
            key: v,
            value: upgradeTiers[v][upgrades[v]]
        }
    }).reduce((p, v) =>
    {
        return {
            ...p,
            [v.key]: v.value
        }
    }, {})
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
    Upgrades,
    teamAlive
}