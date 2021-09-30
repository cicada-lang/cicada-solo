import { Resource } from "../resource"

export abstract class FileResource extends Resource<string, string> {
  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.get_or_fail(path)
    }

    return files
  }
}
