import fs from "fs"
import path from "path"

import commander from "commander"

export abstract class CommandLine {
  abstract name(): string
  abstract version(): string
  abstract run_code(code: string): void

  run_file(file_path: string): void {
    file_path = path.join(process.cwd(), file_path)

    fs.readFile(file_path, { encoding: "utf-8" }, (error, code) => {
      if (!error) {
        this.run_code(code)
      } else {
        console.log(error)
      }
    })
  }

  run(): void {
    const program = new commander.Command()

    program
      .name(this.name())
      .version(this.version())
      .option(
        "-e, --eval <file>", "file to eval",
        (file: string, files: Array<string>) => files.concat([file]),
        [])
      .parse(process.argv)

    let opts = program.opts()

    for (let file of opts.eval) {
      this.run_file(file)
    }
  }

}
