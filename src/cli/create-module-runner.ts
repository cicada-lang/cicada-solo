import { Library } from "../library"
import { LocalFileResource } from "../library/file-resources"
import { Runner } from "./runner"
import {
  SnapshotModuleRunner,
  ErrorModuleRunner,
  DefaultModuleRunner,
} from "./module-runners"
import { Logger } from "./logger"

export function createModuleRunner(opts: {
  path: string
  library: Library
  files: LocalFileResource
  logger?: Logger
}): Runner {
  const { path } = opts

  if (ErrorModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new ErrorModuleRunner(opts)
  }

  if (SnapshotModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new SnapshotModuleRunner(opts)
  }

  throw new Error(`I can not handle file extension: ${path}`)
}
