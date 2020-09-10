const execute = require("./execute")
const chalk = require("chalk")

async function ok(prog, { echo } = {}) {
  execute(prog).then(({ stdout, stderr, error }) => {
    const head = chalk.bold.blue("[expect.ok]")
    console.log(`${head} ${prog}`)
    if (stdout && echo) console.log(stdout)
    if (stderr && echo) console.error(stderr)
    if (error) {
      console.error(error.message)
      process.exit(1)
    }
  })
}

async function fail(prog, { echo } = {}) {
  execute(prog).then(({ stdout, stderr }) => {
    const head = chalk.bold.red("[expect.fail]")
    console.log(`${head} ${prog}`)
    if (stdout && echo) console.log(stdout)
    if (stderr && echo) console.error(stderr)
  })
}

module.exports = { ok, fail }
