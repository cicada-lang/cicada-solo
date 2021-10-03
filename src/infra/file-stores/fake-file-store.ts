import { LocalFileStore } from "./local-file-store"
import fs from "fs"
import Path from "path"

export class FakeFileStore extends LocalFileStore {
  dir: string
  faked: Record<string, string>

  constructor(opts: { dir: string; faked?: Record<string, string> }) {
    const { dir, faked } = opts
    super({ dir })
    this.dir = dir
    this.faked = faked || {}
  }

  fake(path: string, text: string): void {
    this.faked[path] = text
  }

  async keys(): Promise<Array<string>> {
    return Array.from(
      new Set([...(await super.keys()), ...Object.keys(this.faked)])
    )
  }

  async get(path: string): Promise<string | undefined> {
    if (this.faked[path] !== undefined) {
      return this.faked[path]
    } else {
      return await super.get(path)
    }
  }
}
