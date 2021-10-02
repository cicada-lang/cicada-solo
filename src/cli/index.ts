import * as CommandRunners from "./command-runners"
import * as Commands from "./commands"

export function run(): void {
  // const runner = new CommandRunners.YargsCommandRunner()
  const runner = new CommandRunners.CommonCommandRunner()

  runner.register("default", new Commands.DefaultCommand())
  runner.register("run", new Commands.RunCommand())
  runner.register("repl", new Commands.ReplCommand())
  runner.register("check", new Commands.CheckCommand())
  runner.register("snapshot", new Commands.SnapshotCommand())

  runner.run()
}
