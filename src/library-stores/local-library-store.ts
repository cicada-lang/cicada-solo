import { LibraryStore } from "../library-store"
import { Library } from "../library"
import { LocalFileStore, FakeFileStore } from "../file-stores"
import findUp from "find-up"
import Path from "path"
import fs from "fs"

export class LocalLibraryStore extends LibraryStore {
  async get(config_file: string): Promise<Library> {
    const text = await fs.promises.readFile(config_file, "utf8")
    const config = Library.config_schema.validate(JSON.parse(text))
    return new Library({
      config,
      files: new LocalFileStore({
        dir: Path.resolve(Path.dirname(config_file), config.src),
      }),
    })
  }

  fake(dir: string): Library {
    return new Library({
      config: Library.fake_config(),
      files: new FakeFileStore({ dir }),
    })
  }

  async findUpOrFake(dir: string): Promise<Library> {
    const config_file = await findUp("library.json", { cwd: dir })
    return config_file ? await this.get(config_file) : this.fake(dir)
  }
}
