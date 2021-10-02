import { CommandRunner } from "../command-runner"
import { Command } from "../command"
import yargs from "yargs"

export class YargsCommandRunner extends CommandRunner {
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
