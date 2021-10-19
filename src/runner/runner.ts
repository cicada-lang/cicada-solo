import { Book } from "../book"
import { CtxObserver } from "../ctx"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import * as Errors from "../errors"

export abstract class Runner {
  abstract book: Book

  abstract run(
    path: string,
    opts: { observers: Array<CtxObserver> }
  ): Promise<{ error?: unknown }>

  reporter = new Errors.ErrorReporter()
}
