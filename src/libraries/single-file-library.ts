import { Library, LibraryConfig, DocBuilder, ModuleViewer } from "../library"
import { Doc } from "../doc"
import fs from "fs"

export class SingleFileLibrary<Module> extends Library<Module> {
  config: LibraryConfig
  path: string
  doc_builder: DocBuilder<Module>
  module_viewer: ModuleViewer<Module>

  constructor(opts: {
    path: string
    doc_builder: DocBuilder<Module>
    module_viewer: ModuleViewer<Module>
  }) {
    super()
    this.path = opts.path
    this.config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })
    this.doc_builder = opts.doc_builder
    this.module_viewer = opts.module_viewer
  }

  async fetch_doc(path: string): Promise<Doc<Module>> {
    const text = fs.readFileSync(this.path, { encoding: "utf-8" })
    return this.doc_builder.from_file({ path: this.path, library: this, text })
  }

  async fetch_docs(): Promise<Record<string, Doc<Module>>> {
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
    return await doc.load()
  }

  async load_mods(): Promise<Map<string, Module>> {
    return new Map([[this.path, await this.load(this.path)]])
  }
}
