import * as CommandRunners from "@enchanterjs/enchanter/lib/command-runners"
import { CommonHelpCommand } from "@enchanterjs/enchanter/lib/commands"
import * as Commands from "./commands"

export function run(): void {
  new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: [
      new Commands.ReplCommand(),
      new Commands.RunCommand(),
      new Commands.SnapshotCommand(),
      new Commands.CheckCommand(),
      new CommonHelpCommand(),
    ],
  }).run()
}
