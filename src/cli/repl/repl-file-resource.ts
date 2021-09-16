import { FileResource } from "../../library/file-resource"
import { LibraryConfig } from "../../library"
import pt from "@cicada-lang/partech"
import Path from "path"
import fs from "fs"

export class ReplFileResource extends FileResource {
  constructor() {
    super()
  }

  get config(): LibraryConfig {
    throw new Error()
  }

  async get(path: string): Promise<string> {
    throw new Error()
  }

  async list(): Promise<Array<string>> {
    throw new Error()
  }
}
