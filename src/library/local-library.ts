import { Library, LibraryConfig } from "../library"

export class LocalLibrary implements Library {
  base_dir: string
  config: LibraryConfig

  constructor(opts: { base_dir: string; config: LibraryConfig }) {
    this.base_dir = opts.base_dir
    this.config = opts.config
  }
}
