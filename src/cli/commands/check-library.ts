import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { ModuleLoader } from "../../module"
import { ModuleRunner } from "../module-runner"
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
  const runner = new ModuleRunner({ library, files })

  let error_occurred = false
  for (const path of Object.keys(await files.all())) {
    error_occurred = await runner.run(path)
  }

  if (error_occurred) {
    process.exit(1)
  }
}

async function watch(library: Library, files: LocalFileAdapter): Promise<void> {
  const src_dir = Path.resolve(files.root_dir, files.config.src)
  const watcher = chokidar.watch(src_dir)
  const runner = new ModuleRunner({ library, files })

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoader.can_load(file)) return

    const prefix = `${src_dir}/`
    const path = file.slice(prefix.length)
    await runner.rerun(event, path)
  })
}
