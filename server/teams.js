
/** JSDOC 
 * @typedef {"bulletDamage"|"bulletSpeed"|"bulletReload"|"moveSpeed"|"maxHealth"|"healthRegen"} AbstractUpgradeType 
 * @typedef {"A"|"B"} AbstractTeam
 * @typedef {"RED","BLUE","GREEN","PURPLE"} AbstractGemType
 * @typedef {{"RED":number,"BLUE":number,"GREEN":number,"PURPLE":number}} AbstractBank
 * @typedef {{"RED":number,"BLUE":number,"GREEN":number,"PURPLE":number}} AbstractRequirement
 * @typedef {{"bulletDamage":number,"bulletSpeed":number,"bulletReload":number,"moveSpeed":number,"maxHealth":number,"healthRegen":number}} AbstractUpgrades*/
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
    bulletDamage: [1.5, 2, 3, 4.5, 6, 7, 8],
    bulletSpeed: [10, 11, 12, 14, 16, 19, 22],
    bulletReload: [10, 9, 7, 6, 5, 3, 2],
    moveSpeed: [6.25, 7.5, 8, 8.5, 8.875, 9.125, 9.375],
    maxHealth: [50, 70, 100, 120, 150, 160, 170],
    healthRegen: [1, 1.2, 1.6, 2, 2.2, 2.4, 2.6,]
}

class UpgradeTypes {
    static BulletDamage = "bulletDamage"
    static BulletSpeed = "bulletSpeed"
    static BulletReload = "bulletReload"
    static MoveSpeed = "moveSpeed"
    static MaxHealth = "maxHealth"
    static HealthRegen = "healthRegen"
}
class UpgradeRequirements {
    static #reqs = {
        [UpgradeTypes.BulletDamage]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 1, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 2, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 3, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 4, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 5, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 6, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.BulletSpeed]: [
            { [GemType.RED]: 1, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 2, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 3, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 4, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 5, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 6, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.BulletReload]: [
            { [GemType.RED]: 1, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 2, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 3, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 5, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 8, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 10, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.MoveSpeed]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 1 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 2 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 3 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 4 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 5 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 0, [GemType.PURPLE]: 6 }
        ],

        [UpgradeTypes.HealthRegen]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 1, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 2, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 3, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 4, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 5, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 6, [GemType.PURPLE]: 0 }
        ],

        [UpgradeTypes.MaxHealth]: [
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 1, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 2, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 3, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 4, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 5, [GemType.PURPLE]: 0 },
            { [GemType.RED]: 0, [GemType.BLUE]: 0, [GemType.GREEN]: 6, [GemType.PURPLE]: 0 }
        ]
    }
    /** 
     * the requirement that an upgrade has
     * @param {AbstractTeam} team 
     * @param {AbstractUpgradeType} type 
     * @returns {AbstractRequirement}
     */
    static getRequirement(team, type) {
        return this.#reqs[type][Upgrades.getTier(team, type)]
    }
    /** 
     * see below
     * @param {AbstractTeam} team 
     * @param {AbstractUpgradeType} type 
     * @returns {boolean}
     */
    static checkRequirement(bank, team, type) {
        try {
            return this.checkCostRequirement(bank, this.getRequirement(team, type))
        } catch {
            return false;
        }
    }
    /** 
     * whether a bank can afford the requirements
     * @param {AbstractBank} bank 
     * @param {AbstractUpgradeType} requirement 
     * @returns {boolean} whether or not it can
     */
    static checkCostRequirement(bank, requirement = {
        [GemType.RED]: 0,
        [GemType.BLUE]: 0,
        [GemType.GREEN]: 0,
        [GemType.PURPLE]: 0,
    }) {
        return (
            bank[GemType.RED] >= requirement[GemType.RED] &&
            bank[GemType.BLUE] >= requirement[GemType.BLUE] &&
            bank[GemType.GREEN] >= requirement[GemType.GREEN] &&
            bank[GemType.PURPLE] >= requirement[GemType.PURPLE]
        )
    }
    /**
     * remove the required gems from a bank for an upgrade 
     * @param {AbstractBank} bank 
     * @param {AbstractRequirement} requirement 
     * @returns {AbstractBank} a reference to the bank
     */
    static deductRequirement(bank, requirement) {
        bank[GemType.RED] = bank[GemType.RED] - requirement[GemType.RED]
        bank[GemType.BLUE] = bank[GemType.BLUE] - requirement[GemType.BLUE]
        bank[GemType.GREEN] = bank[GemType.GREEN] - requirement[GemType.GREEN]
        bank[GemType.PURPLE] = bank[GemType.PURPLE] - requirement[GemType.PURPLE]
        return bank
    }
}
class Upgrades {
    /**
     * get the current upgrade value for an upgrade
     * 
     * @param {AbstractTeam} team
     * @param {AbstractUpgradeType} type
     * @returns 
     */
    static getUpgradeForTeam(team, type) {
        return upgradeTiers[type][teamUpgrades[team][type]]
    }
    static getUpgrade = this.getUpgradeForTeam
    /**
     * converts the team upgrades to a more friendly object for network transmission
     * 
     * @param {AbstractTeam} team
     */
    static convertToJson(team) {
        return teamUpgradesToTiers(teamUpgrades[team])
    }
    /**
     * get a team's tiers
     * @param {AbstractTeam} team
     * @returns {AbstractUpgrades}
     */
    static getTiersJson(team) {
        return teamUpgrades[team]
    }
    /**
     * get the tier of upgrades that an upgrade currently has
     * @param {AbstractTeam} team 
     * @param {AbstractUpgradeType} type 
     * @returns {number}
     */
    static getTier(team, type) {
        return teamUpgrades[team][type]
    }
    /**
     * update the greyed out upgrades
     * @param {AbstractTeam} team 
     * @param {*} availability 
     * @param {AbstractBank} bank 
     */
    static updateAvailability(team, availability, bank) {
        let categories = Object.keys(availability)
        for (let type of categories) {
            availability[type] = UpgradeRequirements.checkRequirement(bank, team, type);
        }
    }
    /**
     * whether a team can upgrade an upgrade
     * 
     * @param {AbstractTeam} team team to test
     * @param {AbstractUpgradeType} type type of upgrade to test
     * @param {AbstractBank} bank bank of the team
     * @returns {boolean}
     */
    static canUpgrade(team, type, bank) {
        return UpgradeRequirements.checkRequirement(bank, team, type)
    }
    /**
     * 
     * @param {AbstractTeam} team the team to upgrade
     * @param {AbstractUpgradeType} type the type of upgrade to do
     * @param {AbstractBank} bank the team's bank
     * @returns {AbstractBank} a reference to the team's bank
     */
    static doUpgrade(team, type, bank) {
        if (this.canUpgrade(team, type, bank)) {
            var requirement = UpgradeRequirements.getRequirement(team, type)
            UpgradeRequirements.deductRequirement(bank, requirement)
            teamUpgrades[team][type] += 1
        }
        return bank
    }
}

function teamUpgradesToTiers(upgrades) {
    return Object.keys(upgradeTiers).map(v => {
        return {
            key: v,
            value: upgradeTiers[v][upgrades[v]]
        }
    }).reduce((p, v) => {
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