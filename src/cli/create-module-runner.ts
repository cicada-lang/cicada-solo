import { Library } from "../library"
import { LocalFileAdapter } from "../library/file-adapters"
import { ModuleRunner } from "./module-runner"
import {
  SnapshotModuleRunner,
  ErrorModuleRunner,
  DefaultModuleRunner,
} from "./module-runners"
import { Logger } from "./logger"

export function createModuleRunner(opts: {
  path: string
  library: Library
  files: LocalFileAdapter
  logger?: Logger
}): ModuleRunner {
  const { path, library, files, logger } = opts

  if (SnapshotModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new SnapshotModuleRunner({ library, files, logger })
  }

  if (ErrorModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new ErrorModuleRunner({ library, files, logger })
  }

  return new DefaultModuleRunner({ library, files, logger })
}
