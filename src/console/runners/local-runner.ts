import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { Book } from "../../book"
import { CtxOptions } from "../../lang/ctx"
import { Runner } from "../runner"
import { ErrorRunner } from "./error-runner"
import { SnapshotRunner } from "./snapshot-runner"
import Path from "path"

export class LocalRunner extends Runner {
  async run(
    book: Book<LocalFileStore>,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
      return await new ErrorRunner().run(book, path, opts)
    } else if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
      return await new SnapshotRunner().run(book, path, opts)
    } else {
      throw new Error(`I can not handle file extension: ${path}`)
    }
  }
}
