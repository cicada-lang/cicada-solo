import { LocalLibrary } from "../../libraries"
import { Module } from "../../module"
import { ModuleLoader } from "../../module"
import { Trace } from "../../errors"
import pt from "@cicada-lang/partech"
import chokidar from "chokidar"
import moment from "moment"
import chalk from "chalk"
import Path from "path"
import fs from "fs"

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
  if (argv.watch) await watch(library)
  else await check(library)
}

async function check(library: LocalLibrary): Promise<void> {
  let error_occurred = false

  for (const path of Object.keys(await library.fetch_files())) {
    try {
      const mod = await library.load(path)
      await snapshot_log(library, path, mod)
      maybe_assert_error(path)

      console.log(
        chalk.bold(`(check)`),
        chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    } catch (error) {
      error_occurred = await error_log(error as any, path, library)
      console.log(
        chalk.bold(`(check)`),
        chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    }
  }

  if (error_occurred) {
    process.exit(1)
  }
}

async function watch(library: LocalLibrary): Promise<void> {
  const src_dir = Path.resolve(library.root_dir, library.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!ModuleLoader.can_load(file)) return

    const prefix = `${src_dir}/`
    const path = file.slice(prefix.length)

    try {
      const mod = await library.reload(path)
      await snapshot_log(library, path, mod)
      maybe_assert_error(path)

      console.log(
        chalk.bold(`(${event})`),
        chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    } catch (error) {
      await error_log(error as any, path, library)
      console.log(
        chalk.bold(`(${event})`),
        chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    }
  })
}

function maybe_assert_error(path: string): void {
  if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
    throw new Error(`I expect to find error in the file: ${path}`)
  }
}

async function error_log(
  error: Error,
  path: string,
  library: LocalLibrary
): Promise<boolean> {
  const report = await error_report(error, path, library)

  if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
    const file = Path.resolve(
      library.root_dir,
      library.config.src,
      path + ".out"
    )

    await fs.promises.writeFile(file, report)

    return false
  }

  console.error(report)

  return true
}

async function error_report(
  error: Error,
  path: string,
  library: LocalLibrary
): Promise<string> {
  if (error instanceof Trace) {
    return error.repr((exp) => exp.repr())
  } else if (error instanceof pt.ParsingError) {
    const text = await library.fetch_file(path)
    if (!text) {
      return `Unknown path: ${path}`
    } else {
      let message = error.message
      message += "\n"
      message += pt.report(error.span, text)
      return message
    }
  } else {
    throw error
  }
}

async function snapshot_log(
  library: LocalLibrary,
  path: string,
  mod: Module
): Promise<void> {
  if (path.endsWith(".snapshot.cic") || path.endsWith(".snapshot.md")) {
    const file = Path.resolve(
      library.root_dir,
      library.config.src,
      path + ".out"
    )

    await fs.promises.writeFile(file, mod.output)
  }
}
