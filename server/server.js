import { exec } from "child_process"
function run(i) {
    console.log(`[INFO]  Starting game #${i}`)
    let proc = exec(`node index noreset`,{cwd: process.cwd()})
    proc.stdout.pipe(process.stdout)
    proc.on("exit", (c) => {
        console.log(c)
        setTimeout(() => { run(i + 1) }, 1)
    })
}
run(1)