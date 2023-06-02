const child = require("child_process")
function run(i) {
    console.log(`[INFO]  Starting game #${i}`)
    let proc = child.exec(`node "${process.cwd()}/index.js" noreset`)
    proc.stdout.pipe(process.stdout)
    proc.on("exit", (c) => {
        console.log(c)
        setTimeout(() => { run(i + 1) }, 1)
    })
}
run(1)