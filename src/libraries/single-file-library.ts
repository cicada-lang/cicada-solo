import { Library, LibraryConfig, DocBuilder } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"
import fs from "fs"

export class SingleFileLibrary extends Library {
  config: LibraryConfig
  path: string
  doc_builder: DocBuilder

  constructor(opts: { path: string; doc_builder: DocBuilder }) {
    super()
    this.path = opts.path
    this.config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
    this.doc_builder = opts.doc_builder
  }

  async list_paths(): Promise<Array<string>> {
    return [this.path]
  }

  async fetch_file(path: string): Promise<string> {
    return fs.readFileSync(this.path, { encoding: "utf-8" })
  }

  async fetch_doc(path: string): Promise<Doc> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    return this.doc_builder.from_file({ path: this.path, library: this, text })
  }

  async fetch_docs(): Promise<Record<string, Doc>> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    const doc = this.doc_builder.from_file({
      path: this.path,
      library: this,
      text,
    })
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
    return await doc.load(this)
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
