import { Book } from "../book"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import * as Errors from "../errors"

export abstract class Runner {
  abstract book: Book
  abstract run(path: string): Promise<{ error?: unknown }>
  reporter = new Errors.ErrorReporter()
}
