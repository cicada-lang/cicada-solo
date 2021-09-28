import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { ModuleLoader } from "../../module"
import { Logger } from "../../api"
import { Runners } from "../../api"
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

  const config = argv["library"]
    ? fs.lstatSync(argv["library"]).isFile()
      ? argv["library"]
      : argv["library"] + "/library.json"
    : process.cwd() + "/library.json"
  const files = await LocalFileResource.build(config)
  const library = new Library({ files })

  console.log(library.info())

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
    const runner = Runners.createSpecialRunner({ path, library, files, logger })
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
  const src_dir = Path.resolve(files.root_dir, files.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoader.can_handle(file)) return

    const prefix = `${src_dir}/`
    const path = file.slice(prefix.length)

    library.cache.delete(path)

    const logger = new Logger({ tag: event })
    const runner = Runners.createSpecialRunner({ path, library, files, logger })
    await runner.run(path)
  })
}
