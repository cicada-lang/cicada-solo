import { Command } from "@xieyuheng/enchanter/lib/command"
import { CommandRunner } from "@xieyuheng/enchanter/lib/command-runner"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import * as Runners from "../../runners"
import { Runner } from "../../runner"
import { Book } from "../../book"
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

  // prettier-ignore
  help(runner: CommandRunner): string {
    return [
      `The ${ut.colors.blue(this.name)} command runs file, and print top-level expressions.`,
      ``,
      ut.colors.blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    Command.assertFile(argv["file"])
    const book = await app.books.findUpOrFake(Path.dirname(argv["file"]))
    const runner = new Runners.DefaultRunner({ book })
    const path = Path.basename(argv["file"])

    if (argv["watch"]) {
      await runner.run(path)
      app.logger.info(`Initial run complete, now watching for file changes.`)
      await watch(runner, book, path)
    } else {
      const { error } = await runner.run(path)
      if (error) {
        process.exit(1)
      }
    }
  }
}

async function watch(
  runner: Runner,
  book: Book<LocalFileStore>,
  path: string
): Promise<void> {
  watcher(book.files.resolve(path), async (event, file) => {
    if (event === "remove") {
      book.cache.delete(path)
      app.logger.info({ tag: event, msg: path })
      process.exit(1)
    }

    if (event === "update") {
      book.cache.delete(path)
      const { error } = await runner.run(path)

      if (error) {
        app.logger.error({ tag: event, msg: path })
      } else {
        app.logger.info({ tag: event, msg: path })
      }
    }
  })
}
