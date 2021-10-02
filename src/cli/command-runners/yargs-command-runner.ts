import { CommandRunner } from "../command-runner"
import { Command } from "../command"
import yargs from "yargs"

export class YargsCommandRunner extends CommandRunner {
  run(): void {
    yargs.demandCommand()
    yargs.strict()
    yargs.parse()
  }

  register(command: Command<unknown>): void {
    yargs.command({
      ...command,
      command: command.signature,
      builder: command.options,
      handler: command.execute,
    })
  }
}
