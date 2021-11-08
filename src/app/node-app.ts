import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalBookStore } from "../book/book-stores/local-book-store"
import * as Loggers from "@enchanterjs/enchanter/lib/loggers"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  localBooks: LocalBookStore = new LocalBookStore()
  logger = new Loggers.PrettyLogger()
}

export default new NodeApp()
