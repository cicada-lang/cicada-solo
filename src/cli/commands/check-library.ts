import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { Module } from "../../module"
import { ModuleLoader } from "../../module"
import { Trace } from "../../errors"
import pt from "@cicada-lang/partech"
import chokidar from "chokidar"
import moment from "moment"
import chalk from "chalk"
import Path from "path"
import fs from "fs"
import { FAILSAFE_SCHEMA } from "js-yaml"

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

export class ModuleRunner {
  library: Library
  files: LocalFileAdapter
  logger: ModuleLogger

  constructor(opts: { library: Library; files: LocalFileAdapter }) {
    this.library = opts.library
    this.files = opts.files
    this.logger = new ModuleLogger({ files: opts.files })
  }

  async run(path: string): Promise<boolean> {
    try {
      const mod = await this.library.mods.load(path)
      await this.logger.snapshot(path, mod)
      this.logger.maybe_assert_error(path)
      this.logger.log_info("check", path)
      return false
    } catch (error) {
      const error_occurred = await this.logger.error(error as any, path)
      this.logger.log_error("check", path)
      return error_occurred
    }
  }

  async rerun(event: string, path: string): Promise<void> {
    try {
      const mod = await this.library.mods.reload(path)
      await this.logger.snapshot(path, mod)
      this.logger.maybe_assert_error(path)
      this.logger.log_info("check", path)
    } catch (error) {
      await this.logger.error(error as any, path)
      this.logger.log_error("check", path)
    }
  }
}

export class ModuleLogger {
  files: LocalFileAdapter

  constructor(opts: { files: LocalFileAdapter }) {
    this.files = opts.files
  }

  log_info(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.green.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  log_error(tag: string, path: string): void {
    console.log(
      chalk.bold(`(${tag})`),
      chalk.red.bold(`[${moment().format("HH:MM:SS")}]`),
      path
    )
  }

  async snapshot(path: string, mod: Module): Promise<void> {
    if (path.endsWith(".snapshot.cic") || path.endsWith(".snapshot.md")) {
      const file = Path.resolve(
        this.files.root_dir,
        this.files.config.src,
        path + ".out"
      )

      await fs.promises.writeFile(file, mod.output)
    }
  }

  async error(error: Error, path: string): Promise<boolean> {
    const report = await this.error_report(error, path)

    if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
      const file = Path.resolve(
        this.files.root_dir,
        this.files.config.src,
        path + ".out"
      )

      await fs.promises.writeFile(file, report)

      return false
    }

    console.error(report)

    return true
  }

  maybe_assert_error(path: string): void {
    if (path.endsWith(".error.cic") || path.endsWith(".error.md")) {
      throw new Error(`I expect to find error in the file: ${path}`)
    }
  }

  private async error_report(error: Error, path: string): Promise<string> {
    if (error instanceof Trace) {
      return error.repr((exp) => exp.repr())
    } else if (error instanceof pt.ParsingError) {
      const text = await this.files.get(path)
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
}
