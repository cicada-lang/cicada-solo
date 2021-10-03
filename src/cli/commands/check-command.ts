import { Command } from "../../infra/command"
import { Library } from "../../library"
import { Logger } from "../../runner/logger"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import ty from "@xieyuheng/ty"
import watcher from "node-watch"
import fs from "fs"

type Args = { library?: string }
type Opts = { watch?: boolean }

export class CheckCommand extends Command<Args, Opts> {
  description = "Check a library -- by cwd, dir or library.json"
  args = { library: ty.optional(ty.string()) }
  opts = { watch: ty.optional(ty.boolean()) }

  async execute(argv: Args & Opts): Promise<void> {
    const path = argv["library"] || process.cwd() + "/library.json"
    Command.assertExists(path)
    const config_file = fs.lstatSync(path).isFile()
      ? path
      : path + "/library.json"
    const library = await app.libraries.get(config_file)
    console.log(library.info())
    console.log()

    await check(library)

    if (argv["watch"]) {
      const logger = new Logger({ tag: "info" })
      logger.info({ msg: `Initial check complete, now watching for changes.` })
      await watch(library)
    }
  }
}

async function check(library: Library): Promise<void> {
  let errors: Array<unknown> = []
  for (const path of Object.keys(await library.files.all())) {
    if (ModuleLoaders.can_handle_extension(path)) {
      const logger = new Logger({ tag: "check" })
      const runner = Runners.create_special_runner({ path, library, logger })
      const { error } = await runner.run(path)
      if (error) {
        errors.push(error)
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error(error)
        }
      }
    }
  }

  if (errors.length !== 0) {
    process.exit(1)
  }
}

async function watch(library: Library): Promise<void> {
  const dir = library.files.root

  watcher(dir, { recursive: true }, async (event, file) => {
    if (!file) return
    if (!ModuleLoaders.can_handle_extension(file)) return

    const prefix = `${dir}/`
    const path = file.slice(prefix.length)

    if (event === "remove") {
      library.cache.delete(path)
      const logger = new Logger({ tag: event })
      logger.info({ msg: path })
    }

    if (event === "update") {
      library.cache.delete(path)
      const logger = new Logger({ tag: event })
      const runner = Runners.create_special_runner({ path, library, logger })
      await runner.run(path)
    }
  })
}
