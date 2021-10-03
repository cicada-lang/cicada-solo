import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import Path from "path"
import chalk from "chalk"

type Args = { file: string }

export class RunCommand extends Command<Args> {
  description = "Run a file -- support .md and .cic"

  args = { file: ty.string() }

  help(runner: CommandRunner): string {
    const name = chalk.blue("run")

    return [
      `The ${name} command runs file, and print top-level expressions.`,
      ``,
      chalk.blue(`  ${runner.name} run tests/trivial/sole.cic`),
    ].join("\n")
  }

  async execute(argv: Args): Promise<void> {
    Command.assertFile(argv["file"])
    const path = Path.resolve(argv["file"])
    const library = await app.libraries.findUpOrFake(Path.dirname(path))
    const runner = new Runners.DefaultRunner({ library })
    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}