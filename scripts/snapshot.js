const execute = require("./execute")
const glob = require("glob")
const fs = require("fs")

function out(prog, files, { echo, snapshot } = {}) {
  glob.sync(files).map((file) => {
    execute(`${prog} ${file}`).then(({ stdout, stderr, error }) => {
      console.log(`[snapshot.out] ${prog} ${file}`)
      if (stdout) fs.promises.writeFile(`${file}.out`, stdout)
      if (stderr) fs.promises.writeFile(`${file}.err`, stderr)
      if (stdout && echo) console.log(stdout)
      if (stderr && echo) console.error(stderr)
      if (error) {
        console.error(error.message)
        process.exit(1)
      }
    })
  })
}

function err(prog, files, { echo, snapshot } = {}) {
  glob.sync(files).map((file) =>
    execute(`${prog} ${file}`).then(({ stdout, stderr, error }) => {
      console.log(`[snapshot.err] ${prog} ${file}`)
      if (stdout) fs.promises.writeFile(`${file}.out`, stdout)
      if (stderr) fs.promises.writeFile(`${file}.err`, stderr)
      if (stdout && echo) console.log(stdout)
      if (stderr && echo) console.error(stderr)
    })
  )
}

module.exports = { out, err }
