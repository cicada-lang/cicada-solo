import { Library } from "../library"
import { FileResource } from "../library/file-resource"

export abstract class Runner {
  abstract library: Library
  abstract files: FileResource
  abstract run(path: string): Promise<{ error?: unknown }>
}
