import * as ModuleLoaders from "../module-loaders"

export abstract class FileResource {
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
