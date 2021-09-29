import { Library, fake_library_config } from "../../library"
import { LocalFileResource } from "../../file-resources"
import { FakeFileResource } from "../../file-resources"
import { libraryConfigSchema } from "../../library"
import * as Runners from "../../runners"
import find_up from "find-up"
import Path from "path"
import fs from "fs"
import { handler as repl_handler } from "./repl"

export const aliases = ["$0"]
export const command = "run [file]"
export const description = "Run a file -- support .md or .cic"
export const builder = {}

type Argv = {
  file?: string
}

export const handler = async (argv: Argv) => {
  if (argv["file"] === undefined) {
    await repl_handler({ dir: process.cwd() })
    return
  }

  if (!fs.existsSync(argv["file"])) {
    console.error(`The given file does not exist: ${argv["file"]}`)
    process.exit(1)
  }

  if (!fs.lstatSync(argv["file"]).isFile()) {
    console.error(`The given path does not refer to a file: ${argv["file"]}`)
    process.exit(1)
  }

  const path = Path.resolve(argv["file"])
  const dir = Path.dirname(path)
  const config_file = await find_up("library.json", { cwd: dir })
  const config = config_file
    ? libraryConfigSchema.validate(
        JSON.parse(await fs.promises.readFile(config_file, "utf8"))
      )
    : fake_library_config()

  const files = config_file
    ? new LocalFileResource({ dir })
    : new FakeFileResource({ dir })

  const library = new Library({ config, files })

  const runner = new Runners.DefaultRunner({ library, files })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
