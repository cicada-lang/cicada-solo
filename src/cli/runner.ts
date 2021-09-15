import { Library } from "../library"
import { FileAdapter } from "../library/file-adapter"

export abstract class Runner {
  abstract library: Library
  abstract files: FileAdapter
  abstract run(path: string): Promise<{ error?: unknown }>
}
