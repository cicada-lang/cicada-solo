import { LibraryStore } from "../library-store"
import { Library } from "../library"
import {
  LocalFileStore,
  FakeFileStore,
} from "@xieyuheng/enchanter/lib/file-stores"
import * as ut from "../ut"
import Path from "path"
import fs from "fs"

export class LocalLibraryStore extends LibraryStore {
  async get(config_file: string): Promise<Library<LocalFileStore>> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = Library.config_schema.validate(JSON.parse(text))
    return new Library({
      config,
      files: new LocalFileStore({
        dir: Path.resolve(Path.dirname(config_file), config.src),
      }),
    })
  }

  fake(dir: string, faked?: Record<string, string>): Library<LocalFileStore> {
    return new Library({
      config: Library.fake_config(),
      files: new FakeFileStore({ dir, faked }),
    })
  }

  async findUpOrFake(dir: string): Promise<Library<LocalFileStore>> {
    const config_file = ut.findUp("library.json", { from: dir })
    return config_file ? await this.get(config_file) : this.fake(dir)
  }
}
