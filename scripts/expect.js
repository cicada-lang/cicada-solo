const exec = require("./exec")
const glob = require("glob")
const fs = require("fs")

function ok(prog, files, { echo, snapshot } = {}) {
  const results = glob
    .sync(files)
    .map((file) => exec(`${prog} ${file}`).then((the) => ({ ...the, file })))

  return Promise.all(results)
    .then((results) => {
      for (const the of results) {
        console.log()
        console.log(`[expect.ok]`)
        console.log(`prog: ${prog}`)
        console.log(`file: ${the.file}`)

        if (the.stdout && snapshot && snapshot.stdout) {
          console.log(`snapshot.stdout: ${the.file}${snapshot.stdout}`)
          fs.promises.writeFile(`${the.file}${snapshot.stdout}`, the.stdout)
        }

        if (the.stdout && echo && echo.stdout) {
          console.log()
          console.log(the.stdout)
        }

        if (the.stderr && echo && echo.stderr) {
          console.error()
          console.error(the.stderr)
        }
      }
    })
    .catch((error) => {
      console.error()
      console.error(error.message)
      process.exit(1)
    })
}

function fail(prog, files, { echo, snapshot } = {}) {
  const results = glob.sync(files).map((file) =>
    exec(`${prog} ${file}`)
      .then((the) => ({ ...the, file }))
      .catch((error) => ({ ...error, file }))
  )

  return Promise.all(results).then((results) => {
    for (const the of results) {
      console.log()
      console.log(`[expect.fail]`)
      console.log(`prog: ${prog}`)
      console.log(`file: ${the.file}`)

      if (the.stdout && snapshot && snapshot.stdout) {
        console.log(`snapshot.stdout: ${the.file}${snapshot.stdout}`)
        fs.promises.writeFile(`${the.file}${snapshot.stdout}`, the.stdout)
      }

      if (the.stdout && echo && echo.stdout) {
        console.log()
        console.log(the.stdout)
      }

      if (the.stderr && snapshot && snapshot.stderr) {
        console.error(`snapshot.stderr: ${the.file}${snapshot.stderr}`)
        fs.promises.writeFile(`${the.file}${snapshot.stderr}`, the.stderr)
      }

      if (the.stderr && echo && echo.stderr) {
        console.error()
        console.error(the.stderr)
      }
    }
  })
}

module.exports = { ok, fail }
