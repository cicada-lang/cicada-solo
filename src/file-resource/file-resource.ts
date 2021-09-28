import * as ModuleLoaders from "../module-loaders"
import ty from "@xieyuheng/ty"

export type FileResourceConfig = {
  name: string
  version: string
  src: string
}

export abstract class FileResource {
  abstract config: FileResourceConfig

  static configSchema = ty.object<FileResourceConfig>({
    name: ty.string(),
    version: ty.semver(),
    src: ty.string(),
  })

  abstract info(): string

  abstract list(): Promise<Array<string>>

  abstract get(path: string): Promise<string>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.list()) {
      if (ModuleLoaders.can_handle_extension(path)) {
        files[path] = await this.get(path)
      }
    }

    return files
  }
}
