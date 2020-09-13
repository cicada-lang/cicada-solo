import * as cli_eval from "./cli-eval"
const yargs = require("yargs")

export function run(): void {
  const argv = yargs.parse()
  for (const file of argv._) {
    cli_eval.run(file)
  }
}
