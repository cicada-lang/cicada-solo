import { BookStore } from "../book-store"
import { Book } from "../book"
import * as CtxObservers from "../ctx/ctx-observers"
import { LocalFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import { FakeFileStore } from "@xieyuheng/enchanter/lib/file-stores"
import * as ut from "../ut"
import Path from "path"
import fs from "fs"

export class LocalBookStore extends BookStore {
  async get(config_file: string): Promise<Book<LocalFileStore>> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = Book.book_config_schema.validate(JSON.parse(text))
    return new Book({
      config,
      files: new LocalFileStore({
        dir: Path.resolve(Path.dirname(config_file), config.src),
      }),
      observers: [new CtxObservers.NarrationLogger()],
    })
  }

  fake(dir: string, faked?: Record<string, string>): Book<LocalFileStore> {
    return new Book({
      config: Book.fake_config(),
      files: new FakeFileStore({ dir, faked }),
      observers: [new CtxObservers.NarrationLogger()],
    })
  }

  async findUpOrFake(dir: string): Promise<Book<LocalFileStore>> {
    const config_file = ut.findUp("book.json", { from: dir })
    return config_file ? await this.get(config_file) : this.fake(dir)
  }
}
