import { Doc } from "../../doc"
import { Library } from "../../library"

export interface DocBuilder<Module> {
  right_extension_p(path: string): boolean
  from_file(opts: {
    path: string
    text: string
    library: Library<Module>
  }): Doc<Module>
}
