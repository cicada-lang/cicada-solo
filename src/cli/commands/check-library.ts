import { LocalLibrary } from "../../library"
import { Trace } from "../../trace"
import chokidar from "chokidar"
import moment from "moment"
import chalk from "chalk"
import Path from "path"
import pt from "@cicada-lang/partech"

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
  const library = await LocalLibrary.from_config_file(argv["config-file"])
  if (argv.watch) await watch(library)
  else await check(library)
}

async function check(library: LocalLibrary): Promise<void> {
  try {
    const mods = await library.load_all()
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    } else {
      throw error
    }
  }
}

async function watch(library: LocalLibrary): Promise<void> {
  const src_dir = Path.resolve(library.root_dir, library.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event === "add" || event === "change") {
      const time = moment().format("YYYY-MM-DD HH:MM:SS")
      const path = file.slice(`${src_dir}/`.length)
      console.log(chalk.green.bold(`[${time}]`), chalk.bold(`[${event}]`), path)
      try {
        library.cached_mods.delete(path)
        const mod = await library.load(path)
      } catch (error) {
        if (error instanceof Trace) {
          console.error(error.repr((exp) => exp.repr()))
        } else if (error instanceof pt.ParsingError) {
        } else {
          throw error
        }
      }
    }
  })
}
