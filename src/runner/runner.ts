import { Book } from "../book"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import { ErrorReporter } from "../error-reporter"

export abstract class Runner {
  abstract library: Book
  abstract run(path: string): Promise<{ error?: unknown }>
  reporter = new ErrorReporter()
}
