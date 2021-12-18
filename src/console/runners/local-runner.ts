import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { CtxOptions } from "../../lang/ctx"
import { Runner } from "../runner"
import { ErrorRunner } from "./error-runner"
import { SnapshotRunner } from "./snapshot-runner"

export class LocalRunner extends Runner {
  async run(
    files: LocalFileStore,
    path: string,
    opts: CtxOptions
  ): Promise<{ error?: unknown }> {
    if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
      return await new ErrorRunner().run(files, path, opts)
    } else if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
      return await new SnapshotRunner().run(files, path, opts)
    } else {
      throw new Error(`I can not handle file extension: ${path}`)
    }
  }
}
