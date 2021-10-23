import { BookStore } from "../book-store"
import { Book } from "../book"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import { FakeLocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/fake-local-file-store"
import * as ut from "../../ut"
import Path from "path"
import fs from "fs"

export class LocalBookStore extends BookStore {
  async get(config_file: string): Promise<Book<LocalFileStore>> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = Book.bookConfigSchema.validate(JSON.parse(text))
    return new Book({
      config,
      files: new LocalFileStore({
        dir: Path.resolve(Path.dirname(config_file), config.src),
      }),
    })
  }

  fake(opts: {
    fallback: LocalFileStore
    faked?: Record<string, string>
  }): Book<LocalFileStore> {
    const { fallback, faked } = opts
    return new Book({
      config: Book.fakeConfig(),
      files: new FakeLocalFileStore({ faked, fallback }),
    })
  }

  async findUpOrFake(dir: string): Promise<Book<LocalFileStore>> {
    const config_file = ut.findUp("book.json", { from: dir })
    return config_file
      ? await this.get(config_file)
      : this.fake({
          fallback: new LocalFileStore({ dir }),
        })
  }
}