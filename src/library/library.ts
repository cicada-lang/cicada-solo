import { LibraryConfig } from "../library"
import { Module } from "../module"

export interface Library {
  config: LibraryConfig
  fetch_files(): Promise<Map<string, string>>
  load(path: string): Promise<Module>
  reload(path: string): Promise<Module>
  load_mods(): Promise<Map<string, Module>>
}
