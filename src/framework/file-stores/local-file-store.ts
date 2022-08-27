import fs from "fs"
import Path from "path"
import readdirp from "readdirp"
import { FileStore } from "../file-store"

export class LocalFileStore extends FileStore {
  dir: string

  constructor(opts: { dir: string }) {
    super()
    this.dir = opts.dir
  }

  get root(): string {
    return Path.resolve(this.dir)
  }

  resolve(path: string): string {
    return Path.resolve(this.dir, path)
  }

  async get(path: string): Promise<string | undefined> {
    const file = this.resolve(path)
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
      return await fs.promises.readFile(file, "utf8")
    } else {
      return undefined
    }
  }

  async set(path: string, text: string): Promise<boolean> {
    const file = this.resolve(path)
    if (!fs.existsSync(file)) {
      await fs.promises.mkdir(Path.dirname(file), { recursive: true })
      await fs.promises.writeFile(file, text)
      return false
    } else if (fs.existsSync(file) && fs.lstatSync(file).isFile()) {
      await fs.promises.mkdir(Path.dirname(file), { recursive: true })
      await fs.promises.writeFile(file, text)
      return true
    } else {
      throw new Error(`I can not write to file: ${file}`)
    }
  }

  async keys(): Promise<Array<string>> {
    const entries = await readdirp.promise(this.dir)
    return entries.map(({ path }) => path)
  }
}
