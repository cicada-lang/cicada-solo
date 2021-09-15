import { FileResource } from "./file-resource"
import { ModuleResource } from "./module-resource"
import { Reporter } from "./reporter"

export class Library {
  files: FileResource

  constructor(opts: { files: FileResource }) {
    this.files = opts.files
  }

  get mods(): ModuleResource {
    return new ModuleResource({ library: this })
  }

  get reporter(): Reporter {
    return new Reporter({ files: this.files })
  }
}
