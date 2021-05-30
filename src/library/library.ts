import { LibraryConfig } from "../library"
import { Module } from "../module"
import { Doc } from "../doc"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library {
  abstract config: LibraryConfig

  abstract fetch_doc(path: string): Promise<Doc>
  abstract fetch_docs(): Promise<Record<string, Doc>>

  async fetch_file(path: string): Promise<string> {
    const doc = await this.fetch_doc(path)
    return doc.text
  }

  async fetch_files(): Promise<Record<string, string>> {
    const docs = await this.fetch_docs()
    const files: Record<string, string> = {}
    for (const [path, doc] of Object.entries(docs)) {
      files[path] = doc.text
    }

    return files
  }

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>
}
