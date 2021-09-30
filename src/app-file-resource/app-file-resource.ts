import { LocalFileResource } from "../file-resources"
import Path from "path"
import fs from "fs"
import readdirp from "readdirp"

export class AppFileResource extends LocalFileResource {
  constructor(opts: { dir: string }) {
    const { dir } = opts
    super({ dir })
  }
}
