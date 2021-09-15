import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { SingleFileResource } from "../../library/file-resources"
import { DefaultModuleRunner } from "../module-runners"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const aliases = ["$0"]
export const command = "run <file>"
export const description = "Run a file -- support .md or .cic"
export const builder = {}

type Argv = {
  file: string
}

export const handler = async (argv: Argv) => {
  if (!fs.existsSync(argv["file"])) {
    console.error(`The given file does not exist: ${argv["file"]}`)
    process.exit(1)
  }

  const path = Path.resolve(argv["file"])
  const dir = Path.dirname(path)
  const config_file = await find_up("library.json", { cwd: dir })
  const file_adapter = config_file
    ? await LocalFileResource.from_config_file(config_file)
    : new SingleFileResource({ path })
  const library = new Library({ file_adapter })

  const runner = new DefaultModuleRunner({ library, files: file_adapter })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
