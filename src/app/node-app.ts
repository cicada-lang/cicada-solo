import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalLibraryStore } from "../library-stores"
import * as Loggers from "../loggers"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  libraries: LocalLibraryStore = new LocalLibraryStore()
  logger = new Loggers.NodeLogger()
}

export default new NodeApp()
