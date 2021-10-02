import { Command } from "../command"
import { Library } from "../../library"
import { LocalFileStore } from "../../file-stores"
import { FakeFileStore } from "../../file-stores"
import * as Runners from "../../runners"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

type Argv = {
  file: string
}

export class SnapshotCommand extends Command<Argv> {
  signature = "snapshot <file>"
  description = "Snapshot a file -- write to <file>.out"

  async execute(argv: Argv): Promise<void> {
    this.assertFile(argv["file"])

    const path = Path.resolve(argv["file"])
    const dir = Path.dirname(path)
    const config_file = await find_up("library.json", { cwd: dir })

    const config = config_file
      ? Library.config_schema.validate(
          JSON.parse(await fs.promises.readFile(config_file, "utf8"))
        )
      : Library.fake_config()
    const files = config_file
      ? new LocalFileStore({ dir })
      : new FakeFileStore({ dir })
    const library = new Library({ files, config })
    const runner = Runners.create_special_runner({ path, library, files })

    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
