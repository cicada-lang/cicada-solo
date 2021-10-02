import yargs from "yargs"
import { Command } from "./command"
import * as Commands from "./commands"

export function run(): void {
  register(new Commands.RunCommand(), { default: true })
  register(new Commands.ReplCommand())
  register(new Commands.CheckCommand())
  register(new Commands.SnapshotCommand())

  yargs.demandCommand()
  yargs.strict()
  yargs.parse()
}

function register(
  command: Command<unknown>,
  opts?: { default?: boolean }
): void {
  if (opts?.default) {
    yargs.command({
      ...command,
      command: command.signature,
      handler: command.handler,
      aliases: ["$0"],
    })
  } else {
    yargs.command({
      ...command,
      command: command.signature,
      handler: command.handler,
    })
  }
}
