import * as CommandRunners from "../infra/command-runners"
import * as Commands from "./commands"
import { CommonHelpCommand } from "../infra/commands"

export function run(): void {
  const runner = new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.DefaultCommand(),
    commands: {
      run: new Commands.RunCommand(),
      repl: new Commands.ReplCommand(),
      check: new Commands.CheckCommand(),
      snapshot: new Commands.SnapshotCommand(),
      help: new CommonHelpCommand(),
    },
  })

  runner.run()
}
