import { Store } from "../store"

export abstract class FileStore extends Store<string> {
  abstract keys(): Promise<Array<string>>
  abstract resolve(path: string): string

  get root(): string {
    return this.resolve("")
  }

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.getOrFail(path)
    }

    return files
  }
}
