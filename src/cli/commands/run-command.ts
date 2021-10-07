import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import * as ut from "../../ut"
import watcher from "node-watch"
import ty from "@xieyuheng/ty"
import Path from "path"

type Args = { file: string }
type Opts = { watch?: boolean }

export class RunCommand extends Command<Args, Opts> {
  name = "run"

  description = "Run a file -- support .md and .cic"

  args = { file: ty.string() }
  opts = { watch: ty.optional(ty.boolean()) }

  help(runner: CommandRunner): string {
    const name = ut.colors.blue("run")

    return [
      `The ${name} command runs file, and print top-level expressions.`,
      ``,
      ut.colors.blue(`  ${runner.name} run tests/trivial/sole.cic`),
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    Command.assertFile(argv["file"])
    const library = await app.libraries.findUpOrFake(Path.dirname(argv["file"]))
    const runner = new Runners.DefaultRunner({ library })
    const path = Path.basename(argv["file"])

    if (argv["watch"]) {
      await runner.run(path)
      app.logger.info(`Initial run complete, now watching for file changes.`)
      watcher(library.files.resolve(path), async (event, file) => {
        if (event === "remove") {
          library.cache.delete(path)
          app.logger.info(`(${event}) ${path}`)
          process.exit(1)
        }

        if (event === "update") {
          library.cache.delete(path)
          const { error } = await runner.run(path)

          if (error) {
            app.logger.error(`(${event}) ${path}`)
          } else {
            app.logger.info(`(${event}) ${path}`)
          }
        }
      })
    } else {
      const { error } = await runner.run(path)
      if (error) {
        process.exit(1)
      }
    }
  }
}
