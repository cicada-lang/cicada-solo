import { LocalFileResource } from "./local-file-resource"
import { FileResource } from "../file-resource"
import { LibraryConfig, libraryConfigSchema } from "../library/library-config"
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
    const config = libraryConfigSchema.validate({
      name: `<fake-library-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    })

    super({ root: dir, config })

    this.dir = dir
    this.config = config
    this.faked = opts.faked || {}
  }

  info(): string {
    return [
      `file_resource:`,
      `  kind: FakeFileResource`,
      `  name: ${this.config.name}`,
      `  version: ${this.config.version}`,
      `  root: ${this.root}`,
      `  src: ${this.config.src}`,
    ].join("\n")
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
