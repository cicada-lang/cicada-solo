import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import fs from "fs"
import watcher from "node-watch"
import Path from "path"
import readdirp from "readdirp"
import app from "../../app/node-app"
import * as BlockParsers from "../../lang/block/block-parsers"
import { ModLoader } from "../../lang/mod"
import { BookConfigSchema } from "../../types"
import { Runner } from "../runner"

type Args = { book?: string }
type Opts = { watch?: boolean }

export class CheckCommand extends Command<Args, Opts> {
  name = "check"

  description = "Check the typing of a book"

  args = { book: ty.optional(ty.string()) }
  opts = { watch: ty.optional(ty.boolean()) }

  loader = new ModLoader()

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
    const configText = await fs.promises.readFile(configFile, "utf8")
    const config = BookConfigSchema.validate(JSON.parse(configText))
    const root = Path.resolve(Path.dirname(configFile), config.src || "")

    app.logger.info(config)

    if (argv["watch"]) {
      await check(root)
      app.logger.info(`Initial check complete, now watching for file changes.`)
      await this.watch(root)
    } else {
      const { errors } = await check(root)
      if (errors.length > 0) {
        process.exit()
      }
    }
  }

  async watch(dir: string): Promise<void> {
    watcher(dir, { recursive: true }, async (event, file) => {
      if (!file) return
      if (!BlockParsers.canHandle(file)) return

      const prefix = `${dir}/`
      const path = file.slice(prefix.length)
      const fullPath = Path.resolve(dir, path)
      const url = new URL(`file:${fullPath}`)

      if (event === "remove") {
        this.loader.cache.delete(url.href)
        app.logger.info({ tag: event, msg: path })
      }

      if (event === "update") {
        const t0 = Date.now()
        const runner = new Runner()
        this.loader.cache.delete(url.href)
        const { error } = await runner.run(url)
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
}

async function check(root: string): Promise<{ errors: Array<unknown> }> {
  let errors: Array<unknown> = []

  for (const { path } of await readdirp.promise(root)) {
    if (BlockParsers.canHandle(path)) {
      const fullPath = Path.resolve(root, path)
      const url = new URL(`file:${fullPath}`)
      const t0 = Date.now()
      const runner = new Runner()
      const { error } = await runner.run(url, { silent: true })
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
