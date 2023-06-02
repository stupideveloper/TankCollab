let chars = {
    ["["]: `█▀
█
█
█
█
█▄`,
    ["]"]: `▀█
 █
 █
 █
 █
▄█`,
    A: `
 ▄▀▄
█▄▄▄█
█   █
█   █`,
    B: `
█▀▀▀▄
█▄▄▄▀
█   █
█▄▄▄▀`,
    C: `
▄▀▀▀▄
█
█
▀▄▄▄▀`,
    D: `
█▀▀▀▄
█   █
█   █
█▄▄▄▀`,
    E: `
█▀▀▀▀
█▄▄▄
█
█▄▄▄▄`,
    F: `
█▀▀▀▀
█▄▄▄
█
█`,
    G: `
▄▀▀▀▄
█  ▄▄
█   █
▀▄▄▄█`,
    H: `
█   █
█▄▄▄█
█   █
█   █`,
    I: `
▀█▀
 █
 █
▄█▄`,
    J: `
▀▀█▀
  █
  █
▀▄▀`,
    K: `
█   █
█▄▄▀
█  █
█   █`,
    L: `
█
█
█
█▄▄▄`,
    M: `
█▀▄ ▄▀█
█ ▀▄▀ █
█  ▀  █
█     █`,
    N: `
█▄  █
█▀▄ █
█ ▀▄█
█  ▀█`,
    O: `
▄▀▀▀▄
█   █
█   █
▀▄▄▄▀`,
    P: `
█▀▀▀▄
█▄▄▄▀
█
█`,
    Q: `
▄▀▀▀▄
█   █
█ ▀▄█
▀▄▄▄▀`,
    R: `
█▀▀▀▄
█▄▄▄▀
█   █
█   █`,
    S: `
▄▀▀▀▄
▀▄▄▄
    █
▀▄▄▄▀`,
    T: `
▀▀█▀▀
  █
  █
  █`,
    U: `
█   █
█   █
█   █
▀▄▄▄▀`,
    V: `
█   █
█   █
█   █
 ▀▄▀`,
    W: `
█     █
█  ▄  █
█  █  █
▀▄▀ ▀▄▀`,
    X: `
█   █
 ▀▄▀ 
▄▀ ▀▄
█   █`,
    Y: `
█   █
 ▀▄▀ 
  █
  █`,
    Z: `
▀▀▀▀█
  ▄▀
▄▀
█▄▄▄▄`,
    1: `
▄█ 
 █
 █
▄█▄`,
    2: `
▄▀▀▀▄
   ▄▀
 ▄▀
█▄▄▄▄`,
    3: `
▄▀▀▀▄
 ▄▄▄▀
    █
▀▄▄▄▀`,
    4: `
 ▄▀█ 
█  █
▀▀▀█▀
   █`,
    5: `
█▀▀▀▀
█▄▄▄
    █
▀▄▄▄▀`,
    6: `
▄▀▀▀▄
█▄▄▄
█   █
▀▄▄▄▀`,
    7: `
▀▀▀▀█
  ▄▀
  █
  █`,
    8: `
▄▀▀▀▄
▀▄▄▄▀
█   █
▀▄▄▄▀`,
    9: `
▄▀▀▀▄
▀▄▄▄█
    █
▀▄▄▄▀`,
    0: `
▄▀▀▀▄
█ ▄▀█
█▀  █
▀▄▄▄▀`,
}
function convertToLarge(word) {
    let segments = word.toUpperCase().split("")
    return charsConcat(...segments.map(v => {
        return (chars[v] || `\n${v}\n${v}\n${v}\n${v}\n`)
    }))
}
function charsConcat(char1, ...otherChars) {
    let pointer = char1
    otherChars.reverse()
    while (otherChars.length > 0) {
        pointer = charConcat(pointer, otherChars.pop())
    }
    return pointer
}
function charConcat(char1, char2) {
    let rows = char1.split("\n")
    let rows2 = char2.split("\n")
    let longest = rows.reduce((p, c) => {
        if (c.length > p) return c.length
        return p
    }, 0)

    return new Array(Math.max(rows.length, rows2.length)).fill().map((v, i) => { return (rows[i] || rows[0]) || "" }).map((c, i) => {
        return c.padEnd(longest + 1, " ") + (rows2[i] || rows2[0] || "")
    }).join("\n")
}
module.exports = function logCode(code) { console.log(charConcat("[DEBUG]", convertToLarge(`The Code Is [${code}]`))) }