import { FileResource } from "../file-resource"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class LocalFileResource extends FileResource {
  dir: string

  constructor(opts: { dir: string }) {
    super()
    this.dir = opts.dir
  }

  async get(path: string): Promise<string> {
    const file = Path.isAbsolute(path) ? path : Path.resolve(this.dir, path)
    return await fs.promises.readFile(file, "utf8")
  }

  async list(): Promise<Array<string>> {
    const entries = await readdirp.promise(this.dir)
    return entries.map(({ path }) => path)
  }

  src(path: string): string {
    return Path.resolve(this.dir, path)
  }
}
