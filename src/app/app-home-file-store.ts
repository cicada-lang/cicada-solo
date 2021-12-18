import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import os from "os"
import Path from "path"
import process from "process"

export class AppHomeFileStore extends LocalFileStore {
  constructor() {
    super({
      dir: process.env["CICADA_HOME"] || Path.resolve(os.homedir(), ".cicada"),
    })
  }
}
