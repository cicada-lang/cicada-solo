import { LocalFileResource } from "./local-file-resource"
import { LibraryConfig } from ".."
import fs from "fs"
import Path from "path"

export class SingleFileResource extends LocalFileResource {
  config: LibraryConfig
  path: string

  constructor(opts: { path: string }) {
    const path = Path.resolve(opts.path)
    const dir = Path.dirname(path)
    const config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })

    super({ root_dir: dir, config })

    this.path = path
    this.config = config
  }

  async list(): Promise<Array<string>> {
    return [this.path]
  }

  async get(path: string): Promise<string> {
    const resolved_path = Path.resolve(Path.dirname(this.path), path)
    return fs.readFileSync(resolved_path, { encoding: "utf-8" })
  }
}
