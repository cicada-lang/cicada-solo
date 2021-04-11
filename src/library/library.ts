import { LibraryConfig } from "../library"
import { Module } from "../module"

export interface Library {
  config: LibraryConfig
  // NOTE path will be resolved from `config.src`
  // - do not support relative path
  load(path: string): Promise<Module>
}
