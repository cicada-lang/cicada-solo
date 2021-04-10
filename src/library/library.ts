import { LibraryConfig } from "../library"
import { Module } from "../module"

export interface Library {
  config: LibraryConfig
  load(name: string): Promise<Module>
}
