import yargs from "yargs"
import { Command } from "../command"

export class YargsCommandRunner {
  run(): void {
    yargs.demandCommand()
    yargs.strict()
    yargs.parse()
  }

  register(command: Command<unknown>, opts?: { default?: boolean }): void {
    if (opts?.default) {
      yargs.command({
        ...command,
        command: command.signature,
        builder: command.options,
        handler: command.execute,
        aliases: ["$0"],
      })
    } else {
      yargs.command({
        ...command,
        command: command.signature,
        builder: command.options,
        handler: command.execute,
      })
    }
  }
}
