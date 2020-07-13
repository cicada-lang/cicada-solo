import commander from "commander"
import * as cle_eval from "./cli-eval"

export function run(config: any): void {
  const program = new commander.Command()

  program.name("lang2").version(config.version, "-v, --version")

  program.command("eval <input-file>").action(cle_eval.run)

  program.parse(process.argv)
}
