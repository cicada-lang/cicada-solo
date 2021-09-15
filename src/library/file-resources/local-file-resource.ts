import { FileResource } from "../file-resource"
import { LibraryConfig } from ".."
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class LocalFileResource extends FileResource {
  root_dir: string
  config: LibraryConfig

  constructor(opts: { root_dir: string; config: LibraryConfig }) {
    super()
    this.root_dir = opts.root_dir
    this.config = opts.config
  }

  static async build(file: string): Promise<LocalFileResource> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalFileResource({
      root_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text)),
    })
  }

  async get(path: string): Promise<string> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root_dir, this.config.src, path)
    return await fs.promises.readFile(file, "utf8")
  }

  async list(): Promise<Array<string>> {
    const src_dir = Path.resolve(this.root_dir, this.config.src)
    const entries = await readdirp.promise(src_dir)
    return entries.map(({ path }) => path)
  }

  src(path: string): string {
    return Path.resolve(this.root_dir, this.config.src, path)
  }
}
