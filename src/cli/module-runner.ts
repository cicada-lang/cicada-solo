import { Library } from "../library"
import { FileAdapter } from "../library/file-adapter"

export abstract class ModuleRunner {
  abstract library: Library
  abstract files: FileAdapter
  abstract run(path: string): Promise<{ error?: unknown }>
}
