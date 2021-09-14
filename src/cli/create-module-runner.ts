import { Library } from "../library"
import { LocalFileAdapter } from "../library/file-adapters"
import { ModuleLoader } from "../module"
import { ModuleLogger } from "./module-logger"
import { ModuleRunner } from "./module-runner"
import {
  SnapshotModuleRunner,
  ErrorModuleRunner,
  DefaultModuleRunner,
} from "./module-runners"

export function createModuleRunner(opts: {
  path: string
  library: Library
  files: LocalFileAdapter
}): ModuleRunner {
  const { path, library, files } = opts

  if (SnapshotModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new SnapshotModuleRunner({ library, files })
  }

  if (ErrorModuleRunner.extensions.some((e) => path.endsWith(e))) {
    return new ErrorModuleRunner({ library, files })
  }

  return new DefaultModuleRunner({ library, files })
}
