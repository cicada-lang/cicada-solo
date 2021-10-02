import { Command } from "../command"
import { Library } from "../../library"
import { LocalFileStore } from "../../file-stores"
import { Logger } from "../../runner/logger"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import chokidar from "chokidar"
import Path from "path"
import fs from "fs"

type Argv = {
  library?: string
  watch: boolean
}

export class CheckCommand extends Command<Argv> {
  command = "check [library]"
  description = "Check a library -- by cwd, dir or library.json"
  builder: any = {
    watch: { type: "boolean", default: false },
  }

  async handler(argv: Argv): Promise<void> {
    if (argv["library"] && !fs.existsSync(argv["library"])) {
      console.error(`The given file or dir does not exist: ${argv["library"]}`)
      process.exit(1)
    }

    const config_file = argv["library"]
      ? fs.lstatSync(argv["library"]).isFile()
        ? argv["library"]
        : argv["library"] + "/library.json"
      : process.cwd() + "/library.json"

    const config = Library.config_schema.validate(
      JSON.parse(await fs.promises.readFile(config_file, "utf8"))
    )
    const files = new LocalFileStore({
      dir: Path.resolve(Path.dirname(config_file), config.src),
    })
    const library = new Library({ files, config })

    console.log(library.info())
    console.log()

    if (argv.watch) {
      await watch(library, files)
    } else {
      await check(library, files)
    }
  }
}

async function check(library: Library, files: LocalFileStore): Promise<void> {
  let errors: Array<unknown> = []
  for (const path of Object.keys(await files.all())) {
    if (ModuleLoaders.can_handle_extension(path)) {
      const logger = new Logger({ tag: "check" })
      const runner = Runners.create_special_runner({
        path,
        library,
        files,
        logger,
      })
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

async function watch(library: Library, files: LocalFileStore): Promise<void> {
  const watcher = chokidar.watch(files.dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoaders.can_handle_extension(file)) return

    const prefix = `${files.dir}/`
    const path = file.slice(prefix.length)

    library.cache.delete(path)

    const logger = new Logger({ tag: event })
    const runner = Runners.create_special_runner({
      path,
      library,
      files,
      logger,
    })

    await runner.run(path)
  })
}
