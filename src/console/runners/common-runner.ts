import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import Path from "path"
import { CtxOptions } from "../../lang/ctx"
import { Module } from "../../module"
import { Runner } from "../runner"

export class CommonRunner extends Runner {
  async run(
    files: LocalFileStore,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    try {
      const url = new URL(`file:${path}`)
      const mod = await Module.load(url, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output) {
        console.log(output)
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
