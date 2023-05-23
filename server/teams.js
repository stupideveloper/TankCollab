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

let upgradeTiers = {
    damage: [10, 12, 14, 16, 18, 20, 22],
    bulletSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6],
    health: [100, 120, 128, 135, 141, 146, 150],
    damageResistance: [0, 4, 8, 11, 14, 17, 20], // %
    speed: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6]
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

module.exports = {
    teamSelector,
    teamSizes,
    upgradeTiers,
    teamUpgradesToTiers
}