import { Store } from "../infra/store"

export abstract class FileStore extends Store<string, string> {
  abstract keys(): Promise<Array<string>>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.getOrFail(path)
    }

    return files
  }
}
