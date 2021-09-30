import { LocalFileResource } from "../file-resources"
import Path from "path"
import fs from "fs"

export class AppFileResource extends LocalFileResource {
  constructor(opts: { dir: string }) {
    const { dir } = opts
    super({ dir })
  }
}
