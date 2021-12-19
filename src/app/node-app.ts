import * as Loggers from "@enchanterjs/enchanter/lib/loggers"
import { AppHomeFileStore } from "./app-home-file-store"
import { GenericApp } from "./generic-app"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  logger = new Loggers.PrettyLogger()
}

export default new NodeApp()
