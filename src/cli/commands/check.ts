import { Library } from "../../library"
import { LocalFileResource } from "../../file-resources"
import { Logger } from "../../runner/logger"
import { libraryConfigSchema } from "../../library"
import * as ModuleLoaders from "../../module-loaders"
import * as Runners from "../../runners"
import chokidar from "chokidar"
import Path from "path"
import fs from "fs"

export const command = "check [library]"
export const description = "Check a library -- by cwd, dir or library.json"
export const builder = {
  watch: { type: "boolean", default: false },
}

type Argv = {
  library?: string
  watch: boolean
}

export const handler = async (argv: Argv) => {
  if (argv["library"] && !fs.existsSync(argv["library"])) {
    console.error(`The given file or dir does not exist: ${argv["library"]}`)
    process.exit(1)
  }

  const config_file = argv["library"]
    ? fs.lstatSync(argv["library"]).isFile()
      ? argv["library"]
      : argv["library"] + "/library.json"
    : process.cwd() + "/library.json"

  const config = libraryConfigSchema.validate(
    JSON.parse(await fs.promises.readFile(config_file, "utf8"))
  )
  const files = await LocalFileResource.build(config_file)
  const library = new Library({ files, config })

  console.log(library.info())
  console.log()

  if (argv.watch) {
    await watch(library, files)
  } else {
    await check(library, files)
  }
}

async function check(
  library: Library,
  files: LocalFileResource
): Promise<void> {
  let errors: Array<unknown> = []
  for (const path of Object.keys(await files.all())) {
    const logger = new Logger({ tag: "check" })
    const runner = Runners.create_special_runner({
      path,
      library,
      files,
      logger,
    })
    const { error } = await runner.run(path)
    if (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }

      errors.push(error)
    }
  }

  if (errors.length !== 0) {
    process.exit(1)
  }
}

async function watch(
  library: Library,
  files: LocalFileResource
): Promise<void> {
  const src_dir = Path.resolve(files.root, files.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoaders.can_handle_extension(file)) return

    const prefix = `${src_dir}/`
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
