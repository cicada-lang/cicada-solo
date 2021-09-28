import { ModuleLoader } from "../module"
import { FileResourceConfig } from "../file-resource"

export abstract class FileResource {
  abstract config: FileResourceConfig

  abstract info(): string

  abstract list(): Promise<Array<string>>

  abstract get(path: string): Promise<string>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.list()) {
      if (ModuleLoader.can_handle(path)) {
        files[path] = await this.get(path)
      }
    }

    return files
  }
}
