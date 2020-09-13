const execute = require("./execute")
const chalk = require("chalk")

async function ok(prog) {
  execute(prog).then(({ stdout, stderr, error }) => {
    const head = chalk.bold.blue("[expect.ok]")
    console.log(`${head} ${prog}`)
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    if (error) {
      process.exit(1)
    }
  })
}

async function fail(prog) {
  execute(prog).then(({ stdout, stderr }) => {
    const head = chalk.bold.red("[expect.fail]")
    console.log(`${head} ${prog}`)
    console.log(stdout)
    console.error(stderr)
  })
}

module.exports = { ok, fail }
