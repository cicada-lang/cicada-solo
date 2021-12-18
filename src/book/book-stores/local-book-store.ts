import { FakeLocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/fake-local-file-store"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { Store } from "@enchanterjs/enchanter/lib/store"
import fs from "fs"
import Path from "path"
import * as ut from "../../ut"
import { Book } from "../book"
import { BookConfigSchema } from "../book-config"

export class LocalBookStore extends Store<[Book, LocalFileStore]> {
  async get(config_file: string): Promise<[Book, LocalFileStore]> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = BookConfigSchema.validate(JSON.parse(text))
    const dir = Path.resolve(Path.dirname(config_file), config.src)
    const files = new LocalFileStore({ dir })
    const book = new Book()
    return [book, files]
  }

  fake(opts: {
    fallback: LocalFileStore
    faked?: Record<string, string>
  }): [Book, LocalFileStore] {
    const { fallback, faked } = opts
    const files = new FakeLocalFileStore({ faked, fallback })
    const book = new Book()
    return [book, files]
  }

  async findUpOrFake(dir: string): Promise<[Book, LocalFileStore]> {
    const config_file = ut.findUp("book.json", { from: dir })
    return config_file
      ? await this.get(config_file)
      : this.fake({ fallback: new LocalFileStore({ dir }) })
  }
}
