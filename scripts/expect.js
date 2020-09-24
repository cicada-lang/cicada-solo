const execute = require("./execute")
const chalk = require("chalk")

const OK = chalk.bold.blue("[expect.ok]")

async function ok(command) {
  execute(command).then(({ stdout, stderr, error }) => {
    console.log(`${OK} ${command}`)
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    if (error) {
      process.exit(1)
    }
  })
}

const FAIL = chalk.bold.red("[expect.fail]")

async function fail(command) {
  execute(command).then(({ stdout, stderr }) => {
    console.log(`${FAIL} ${command}`)
    console.log(stdout)
    console.error(stderr)
  })
}

module.exports = { ok, fail }
