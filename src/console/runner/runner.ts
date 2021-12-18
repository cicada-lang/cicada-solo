import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { CtxObserver, Highlighter } from "../../lang/ctx"
import * as Errors from "../../lang/errors"

export abstract class Runner {
  abstract run(
    files: LocalFileStore,
    path: string,
    opts: {
      observers: Array<CtxObserver>
      highlighter: Highlighter
    }
  ): Promise<{ error?: unknown }>

  reporter = new Errors.ErrorReporter()
}
