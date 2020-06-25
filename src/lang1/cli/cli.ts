import commander from "commander"

export function run(config: any): void {
  const program = new commander.Command()

  program.name("").version(config.version, "-v, --version")

  program.command("eval <input-file>").action(require("./cli-eval").run)

  program.parse(process.argv)
}
