import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import fs from "fs"
import Path from "path"
import { CtxOptions } from "../../lang/ctx"
import { Module } from "../../module"
import * as ut from "../../ut"
import { Runner } from "../runner"

export class ErrorRunner extends Runner {
  static extensions = [".error.cic", ".error.md"]

  async run(
    files: LocalFileStore,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    try {
      const url = new URL(`file:${path}`)
      const mod = await Module.load(url, opts)
      await mod.runAll()

      return {
        error: new Error(`I expect to find error in the path: ${path}`),
      }
    } catch (error) {
      const text = await files.getOrFail(path)
      const report = this.reporter.report(error, {
        path: Path.relative(process.cwd(), path),
        text,
      })
      const file = files.resolve(path + ".out")
      await fs.promises.writeFile(file, ut.stripAnsi(report))
      return { error: undefined }
    }
  }
}
