import { LibraryConfig, DocBuilder } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig

  abstract doc_builder: DocBuilder

  abstract fetch_file(path: string): Promise<string>
  abstract fetch_files(): Promise<Record<string, string>>

  abstract fetch_doc(path: string): Promise<Doc>
  abstract fetch_docs(): Promise<Record<string, Doc>>

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>
}
