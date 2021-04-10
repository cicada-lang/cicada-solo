import { Library, LibraryConfig } from "../library"
import { Module } from "../module"

export class EmptyLibrary implements Library {
  config: LibraryConfig

  constructor() {
    this.config = new LibraryConfig({
      name: "empty-library",
      date: "2021-04-11 cicada",
    })
  }

  async load(name: string): Promise<Module> {
    throw new Error(`The empty library can not load module: ${name}`)
  }
}
