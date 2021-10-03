import { Library } from "../library"
import { LocalFileStore } from "../infra/file-stores"
import { Runner } from "../runner"
import { SnapshotRunner, ErrorRunner } from "../runners"
import { Logger } from "../logger"

export function create_special_runner(opts: {
  path: string
  library: Library
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
