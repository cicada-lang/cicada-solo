const execute = require("./execute")
const files_unfold = require("./files-unfold")
const line_report = require("./line-report")
const chalk = require("chalk")
const fs = require("fs")

const OUT = chalk.bold.blue("[snapshot.out]")

function report(output, quiet) {
  if (!quiet) console.log(chalk.bold("  >>>"), output)
  return output
}

async function out(prog, files, { echo, snapshot, quiet } = {}) {
  for (const file of await files_unfold(files)) {
    const command = `${prog} ${file}`
    execute(command).then(({ stdout, stderr, elapse, error }) => {
      line_report(OUT, { elapse, command })
      if (stdout)
        fs.promises.writeFile(
          report(snapshot?.out || `${file}.out`, quiet),
          stdout
        )
      if (stdout && echo) console.log(stdout)
      if (error) {
        console.error(error.message)
        process.exit(1)
      }
    })
  }
}

const ERR = chalk.bold.yellow("[snapshot.err]")

async function err(prog, files, { echo, snapshot, quiet } = {}) {
  for (const file of await files_unfold(files)) {
    const command = `${prog} ${file}`
    execute(command).then(({ stdout, stderr, elapse }) => {
      line_report(ERR, { elapse, command })
      if (stdout)
        fs.promises.writeFile(
          report(snapshot?.out || `${file}.out`, quiet),
          stdout
        )
      if (stderr)
        fs.promises.writeFile(
          report(snapshot?.err || `${file}.err`, quiet),
          stderr
        )
      if (stdout && echo) console.log(stdout)
      if (stderr && echo) console.error(stderr)
    })
  }
}

module.exports = { out, err }
