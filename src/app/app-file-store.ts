import { LocalFileStore } from "../infra/file-stores"
import os from "os"
import Path from "path"
import process from "process"

export class AppFileStore extends LocalFileStore {
  constructor() {
    const dir =
      process.env["CICADA_HOME"] || Path.resolve(os.homedir(), ".cicada")

    super({ dir })
  }
}
