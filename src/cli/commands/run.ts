import { SingleFileLibrary } from "../../library/single-file-library"
import { LocalLibrary } from "../../library/local-library"
import { Trace } from "../../trace"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const command = "run <file>"
export const description = "Run a file"

export const builder = {
  module: { type: "boolean", default: true },
}

type Argv = {
  file: string
  module: boolean
}

export const handler = async (argv: Argv) => {
  const path = Path.resolve(argv.file)
  const dir = Path.dirname(path)
  const library = argv["module"]
    ? await find_library_config_file(dir).then(LocalLibrary.from_config_file)
    : new SingleFileLibrary(path)
  try {
    await library.load(path)
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    }

    throw error
  }
}

async function find_library_config_file(cwd: string): Promise<string> {
  const config_file = await find_up("library.json", { cwd })
  if (!config_file) {
    throw new Error(
      `I can not find a library.json config file,\n` +
        `I searched upward from: ${cwd}`
    )
  }

  return config_file
}
