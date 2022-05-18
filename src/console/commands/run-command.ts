import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import fs from "fs"
import watcher from "node-watch"
import Path from "path"
import app from "../../app/node-app"
import { Runner } from "../runner"

type Args = { article: string }
type Opts = { watch?: boolean }

export class RunCommand extends Command<Args, Opts> {
  name = "run"

  description = "Run through an article"

  args = { article: ty.string() }
  opts = { watch: ty.optional(ty.boolean()) }

  runner = new Runner()

  constructor() {
    super()
  }

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
      `We can also run a URL directly.`,
      ``,
      blue(`  ${runner.name} ${this.name} "https://readonly.link/files/cicada-lang/cicada/-/docs/manual/datatypes/01-nat.md"`),
      ``,
      `You can use ${blue("--watch")} to let the program stand by, and react to changes.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const url = createURL(argv["article"])
    if (argv["watch"]) {
      await this.runner.run(url)

      if (url.protocol === "file:") {
        app.logger.info(`Initial run complete, now watching for changes.`)
        await this.watch(url.pathname)
      } else {
        app.logger.info(`Can not watch non-local file.`)
      }
    } else {
      const { error } = await this.runner.run(url)
      if (error) {
        process.exit(1)
      }
    }
  }

  async watch(path: string): Promise<void> {
    watcher(path, async (event, file) => {
      const url = new URL(`file:${path}`)

      if (event === "remove") {
        this.runner.loader.cache.delete(url.href)
        app.logger.info({ tag: event, msg: path })
        process.exit(1)
      }

      if (event === "update") {
        this.runner.loader.cache.delete(url.href)
        const { error } = await this.runner.run(url)

        if (error) {
          app.logger.error({ tag: event, msg: path })
        } else {
          app.logger.info({ tag: event, msg: path })
        }
      }
    })
  }
}

function createURL(path: string): URL {
  if (ty.uri().isValid(path)) {
    return new URL(path)
  }

  if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    const fullPath = Path.resolve(path)
    return new URL(`file:${fullPath}`)
  }

  throw new Error(`I can not create URL from path: ${path}`)
}
