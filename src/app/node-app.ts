import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalLibraryStore } from "../library-stores"
import pino from "pino"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  libraries: LocalLibraryStore = new LocalLibraryStore()

  logger = pino(
    pino.transport({
      target: "pino-pretty",
      options: {
        translateTime: "SYS:HH:MM:ss.l",
        ignore: "pid,hostname",
      },
    })
  )
}

export default new NodeApp()
