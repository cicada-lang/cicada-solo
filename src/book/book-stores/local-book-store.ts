import { FakeLocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/fake-local-file-store"
import { LocalFileStore } from "@enchanterjs/enchanter/lib/file-stores/local-file-store"
import fs from "fs"
import Path from "path"
import * as ut from "../../ut"
import { Book } from "../book"
import { BookConfigSchema } from "../book-config"
import { Store } from "@enchanterjs/enchanter/lib/store"

export class LocalBookStore extends Store<Book> {
  async get(config_file: string): Promise<Book<LocalFileStore>> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = BookConfigSchema.validate(JSON.parse(text))
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
