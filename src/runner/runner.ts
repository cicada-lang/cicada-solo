import { Library } from "../library"
import { FileStore } from "../infra/file-store"
import { ErrorReporter } from "../error-reporter"

export abstract class Runner {
  abstract library: Library
  abstract run(path: string): Promise<{ error?: unknown }>
  reporter = new ErrorReporter()
}
