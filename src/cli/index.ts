import * as CommandRunners from "@xieyuheng/enchanter/lib/command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "@xieyuheng/enchanter/lib/commands"

export function run(): void {
  new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: [
      new Commands.RunCommand(),
      new Commands.ReplCommand(),
      new Commands.CheckCommand(),
      new Commands.SnapshotCommand(),
      new CommonHelpCommand(),
    ],
  }).run()
}
