let probablyIP;
let oneninetwos = []
let ips = []
const dictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
let remainder = 0
function validateIp(ip = "192.168.0.1")
{
    return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)
}
function getCode(ip = "192.168.0.1")
{
    if (!validateIp(ip)) return;
    let number = ip.split(".").map(a => a * 1)
    let randomLetter = Math.floor((dictionary.length / 2) * Math.random())
    let binary = (parseInt(number.map(a =>
    {
        return (a ^ randomLetter).toString(2).padStart(8, "0")
    }).join(""), 2).toString(36).toUpperCase().padStart(7, "0"))
    var first = binary[0]
    binary = binary.replace(binary[0], dictionary[(randomLetter * 2) + parseInt(first, 36)])
    return binary
}

import { networkInterfaces as getNetworkInterfaces } from "os";
const networkInterfaces = getNetworkInterfaces();
for (let id in networkInterfaces)
{
    let networkInterface = networkInterfaces[id]
    for (let _interface of networkInterface)
    {
        if ([4, "IPv4"].includes(_interface.family)
            && _interface.internal == false) {
            if (_interface.address.startsWith("192"))
            {
                probablyIP ??= _interface.address
                oneninetwos.push(_interface.address)
            }
            ips.push(_interface.address)
        }
    }
}
probablyIP ??= "127.0.0.1"
const codes = ips.map(getCode)
const ip = probablyIP
const code = getCode(ip)
export default {
    ip,
    ips,
    oneninetwos,
    code,
    codes,
    getCode
}