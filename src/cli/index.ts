import * as CommandRunners from "../infra/command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "../infra/commands"

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
