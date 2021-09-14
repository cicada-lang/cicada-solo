import { Library } from "../../library"
import { LocalFileAdapter } from "../../library/file-adapters"
import { SingleFileAdapter } from "../../library/file-adapters"
import { createModuleRunner } from "../create-module-runner"
import { Trace } from "../../errors"
import pt from "@cicada-lang/partech"
import find_up from "find-up"
import Path from "path"

export const command = "run <file>"
export const description = "Run a file"

export const aliases = ["$0"]

export const builder = {}

type Argv = {
  file: string
}

export const handler = async (argv: Argv) => {
  const path = Path.resolve(argv.file)
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
