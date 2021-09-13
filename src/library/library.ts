import { LibraryConfig, DocBuilder, ModuleViewer } from "../library"
import { Doc } from "../doc"

// NOTE in the following interface, caller is responsible to make sure the path exists.
//   maybe this should be changed, and these functions should be able to return `undefined`.
export abstract class Library<Module> {
  abstract config: LibraryConfig

  abstract doc_builder: DocBuilder<Module>
  abstract module_viewer: ModuleViewer<Module>

  abstract fetch_doc(path: string): Promise<Doc<Module>>
  abstract fetch_docs(): Promise<Record<string, Doc<Module>>>

  abstract load(path: string): Promise<Module>
  abstract reload(path: string): Promise<Module>
  abstract load_mods(): Promise<Map<string, Module>>

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
}
