const execute = require("./execute")
const chalk = require("chalk")
const line_report = require("./line-report")

const OK = chalk.bold.blue("[expect.ok]")

async function ok(command) {
  execute(command).then(({ stdout, stderr, elapse, error }) => {
    line_report(OK, { elapse, command })
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    if (error) {
      process.exit(1)
    }
  })
}

const FAIL = chalk.bold.yellow("[expect.fail]")

async function fail(command) {
  execute(command).then(({ stdout, stderr, elapse }) => {
    line_report(FAIL, { elapse, command })
    console.log(stdout)
    console.error(stderr)
  })
}

module.exports = { ok, fail }
