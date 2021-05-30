import { LocalLibrary } from "../../library/local-library"
import { Module } from "../../module"
import { Trace } from "../../trace"
import { doc_ext_p } from "../../doc"
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
  const opts = { verbose: argv.verbose }
  if (argv.watch) await watch(library, opts)
  else await check(library, opts)
}

async function check(
  library: LocalLibrary,
  opts: { verbose: boolean }
): Promise<void> {
  let error_occured = false

  for (const path of Object.keys(await library.fetch_files())) {
    try {
      const mod = await library.load(path, opts)
      await mod_snapshot(library, path, mod, opts)

      console.log(
        chalk.bold(`(check)`),
        chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    } catch (error) {
      error_occured = true

      if (error instanceof Trace) {
        console.error(error.repr((exp) => exp.repr()))
      } else if (error instanceof pt.ParsingError) {
        const text = await library.fetch_file(path)
        if (!text) {
          console.error(`Unknown path: ${path}`)
        } else {
          let message = error.message
          message += "\n"
          message += pt.report(error.span, text)
          console.error(message)
        }
      } else {
        console.error(error)
      }

      console.log(
        chalk.bold(`(check)`),
        chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    }
  }

  if (error_occured) {
    process.exit(1)
  }
}

async function watch(
  library: LocalLibrary,
  opts: { verbose: boolean }
): Promise<void> {
  const src_dir = Path.resolve(library.root_dir, library.config.src)
  const watcher = chokidar.watch(src_dir)

  watcher.on("all", async (event, file) => {
    if (event !== "add" && event !== "change") return
    if (!doc_ext_p(file)) return

    const prefix = `${src_dir}/`
    const path = file.slice(prefix.length)

    try {
      const mod = await library.reload(path, opts)
      await mod_snapshot(library, path, mod, opts)

      console.log(
        chalk.bold(`(${event})`),
        chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    } catch (error) {
      if (error instanceof Trace) {
        console.error(error.repr((exp) => exp.repr()))
      } else if (error instanceof pt.ParsingError) {
        const text = await library.fetch_file(path)
        if (!text) {
          console.error(`Unknown path: ${path}`)
        } else {
          let message = error.message
          message += "\n"
          message += pt.report(error.span, text)
          console.error(message)
        }
      } else {
        console.error(error)
      }

      console.log(
        chalk.bold(`(${event})`),
        chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
        path
      )
    }
  })
}

async function mod_snapshot(
  library: LocalLibrary,
  path: string,
  mod: Module,
  opts: { verbose: boolean }
): Promise<void> {
  if (path.endsWith(".snapshot.cic")) {
    const file = Path.resolve(
      library.root_dir,
      library.config.src,
      path.replace(/snapshot\.cic$/, "snapshot.out")
    )

    await fs.promises.writeFile(file, mod.output)

    if (opts.verbose) {
      console.log(mod.output)
    }
  }

  if (path.endsWith(".snapshot.md")) {
    const file = Path.resolve(
      library.root_dir,
      library.config.src,
      path.replace(/snapshot\.md$/, "snapshot.out")
    )

    await fs.promises.writeFile(file, mod.output)

    if (opts.verbose) {
      console.log(mod.output)
    }
  }
}
