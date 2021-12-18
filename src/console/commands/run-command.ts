import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import ty from "@xieyuheng/ty"
import watcher from "node-watch"
import Path from "path"
import app from "../../app/node-app"
import { Book } from "../../book"
import { Runner } from "../runner"
import { CommonRunner } from "../runners/common-runner"

type Args = { article: string }
type Opts = { watch?: boolean }

export class RunCommand extends Command<Args, Opts> {
  name = "run"

  description = "Run through an article"

  args = { article: ty.string() }
  opts = { watch: ty.optional(ty.boolean()) }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command runs through an article,`,
      `evaluating top-level expressions, and prints the results.`,
      ``,
      `It supports ${blue(".md")} and ${blue(".cic")} file extensions.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
      `You can use ${blue("--watch")} to let the program stand by, and react to changes.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    Command.assertFile(argv["article"])
    const book = await app.localBooks.findUpOrFake(
      Path.dirname(argv["article"])
    )
    const runner = new CommonRunner()
    const path = Path.resolve(argv["article"])
    if (argv["watch"]) {
      await runner.run(book, path, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })
      app.logger.info(`Initial run complete, now watching for changes.`)
      await watch(runner, book, path)
    } else {
      const { error } = await runner.run(book, path, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })
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
      const { error } = await runner.run(book, path, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })

      if (error) {
        app.logger.error({ tag: event, msg: path })
      } else {
        app.logger.info({ tag: event, msg: path })
      }
    }
  })
}
