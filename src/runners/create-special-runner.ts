import { Library } from "../library"
import { Runner } from "../runner"
import { SnapshotRunner, ErrorRunner } from "../runners"

export function createSpecialRunner(opts: {
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
