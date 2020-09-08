import * as cle_eval from "./cli-eval"

const argv = require("yargs").argv

export function run(): void {
  for (const file of argv._) cle_eval.run(file)
}
