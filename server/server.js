import { exec } from "child_process"
function run(i) {
    console.log(`[INFO]  Starting game #${i}`)
    let proc = exec(`node "${process.cwd()}/index.js" noreset`)
    proc.stdout.pipe(process.stdout)
    proc.on("exit", (c) => {
        setTimeout(() => { run(i + 1) }, 1)
    })
}
run(1)