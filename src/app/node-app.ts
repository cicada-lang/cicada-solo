import { App } from "../app"
import { AppFileStore } from "./app-file-store"
import { LocalLibraryStore } from "../library-stores"

export class NodeApp extends App {
  files: AppFileStore = new AppFileStore()
  libraries: LocalLibraryStore = new LocalLibraryStore()
}

export default new NodeApp()
