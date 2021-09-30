import { LocalFileStore } from "../file-stores"
import Path from "path"
import fs from "fs"

export class AppFileStore extends LocalFileStore {
  constructor(opts: { dir: string }) {
    const { dir } = opts
    super({ dir })
  }
}
