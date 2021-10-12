import * as ModuleLoaders from "../module-loaders"
import { ModuleLoader } from "../module-loader"

export function from_path(path: string): ModuleLoader {
  if (path.endsWith(".cic")) {
    return new ModuleLoaders.CicModuleLoader()
  } else if (path.endsWith(".md")) {
    return new ModuleLoaders.MarkdownModuleLoader()
  } else {
    throw new Error(
      [
        `When try to create ModuleLoader from path,`,
        `but I do not know how to handle file with this kind of extension:`,
        `  file: ${path}`,
      ].join("\n")
    )
  }
}
