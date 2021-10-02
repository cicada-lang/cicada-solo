import { Command } from "../command"
import { Library } from "../../library"
import { Logger } from "../../runner/logger"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import app from "../../app/node-app"
import chokidar from "chokidar"
import fs from "fs"

type Argv = { library?: string; watch: boolean }

export class CheckCommand extends Command<Argv> {
  signature = "check [library]"
  description = "Check a library -- by cwd, dir or library.json"
  options: any = { watch: { type: "boolean", default: false } }

  async execute(argv: Argv): Promise<void> {
    const path = argv["library"] || process.cwd() + "/library.json"
    Command.assertExists(path)
    const config_file = fs.lstatSync(path).isFile()
      ? path
      : path + "/library.json"
    const library = await app.libraries.get(config_file)
    console.log(library.info())
    console.log()

    if (argv.watch) {
      await watch(library)
    } else {
      await check(library)
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
  const watcher = chokidar.watch(dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoaders.can_handle_extension(file)) return
    const prefix = `${dir}/`
    const path = file.slice(prefix.length)
    library.cache.delete(path)
    const logger = new Logger({ tag: event })
    const runner = Runners.create_special_runner({ path, library, logger })
    await runner.run(path)
  })
}
