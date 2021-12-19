import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import Path from "path"
import { CtxOptions } from "../lang/ctx"
import * as Errors from "../lang/errors"
import { Module } from "../module"

export class Runner {
  reporter = new Errors.ErrorReporter()

  async run(
    files: LocalFileStore,
    path: string,
    opts: CtxOptions & {
      silent?: boolean
    }
  ): Promise<{ error?: unknown }> {
    try {
      const url = new URL(`file:${path}`)
      const mod = await Module.load(url, opts)
      await mod.runAll()
      const output = mod.codeBlocks.allOutputs
        .map((output) => output.formatForConsole())
        .join("\n")

      if (output && !opts.silent) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const text = await files.getOrFail(path)
      const report = this.reporter.report(error, {
        path: Path.relative(process.cwd(), path),
        text,
      })

      if (!opts.silent) {
        console.error(report)
      }

      return { error }
    }
  }
}
