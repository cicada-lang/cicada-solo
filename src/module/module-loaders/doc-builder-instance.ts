import { ModuleLoader } from "../../module"
import { DocBuilder } from "../../library"
import { CicModuleLoader } from "./cic-module-loader"
import { MarkdownModuleLoader } from "./markdown-module-loader"

export const doc_builder: DocBuilder = {
  right_extension_p(path: string): boolean {
    return path.endsWith(".cic") || path.endsWith(".md")
  },

  from_file(opts: { path: string }): ModuleLoader {
    const { path } = opts

    if (path.endsWith(".cic")) {
      return new CicModuleLoader({ path })
    } else if (path.endsWith(".md")) {
      return new MarkdownModuleLoader({ path })
    } else {
      throw new Error(
        `When try to create doc from file, I met path with unknown ext: ${path}`
      )
    }
  },
}
