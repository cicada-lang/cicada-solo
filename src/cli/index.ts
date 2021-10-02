import { CommandRunner } from "./command-runner"
import * as Commands from "./commands"

export function run(): void {
  const runner = new CommandRunner()

  runner.register(new Commands.RunCommand(), { default: true })
  runner.register(new Commands.ReplCommand())
  runner.register(new Commands.CheckCommand())
  runner.register(new Commands.SnapshotCommand())

  runner.run()
}
