import { Book } from "../book"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { SnapshotRunner, ErrorRunner } from "./runners"
import { Runner } from "./runner"

export function createLocalRunner(path: string): Runner {
  if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
    return new ErrorRunner()
  } else if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
    return new SnapshotRunner()
  } else {
    throw new Error(`I can not handle file extension: ${path}`)
  }
}
