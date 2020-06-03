import fs from "fs"
import commander from "commander"

export class CommandLineInterface {
  constructor(
    public name: string,
    public version: string,
    public run_code: (code: string, config: { [key: string]: any }) => void
  ) {}

  run_file(file_path: string, config: { [key: string]: any }): void {
    let code = fs.readFileSync(file_path, { encoding: "utf-8" })
    this.run_code(code, config)
  }

  run(): void {
    const program = new commander.Command()

    program
      .name(this.name)
      .version(this.version, "-v, --version", "output the current version")
      .option("--verbose", "print more during eval")
      .option(
        "-e, --eval <file>",
        "file to eval",
        (file: string, files: Array<string>) => files.concat([file]),
        []
      )
      .parse(process.argv)

    let opts = program.opts()

    for (let file of opts.eval) {
      this.run_file(file, opts)
    }
  }
}
