import { Book } from "../../book"
import { CtxObserver } from "../../lang/ctx"
import * as Errors from "../../lang/errors"

export abstract class Runner {
  abstract book: Book

  abstract run(
    path: string,
    opts: { observers: Array<CtxObserver> }
  ): Promise<{ error?: unknown }>

  reporter = new Errors.ErrorReporter()
}
