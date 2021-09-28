import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { Runner } from "../runner"
import { SnapshotRunner, ErrorRunner } from "../runners"
import { Logger } from "../logger"

export function createSpecialRunner(opts: {
  path: string
  library: Library
  files: LocalFileResource
  logger?: Logger
}): Runner {
  const { path } = opts

  if (ErrorRunner.extensions.some((e) => path.endsWith(e))) {
    return new ErrorRunner(opts)
  }

  if (SnapshotRunner.extensions.some((e) => path.endsWith(e))) {
    return new SnapshotRunner(opts)
  }

  throw new Error(`I can not handle file extension: ${path}`)
}
