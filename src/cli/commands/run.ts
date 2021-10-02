import { Command } from "../command"
import { Library, LibraryConfig } from "../../library"
import { LocalFileStore } from "../../file-stores"
import { FakeFileStore } from "../../file-stores"
import * as Runners from "../../runners"
import findUp from "find-up"
import Path from "path"
import fs from "fs"

type Argv = {
  file: string
}

export class RunCommand extends Command<Argv> {
  constructor() {
    super()
  }

  signature = "run <file>"
  description = "Run a file -- support .md or .cic"

  async execute(argv: Argv): Promise<void> {
    Command.assertFile(argv["file"])

    const path = Path.resolve(argv["file"])

    const library = await find_library(Path.dirname(path))
    const runner = new Runners.DefaultRunner({ library })

    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}

async function find_library(dir: string): Promise<Library> {
  const config_file = await findUp("library.json", { cwd: dir })

  if (config_file) {
    const text = await fs.promises.readFile(config_file, "utf8")
    return new Library({
      config: Library.config_schema.validate(JSON.parse(text)),
      files: new LocalFileStore({ dir }),
    })
  } else {
    return new Library({
      config: Library.fake_config(),
      files: new FakeFileStore({ dir }),
    })
  }
}
