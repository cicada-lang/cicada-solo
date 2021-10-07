import { Command } from "../../infra/command"
import { CommandRunner } from "../../infra/command-runner"
import * as Runners from "../../runners"
import { Runner } from "../../runner"
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
      await watch(runner, path)
    } else {
      const { error } = await runner.run(path)
      if (error) {
        process.exit(1)
      }
    }
  }
}

async function watch(runner: Runner, path: string): Promise<void> {
  watcher(runner.library.files.resolve(path), async (event, file) => {
    if (event === "remove") {
      runner.library.cache.delete(path)
      app.logger.info({ tag: event, msg: path })
      process.exit(1)
    }

    if (event === "update") {
      runner.library.cache.delete(path)
      const { error } = await runner.run(path)

      if (error) {
        app.logger.error({ tag: event, msg: path })
      } else {
        app.logger.info({ tag: event, msg: path })
      }
    }
  })
}
