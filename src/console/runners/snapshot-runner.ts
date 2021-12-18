import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import fs from "fs"
import Path from "path"
import { CtxOptions } from "../../lang/ctx"
import { Module } from "../../module"
import * as ut from "../../ut"
import { Runner } from "../runner"

export class SnapshotRunner extends Runner {
  static extensions = [".cic", ".md"]

  async run(
    files: LocalFileStore,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    try {
      const file = await files.getOrFail(path)
      const url = new URL(`file:${path}`)
      const mod = Module.load(url, file, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output) {
        const file = files.resolve(path + ".out")
        await fs.promises.writeFile(file, ut.stripAnsi(output))
      }

      return { error: undefined }
    } catch (error) {
      const text = await files.getOrFail(path)
      const report = this.reporter.report(error, {
        path: Path.relative(process.cwd(), path),
        text,
      })
      console.error(report)
      return { error }
    }
  }
}
