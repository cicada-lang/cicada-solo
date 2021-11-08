import { Book } from "../book"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { SnapshotRunner, ErrorRunner } from "./runners"
import { Runner } from "./runner"

export function createLocalRunner(opts: {
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
