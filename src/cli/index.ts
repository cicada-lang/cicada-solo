import * as CommandRunners from "@xieyuheng/enchanter/lib/command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "@xieyuheng/enchanter/lib/commands"

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
