import { Library } from "../library"
import { FileAdapter } from "../library/file-adapter"
import { Logger } from "./logger"

export abstract class ModuleRunner {
  abstract library: Library
  abstract files: FileAdapter
  abstract logger: Logger
  abstract run(path: string, opts: { by: string }): Promise<{ error?: unknown }>
}
