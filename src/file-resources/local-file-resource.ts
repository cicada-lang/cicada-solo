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

  async get(path: string): Promise<string | undefined> {
    const file = Path.isAbsolute(path) ? path : Path.resolve(this.dir, path)
    if (fs.lstatSync(file).isFile()) {
      return await fs.promises.readFile(file, "utf8")
    } else {
      return undefined
    }
  }

  async keys(): Promise<Array<string>> {
    const entries = await readdirp.promise(this.dir)
    return entries.map(({ path }) => path)
  }

  resolve(path: string): string {
    return Path.resolve(this.dir, path)
  }
}
