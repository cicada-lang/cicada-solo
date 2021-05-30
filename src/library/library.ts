import { LibraryConfig } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export interface Library {
  config: LibraryConfig

  // fetch_doc(path: string): Promise<Doc>
  // fetch_docs(): Promise<Record<string, Doc>>

  fetch_file(path: string): Promise<string>
  fetch_files(): Promise<Record<string, string>>

  load(path: string): Promise<Module>
  reload(path: string): Promise<Module>
  load_mods(): Promise<Map<string, Module>>
}
