import { Library } from "../library"
import { FileStore } from "../file-store"

export abstract class Runner {
  abstract library: Library
  abstract files: FileStore
  abstract run(path: string): Promise<{ error?: unknown }>
}
