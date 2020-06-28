import commander from "commander"
import * as cle_check from "./cli-check"
import * as cle_eval from "./cli-eval"

export function run(config: any): void {
  const program = new commander.Command()

  program.name("lang1").version(config.version, "-v, --version")

  program.command("check <input-file>").action(cle_check.run)
  program.command("eval <input-file>").action(cle_eval.run)

  program.parse(process.argv)
}
