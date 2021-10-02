import { YargsCommandRunner } from "./command-runners"
import * as Commands from "./commands"

export function run(): void {
  const runner = new YargsCommandRunner()

  runner.register(new Commands.DefaultCommand())
  runner.register(new Commands.RunCommand())
  runner.register(new Commands.ReplCommand())
  runner.register(new Commands.CheckCommand())
  runner.register(new Commands.SnapshotCommand())

  runner.run()
}
