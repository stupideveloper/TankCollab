const { checkWalls, gemRect } = require("./arenaCollisions.js")
const uuid = require("crypto").randomUUID

const gem_uuids = new Set()
/**
 * Different team names
 */

class GemType {
    static BLUE = new GemType(0b01,"BLUE");
    static GREEN = new GemType(0b10,"GREEN");
    static PURPLE = new GemType(0b11,"PURPLE");
    static RED = new GemType(0b00,"RED");
    #id = 0b00
    #name = ""
    constructor(id,name) {
        this.#id = id;
        this.#name = name
    }
    getName() {
        return this.#name
    }
    getId() {
        return this.#id
    }
    toString() {
        return this.getName()
    }
    /**
     * 
     * @returns {GemType} type
     */
    static random() {
        return (
            (Math.random()>0.5)?(Math.random()>0.5)?this.BLUE:this.GREEN:(Math.random()>0.5)?this.PURPLE:this.RED
        )
    }
    /**
     * 
     * @param {*} id 
     * @returns {GemType} type
     */
    static fromId(id) {
        switch (id) {
            case 0b01:
                return this.BLUE
            case 0b10: 
                return this.GREEN
            case 0b11:
                return this.PURPLE
            case 0b00:
                return this.RED
        }
    }
}
function randomGem(width,height,type=GemType.random()) {
    while (true) {
    var gran = 1000
    var widthQ, heightQ;
    if (width > height) {
        heightQ = gran;
        widthQ = Math.floor(gran * (width/height))
    } else {
        widthQ = gran;
        heightQ = Math.floor(gran * (height/width))
    }
    var x = width * Math.floor(Math.random()*(widthQ+1)) / widthQ
    var y = height * Math.floor(Math.random()*(heightQ+1)) / heightQ
    if (!checkWalls({
        ...gemRect,
        x,
        y
    })) {
        let gemuuid = uuid()
        gem_uuids.add(gemuuid)
    return {
        type: type.getId(),
        x,
        y,
        uuid: gemuuid
    }
}
}
}
module.exports = {
    GemType,
    randomGem,
    gem_uuids
}