const util = require("util")
const child_process = require("child_process")
const exec = util.promisify(child_process.exec)
const fs = require("fs")
const glob = require("glob")

function test_prog(prog, pattern, ext, opts) {
  const results = glob
    .sync(pattern)
    .filter((file) => file.endsWith(ext))
    .map((file) => exec(`${prog} ${file}`).then((the) => ({ ...the, file })))

  return Promise.all(results)
    .then((results) => {
      for (const the of results) {
        console.log(`test_prog:`)
        console.log(`  prog: ${prog}`)
        console.log(`  file: ${the.file}`)

        if (the.stdout && opts && opts.snapshot && opts.snapshot.stdout) {
          console.log(`  snapshot.stdout: ${the.file}${opts.snapshot.stdout}`)
          fs.promises.writeFile(
            `${the.file}${opts.snapshot.stdout}`,
            the.stdout
          )
        }

        if (the.stdout && opts && opts.echo && opts.echo.stdout) {
          console.log()
          console.log(the.stdout)
        }

        if (the.stderr && opts && opts.echo && opts.echo.stderr) {
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

function test_prog_error(prog, pattern, ext, opts) {
  const results = glob
    .sync(pattern)
    .filter((file) => file.endsWith(ext))
    .map((file) =>
      exec(`${prog} ${file}`)
        .then((the) => ({ ...the, file }))
        .catch((error) => ({ ...error, file }))
    )

  return Promise.all(results).then((results) => {
    for (const the of results) {
      console.log(`test_prog_error:`)
      console.log(`  prog: ${prog}`)
      console.log(`  file: ${the.file}`)

      if (the.stdout && opts && opts.snapshot && opts.snapshot.stdout) {
        console.log(`  snapshot.stdout: ${the.file}${opts.snapshot.stdout}`)
        fs.promises.writeFile(`${the.file}${opts.snapshot.stdout}`, the.stdout)
      }

      if (the.stdout && opts && opts.echo && opts.echo.stdout) {
        console.log()
        console.log(the.stdout)
      }

      if (the.stderr && opts && opts.snapshot && opts.snapshot.stderr) {
        console.error(`  snapshot.stderr: ${the.file}${opts.snapshot.stderr}`)
        fs.promises.writeFile(`${the.file}${opts.snapshot.stderr}`, the.stderr)
      }

      if (the.stderr && opts && opts.echo && opts.echo.stderr) {
        console.error()
        console.error(the.stderr)
      }
    }
  })
}

module.exports = {
  test_prog, test_prog_error
}
