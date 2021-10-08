import { Command } from "@xieyuheng/enchanter/lib/command"
import { CommandRunner } from "@xieyuheng/enchanter/lib/command-runner"
import { Library } from "../../library"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import * as ut from "../../ut"
import watcher from "node-watch"
import ty from "@xieyuheng/ty"
import fs from "fs"

type Args = { library?: string }
type Opts = { watch?: boolean }

export class CheckCommand extends Command<Args, Opts> {
  name = "check"

  description = "Check a library -- by cwd, dir or library.json"

  args = { library: ty.optional(ty.string()) }
  opts = { watch: ty.optional(ty.boolean()) }

  // prettier-ignore
  help(runner: CommandRunner): string {
    return [
      `The ${ut.colors.blue(this.name)} command checks a library.`,
      ``,
      `You can specify a library by a path to its library.json config file,`,
      `or a path to a directory which contains the config file,`,
      `and if no path are given, the current working directory will be used.`,
      ``,
      ut.colors.blue(`  ${runner.name} ${this.name} libraries/cicada-stdlib`),
      ut.colors.blue(`  ${runner.name} ${this.name} libraries/cicada-stdlib/library.json`),
      ut.colors.blue(`  ${runner.name} ${this.name} libraries/the-little-typer --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const path = argv["library"] || process.cwd() + "/library.json"
    Command.assertExists(path)
    const config_file = fs.lstatSync(path).isFile()
      ? path
      : path + "/library.json"
    const library = await app.libraries.get(config_file)

    app.logger.info(library.config)

    if (argv["watch"]) {
      await check(library)
      app.logger.info(`Initial check complete, now watching for file changes.`)
      await watch(library)
    } else {
      const { errors } = await check(library)
      if (errors.length > 0) {
        process.exit()
      }
    }
  }
}

async function check(
  library: Library<LocalFileStore>
): Promise<{ errors: Array<unknown> }> {
  let errors: Array<unknown> = []

  for (const path of Object.keys(await library.files.all())) {
    if (ModuleLoaders.can_handle_extension(path)) {
      const t0 = Date.now()
      const runner = app.createLocalRunner({ path, library })
      const { error } = await runner.run(path)
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

async function watch(library: Library<LocalFileStore>): Promise<void> {
  const dir = library.files.root

  watcher(dir, { recursive: true }, async (event, file) => {
    if (!file) return
    if (!ModuleLoaders.can_handle_extension(file)) return

    const prefix = `${dir}/`
    const path = file.slice(prefix.length)

    if (event === "remove") {
      library.cache.delete(path)
      app.logger.info({ tag: event, msg: path })
    }

    if (event === "update") {
      const t0 = Date.now()
      library.cache.delete(path)
      const runner = app.createLocalRunner({ path, library })
      const { error } = await runner.run(path)
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
