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
  verbose: { type: "boolean", default: false },
}

type Argv = {
  "config-file": string
  watch: boolean
  verbose: boolean
}

export const handler = async (argv: Argv) => {
  const library = await LocalLibrary.from_config_file(argv["config-file"])
  const opts = { verbose: argv.verbose }
  if (argv.watch) await watch(library, opts)
  else await check(library, opts)
}

async function check(
  library: LocalLibrary,
  opts: { verbose: boolean }
): Promise<void> {
  try {
    const mods = await library.load_all(opts)
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    } else {
      throw error
    }
  }
}

async function watch(
  library: LocalLibrary,
  opts: { verbose: boolean }
): Promise<void> {
  const src_dir = Path.resolve(library.root_dir, library.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event === "add" || event === "change") {
      const prefix = `${src_dir}/`
      const path = file.slice(prefix.length)

      try {
        library.cached_mods.delete(path)
        const mod = await library.load(path, opts)

        console.log(
          chalk.bold(`(${event})`),
          chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
          path
        )
      } catch (error) {
        if (error instanceof Trace) {
          console.error(error.repr((exp) => exp.repr()))
        } else if (error instanceof pt.ParsingError) {
        } else {
          console.log(error)
        }

        console.log(
          chalk.bold(`(${event})`),
          chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
          path
        )
      }
    }
  })
}
