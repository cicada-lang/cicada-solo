import { FileResource } from "../file-resource"
import { FileResourceConfig, fileResourceConfigSchema } from "../file-resource"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class LocalFileResource extends FileResource {
  root: string
  config: FileResourceConfig

  constructor(opts: { root: string; config: FileResourceConfig }) {
    super()
    this.root = opts.root
    this.config = opts.config
  }

  static async build(file: string): Promise<LocalFileResource> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalFileResource({
      root: Path.dirname(file),
      config: fileResourceConfigSchema.validate(JSON.parse(text)),
    })
  }

  info(): string {
    return [
      `file_resource:`,
      `  kind: LocalFileResource`,
      `  name: ${this.config.name}`,
      `  version: ${this.config.version}`,
      `  root: ${this.root}`,
      `  src: ${this.config.src}`,
    ].join("\n")
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
