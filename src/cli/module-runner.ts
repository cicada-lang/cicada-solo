import { Library } from "../library"
import { LocalFileAdapter } from "../library/file-adapters"
import { Logger } from "./logger"

export abstract class ModuleRunner {
  abstract library: Library
  abstract files: LocalFileAdapter
  abstract logger: Logger
  abstract run(path: string, opts: { by: string }): Promise<{ error?: unknown }>
}
