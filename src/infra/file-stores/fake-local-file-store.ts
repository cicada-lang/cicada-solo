import { LocalFileStore } from "./local-file-store"

export class FakeLocalFileStore extends LocalFileStore {
  faked: Record<string, string>
  fallback: LocalFileStore

  constructor(opts: {
    faked?: Record<string, string>
    fallback: LocalFileStore
  }) {
    const { dir } = opts.fallback
    super({ dir })
    this.faked = opts.faked || {}
    this.fallback = opts.fallback
  }

  async keys(): Promise<Array<string>> {
    return Array.from(
      new Set([...(await this.fallback.keys()), ...Object.keys(this.faked)])
    )
  }

  async get(path: string): Promise<string | undefined> {
    const found = this.faked[path]
    if (found !== undefined) {
      return found
    } else {
      return await this.fallback.get(path)
    }
  }
}
