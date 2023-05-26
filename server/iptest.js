let probablyIP;
let oneninetwos = []
let ips = []
const dictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
let remainder = 0
function getCode(ip="192.168.0.1") {
    let number = ip.split(".").map(a=>a*1)
    let randomLetter = Math.floor((dictionary.length/2)*Math.random())
    let binary = (parseInt(number.map(a=>{
        return (a ^ randomLetter).toString(2).padStart(8,"0")
    }).join(""),2).toString(36).toUpperCase().padStart(7,"0"))
    var first = binary[0]
    binary = binary.replace(binary[0],dictionary[(randomLetter*2)+parseInt(first,36)])
    return binary
}
const getNetworkInterfaces = require("os").networkInterfaces;
const networkInterfaces = getNetworkInterfaces();
for (let id in networkInterfaces) {
    let networkInterface = networkInterfaces[id]
    for (let interface of networkInterface) {
        if ([4, "IPv4"].includes(interface.family)
            && interface.internal == false) {
            if (interface.address.startsWith("192")) {
                probablyIP ??= interface.address
                oneninetwos.push(interface.address)
            }
            ips.push(interface.address)
        }
    }
}
probablyIP ??= "127.0.0.1"
module.exports = {
    ip: probablyIP,
    ips,
    oneninetwos,
    code: getCode(probablyIP),
    codes: ips.map(getCode)
}