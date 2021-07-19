import { SingleFileLibrary } from "@cicada-lang/librarian"
import { LocalLibrary } from "@cicada-lang/librarian"
import { Trace } from "../../errors"
import { Module } from "../../module"
import { doc_builder } from "../../docs"
import pt from "@cicada-lang/partech"
import find_up from "find-up"
import Path from "path"

export const command = "run <file>"
export const description = "Run a file"

export const builder = {
  module: { type: "boolean", default: true },
}

type Argv = {
  file: string
  module: boolean
}

const module_viewer = {
  view(mod: Module): string {
    return mod.output
  },
}

export const handler = async (argv: Argv) => {
  const path = Path.resolve(argv.file)
  const dir = Path.dirname(path)
  const library = argv["module"]
    ? await find_library_config_file(dir).then((file) =>
        LocalLibrary.from_config_file(file, { doc_builder, module_viewer })
      )
    : new SingleFileLibrary({ path, doc_builder, module_viewer })
  try {
    const mod = await library.load(path)
    console.log(library.module_viewer.view(mod))
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    } else if (error instanceof pt.ParsingError) {
      const text = await library.fetch_file(path)
      if (!text) {
        console.error(`Unknown path: ${path}`)
      } else {
        let message = error.message
        message += "\n"
        message += pt.report(error.span, text)
        console.error(message)
      }
    } else {
      throw error
    }
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
