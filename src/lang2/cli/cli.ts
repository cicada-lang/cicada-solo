import * as cle_eval from "./cli-eval"
import yargs from "yargs"

export function run(): void {
  const argv = yargs.parse()
  for (const file of argv._) {
    cle_eval.run(file)
  }
}
