const chalk = require("chalk")

function format_elapse(elapse) {
  return chalk.bold.green(`[${elapse}ms]`)
}

function line_report(head, { command, elapse }) {
  console.log(head, format_elapse(elapse), command)
}

module.exports = line_report
