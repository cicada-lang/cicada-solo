import { LocalFileResource } from "./local-file-resource"
import { LibraryConfig } from ".."
import fs from "fs"
import Path from "path"

export class SingleFileResource extends LocalFileResource {
  config: LibraryConfig
  dir: string

  constructor(opts: { dir: string }) {
    const dir = Path.resolve(opts.dir)
    const config = LibraryConfig.create({
      name: "single-file-library",
    })

    super({ root_dir: dir, config })

    this.dir = dir
    this.config = config
  }

  async list(): Promise<Array<string>> {
    return []
  }

  async get(path: string): Promise<string> {
    const resolved_path = Path.resolve(this.dir, path)
    return fs.readFileSync(resolved_path, { encoding: "utf-8" })
  }
}
