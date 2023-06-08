import { exec } from "child_process"
process.stdin.setRawMode(true)
process.stdin.on("data", (key) => {
    if (key === '\u0003') {
        process.exit();
    }
})
function run(i) {
    console.log(`[INFO]  Starting game #${i}`)
    let proc = exec(`node index noreset`,{cwd: process.cwd()})
    proc.stdout.pipe(process.stdout)
    process.stdin.pipe(proc.stdin)
    proc.on("exit", (c) => {
        if (c != 0) {
            console.log(`[WARN]  NODE.JS EXIT CODE WAS NOT ZERO (Was: ${c}, Expected: 0)`)
        }
        setTimeout(() => { run(i + 1) }, 1)
    })
}
run(1)