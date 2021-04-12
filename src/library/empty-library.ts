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

  async paths(): Promise<Array<string>> {
    throw new Error(`The empty library does not have any path`)
  }

  async load_all(): Promise<Map<string, Module>> {
    throw new Error(`The empty library can not load any module`)
  }
}
