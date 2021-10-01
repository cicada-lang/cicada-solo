import { Store } from "../store"

export abstract class FileStore extends Store<string, string> {
  abstract keys(): Promise<Array<string>>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.get_or_fail(path)
    }

    return files
  }
}