const yargs = require("yargs")

export function run(): void {
  yargs.commandDir("commands").demandCommand().strict().parse()
}
