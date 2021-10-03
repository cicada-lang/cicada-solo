import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalLibraryStore } from "../library-stores"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  libraries: LocalLibraryStore = new LocalLibraryStore()
}

export default new NodeApp()
