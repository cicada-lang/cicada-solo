const execute = require("./execute")
const chalk = require("chalk")
const fg = require("fast-glob")
const fs = require("fs")

async function out(prog, files, { echo, snapshot } = {}) {
  for (const file of fg.sync(files)) {
    execute(`${prog} ${file}`).then(({ stdout, stderr, error }) => {
      const head = chalk.bold.blue("[snapshot.out]")
      console.log(`${head} ${prog} ${file}`)
      if (stdout) fs.promises.writeFile(`${file}.out`, stdout)
      if (stderr) fs.promises.writeFile(`${file}.err`, stderr)
      if (stdout && echo) console.log(stdout)
      if (stderr && echo) console.error(stderr)
      if (error) {
        console.error(error.message)
        process.exit(1)
      }
    })
  }
}

async function err(prog, files, { echo, snapshot } = {}) {
  for (const file of fg.sync(files)) {
    execute(`${prog} ${file}`).then(({ stdout, stderr }) => {
      const head = chalk.bold.red("[snapshot.err]")
      console.log(`${head} ${prog} ${file}`)
      if (stdout) fs.promises.writeFile(`${file}.out`, stdout)
      if (stderr) fs.promises.writeFile(`${file}.err`, stderr)
      if (stdout && echo) console.log(stdout)
      if (stderr && echo) console.error(stderr)
    })
  }
}

module.exports = { out, err }
