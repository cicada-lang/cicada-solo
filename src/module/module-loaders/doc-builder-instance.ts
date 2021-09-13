import { ModuleLoader } from "../../module"
import { DocBuilder } from "../../library"

export const doc_builder: DocBuilder = {
  right_extension_p(path: string): boolean {
    return ModuleLoader.can_load(path)
  },

  from_file(opts: { path: string }): ModuleLoader {
    return ModuleLoader.create(opts.path)
  },
}
