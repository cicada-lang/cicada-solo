import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import ty from "@xieyuheng/ty"
import fs from "fs"
import watcher from "node-watch"
import app from "../../app/node-app"
import { Book } from "../../book"
import * as CodeBlockParsers from "../../module/code-block-parsers"
import { LocalRunner } from "../runners/local-runner"

type Args = { book?: string }
type Opts = { watch?: boolean }

export class CheckCommand extends Command<Args, Opts> {
  name = "check"

  description = "Check the typing of a book"

  args = { book: ty.optional(ty.string()) }
  opts = { watch: ty.optional(ty.boolean()) }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command checks a book.`,
      ``,
      `You can specify a book by a path to its ${blue("book.json")},`,
      `or a path to a directory which contains the config file,`,
      `and if no path are given, the current working directory will be used.`,
      ``,
      blue(`  ${runner.name} ${this.name} books/group`),
      blue(`  ${runner.name} ${this.name} books/group/book.json`),
      ``,
      `You can use ${blue("--watch")} to let the program stand by, and react to changes.`,
      ``,
      blue(`  ${runner.name} ${this.name} books/the-little-typer --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const path = argv["book"] || process.cwd() + "/book.json"
    Command.assertExists(path)
    const configFile = fs.lstatSync(path).isFile() ? path : path + "/book.json"
    const book = await app.localBooks.get(configFile)

    app.logger.info(book.config.json())

    if (argv["watch"]) {
      await check(book)
      app.logger.info(`Initial check complete, now watching for file changes.`)
      await watch(book)
    } else {
      const { errors } = await check(book)
      if (errors.length > 0) {
        process.exit()
      }
    }
  }
}

async function check(
  book: Book<LocalFileStore>
): Promise<{ errors: Array<unknown> }> {
  let errors: Array<unknown> = []

  for (const path of await book.files.keys()) {
    if (CodeBlockParsers.canHandle(path)) {
      const t0 = Date.now()
      const runner = new LocalRunner()
      const { error } = await runner.run(book, path, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })
      if (error) errors.push(error)
      const t1 = Date.now()
      const elapse = t1 - t0
      if (error) {
        app.logger.error({ tag: "check", elapse, msg: path })
      } else {
        app.logger.info({ tag: "check", elapse, msg: path })
      }
    }
  }

  return { errors }
}

async function watch(book: Book<LocalFileStore>): Promise<void> {
  const dir = book.files.root

  watcher(dir, { recursive: true }, async (event, file) => {
    if (!file) return
    if (!CodeBlockParsers.canHandle(file)) return

    const prefix = `${dir}/`
    const path = file.slice(prefix.length)

    if (event === "remove") {
      book.cache.delete(path)
      app.logger.info({ tag: event, msg: path })
    }

    if (event === "update") {
      const t0 = Date.now()
      book.cache.delete(path)
      const runner = new LocalRunner()
      const { error } = await runner.run(book, path, {
        observers: app.defaultCtxObservers,
        highlighter: app.defaultHighlighter,
      })
      const t1 = Date.now()
      const elapse = t1 - t0
      if (error) {
        app.logger.error({ tag: event, elapse, msg: path })
      } else {
        app.logger.info({ tag: event, elapse, msg: path })
      }
    }
  })
}
