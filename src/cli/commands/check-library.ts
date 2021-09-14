import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLoader } from "../../module"
import { createModuleRunner } from "../create-module-runner"
import chokidar from "chokidar"
import Path from "path"

export const command = "check-library <config-file>"
export const description = "Check all files in a library"

export const builder = {
  watch: { type: "boolean", default: false },
}

type Argv = {
  "config-file": string
  watch: boolean
}

export const handler = async (argv: Argv) => {
  const file_adapter = await LocalFileAdapter.from_config_file(
    argv["config-file"]
  )
  const library = new Library({ file_adapter })
  if (argv.watch) {
    await watch(library, file_adapter)
  } else {
    await check(library, file_adapter)
  }
}

async function check(library: Library, files: LocalFileAdapter): Promise<void> {
  let errors: Array<unknown> = []
  for (const path of Object.keys(await files.all())) {
    const runner = createModuleRunner({ path, library, files })
    const { error } = await runner.run(path, { by: "check" })
    if (error) {
      errors.push(error)
    }
  }

  if (errors.length !== 0) {
    process.exit(1)
  }
}

async function watch(library: Library, files: LocalFileAdapter): Promise<void> {
  const src_dir = Path.resolve(files.root_dir, files.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoader.can_load(file)) return

    const prefix = `${src_dir}/`
    const path = file.slice(prefix.length)
    library.mods.cache.delete(path)

    const runner = createModuleRunner({ path, library, files })
    await runner.run(path, { by: event })
  })
}
