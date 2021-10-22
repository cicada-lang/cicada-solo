import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalBookStore } from "../book/book-stores/local-book-store"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import * as Loggers from "@enchanterjs/enchanter/lib/loggers"
import { Book } from "../book"
import { SnapshotRunner, ErrorRunner } from "../console/runners"
import { Runner } from "../console/runner"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  localBooks: LocalBookStore = new LocalBookStore()
  logger = new Loggers.PrettyLogger()

  createLocalRunner(opts: {
    path: string
    book: Book<LocalFileStore>
  }): Runner {
    const { path } = opts

    if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
      return new ErrorRunner(opts)
    } else if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
      return new SnapshotRunner(opts)
    } else {
      throw new Error(`I can not handle file extension: ${path}`)
    }
  }
}

export default new NodeApp()
