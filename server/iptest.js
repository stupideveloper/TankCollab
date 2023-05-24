let probablyIP;
let oneninetwos = []
let ips = []
const getNetworkInterfaces = require("os").networkInterfaces;
const networkInterfaces = getNetworkInterfaces();
for (let id in networkInterfaces) {
    let networkInterface = networkInterfaces[id]
    for (let interface of networkInterface) {
        if ([4,"IPv4"].includes(interface.family)
        && interface.internal==false) {
            if (interface.address.startsWith("192")) {
                probablyIP??=interface.address
                oneninetwos.push(interface.address)
            }
            ips.push(interface.address)
        }
    }
}
probablyIP??="127.0.0.1"
module.exports = {
    ip: probablyIP,
    ips,
    oneninetwos
}