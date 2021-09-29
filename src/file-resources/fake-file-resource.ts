import { LocalFileResource } from "./local-file-resource"
import { FileResource } from "../file-resource"
import { LibraryConfig, libraryConfigSchema, fakeLibraryConfig } from "../library"
import fs from "fs"
import Path from "path"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export class FakeFileResource extends LocalFileResource {
  config: LibraryConfig
  dir: string
  faked: Record<string, string>

  constructor(opts: { dir: string; faked?: Record<string, string> }) {
    const dir = Path.resolve(opts.dir)
    const config = fakeLibraryConfig()

    super({ root: dir, config })

    this.dir = dir
    this.config = config
    this.faked = opts.faked || {}
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
