import { LocalFileResource } from "./local-file-resource"
import fs from "fs"
import Path from "path"

export class FakeFileResource extends LocalFileResource {
  dir: string
  faked: Record<string, string>

  constructor(opts: { dir: string; faked?: Record<string, string> }) {
    const { dir, faked } = opts
    super({ dir })
    this.dir = dir
    this.faked = faked || {}
  }

  async list(): Promise<Array<string>> {
    return Object.keys(this.faked)
  }

  async get(path: string): Promise<string> {
    if (this.faked[path] !== undefined) {
      return this.faked[path]
    }

    const resolved_path = Path.resolve(this.dir, path)
    return fs.readFileSync(resolved_path, { encoding: "utf-8" })
  }
}
