import { Library, LibraryConfig } from "../library"
import { FileAdapter } from "../library/file-adapter"
import { SingleFileAdapter } from "../library/file-adapters"
import { Module } from "../module"
import { ModuleLoader } from "../module"
import fs from "fs"

export class SingleFileLibrary extends Library {
  config: LibraryConfig
  path: string
  files: SingleFileAdapter

  constructor(opts: { path: string }) {
    super()
    this.path = opts.path
    this.config = LibraryConfig.create({
      name: "single-file-library",
      date: new Date().toLocaleDateString(),
    })

    this.files = new SingleFileAdapter(opts)
  }
}
