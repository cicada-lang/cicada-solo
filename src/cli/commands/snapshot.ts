import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { SingleFileAdapter } from "../../library/file-adapters"
import { createModuleRunner } from "../create-module-runner"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const command = "snapshot <file>"
export const description = "Snapshot a file and write to <file>.out"
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
    ? await LocalFileAdapter.from_config_file(config_file)
    : new SingleFileAdapter({ path })
  const library = new Library({ file_adapter })

  const runner = createModuleRunner({ path, library, files: file_adapter })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
