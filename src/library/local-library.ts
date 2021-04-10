import { Library, LibraryConfig } from "../library"
import Path from "path"
import fs from "fs"

export class LocalLibrary implements Library {
  base_dir: string
  config: LibraryConfig

  constructor(opts: { base_dir: string; config: LibraryConfig }) {
    this.base_dir = opts.base_dir
    this.config = opts.config
  }

  static async fromConfigFile(file: string): Promise<LocalLibrary> {
    const text = await fs.promises.readFile(file, "utf8")
    return new LocalLibrary({
      base_dir: Path.dirname(file),
      config: new LibraryConfig(JSON.parse(text))
    })
  }
}
