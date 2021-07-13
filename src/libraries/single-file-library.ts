import { Library, LibraryConfig } from "../library"
import { Module } from "../module"
import { Doc, doc_from_file } from "../doc"
import fs from "fs"

export class SingleFileLibrary extends Library {
  config: LibraryConfig
  path: string

  constructor(path: string) {
    super()
    this.path = path
    this.config = new LibraryConfig({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
  }

  async fetch_doc(path: string): Promise<Doc> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    return doc_from_file({ path: this.path, library: this, text })
  }

  async fetch_docs(): Promise<Record<string, Doc>> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    const doc = doc_from_file({ path: this.path, library: this, text })
    return { [this.path]: doc }
  }

  async reload(path: string): Promise<Module> {
    return await this.load(path)
  }

  async load(path: string): Promise<Module> {
    if (path !== this.path) {
      console.warn(
        `The single file library can not load module: ${path}\n` +
          `The only file in this library is: ${this.path}`
      )
    }

    const doc = await this.fetch_doc(this.path)
    return await Module.from_doc(doc)
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
