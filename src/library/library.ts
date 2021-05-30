import { LibraryConfig } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig

  // fetch_doc(path: string): Promise<Doc>
  // fetch_docs(): Promise<Record<string, Doc>>

  abstract fetch_file(path: string): Promise<string>
  abstract fetch_files(): Promise<Record<string, string>>

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>
}
