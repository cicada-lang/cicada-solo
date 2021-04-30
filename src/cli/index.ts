import yargs from "yargs"

export function run(): void {
  yargs.commandDir("commands").demandCommand().strict().parse()
}
