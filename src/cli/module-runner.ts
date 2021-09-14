import { Library } from "../library"
import { LocalFileAdapter } from "../library/file-adapters"
import { ModuleLoader } from "../module"
import { ModuleLogger } from "./module-logger"

export abstract class ModuleRunner {
  abstract library: Library
  abstract files: LocalFileAdapter
  abstract logger: ModuleLogger
  abstract run(path: string, opts: { by: string }): Promise<{ error?: unknown }>
}
