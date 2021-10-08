import { GenericApp } from "./generic-app"
import { AppHomeFileStore } from "./app-home-file-store"
import { LocalLibraryStore } from "../library-stores"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import { Library } from "../library"
import { Runner } from "../runner"
import { SnapshotRunner, ErrorRunner } from "../runners"
import * as Loggers from "../loggers"

export class NodeApp extends GenericApp {
  home: AppHomeFileStore = new AppHomeFileStore()
  libraries: LocalLibraryStore = new LocalLibraryStore()
  logger = new Loggers.PrettyLogger()

  createLocalRunner(opts: {
    path: string
    library: Library<LocalFileStore>
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
