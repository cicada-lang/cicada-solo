import { FileResource } from "../file-resource"
import { LibraryConfig, libraryConfigSchema } from "../library"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class LocalFileResource extends FileResource {
  root: string
  config: LibraryConfig

  constructor(opts: { root: string; config: LibraryConfig }) {
    super()
    this.root = opts.root
    this.config = opts.config
  }

  static async build(file: string): Promise<LocalFileResource> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalFileResource({
      root: Path.dirname(file),
      config: libraryConfigSchema.validate(JSON.parse(text)),
    })
  }

  async get(path: string): Promise<string> {
    const file = Path.isAbsolute(path)
      ? path
      : Path.resolve(this.root, this.config.src, path)
    return await fs.promises.readFile(file, "utf8")
  }

  async list(): Promise<Array<string>> {
    const src_dir = Path.resolve(this.root, this.config.src)
    const entries = await readdirp.promise(src_dir)
    return entries.map(({ path }) => path)
  }

  src(path: string): string {
    return Path.resolve(this.root, this.config.src, path)
  }
}
