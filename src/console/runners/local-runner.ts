import { Runner } from "../runner"
import { Book } from "../../book"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { SnapshotRunner } from "./snapshot-runner"
import { ErrorRunner } from "./error-runner"
import { CtxOptions } from "../../lang/ctx"
import * as ut from "../../ut"
import fs from "fs"

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
