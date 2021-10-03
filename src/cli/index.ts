import * as CommandRunners from "./command-runners"
import * as Commands from "./commands"

export function run(): void {
  const runner = new CommandRunners.CommonCommandRunner({
    commands: {
      run: new Commands.RunCommand(),
      repl: new Commands.ReplCommand(),
      check: new Commands.CheckCommand(),
      snapshot: new Commands.SnapshotCommand(),
      help: new Commands.HelpCommand(),
    },
    default: new Commands.DefaultCommand(),
  })

  runner.run()
}
