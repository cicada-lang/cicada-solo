import { LibraryConfig } from "../library"
import { Module } from "../module"

export interface Library {
  config: LibraryConfig
  fetch_file(path: string): Promise<string>
  fetch_files(): Promise<Record<string, string>>
  load(path: string): Promise<Module>
  reload(path: string): Promise<Module>
  load_mods(): Promise<Map<string, Module>>
}
