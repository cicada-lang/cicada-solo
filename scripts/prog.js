const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)
const fs = require("fs")
const glob = require("glob")

function test(prog, { files, echo, snapshot }) {
  const results = glob
    .sync(files)
    .map((file) => exec(`${prog} ${file}`).then((the) => ({ ...the, file })))

  return Promise.all(results)
    .then((results) => {
      for (const the of results) {
        console.log()
        console.log(`[test]`)
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

function test_error(prog, { files, echo, snapshot }) {
  const results = glob.sync(files).map((file) =>
    exec(`${prog} ${file}`)
      .then((the) => ({ ...the, file }))
      .catch((error) => ({ ...error, file }))
  )

  return Promise.all(results).then((results) => {
    for (const the of results) {
      console.log()
      console.log(`[test_error]`)
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

module.exports = {
  test,
  test_error,
}
