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
  const file_adapter = argv["module"]
    ? await LocalFileAdapter.from_config_file(
        await find_library_config_file(dir)
      )
    : new SingleFileAdapter({ path })
  const library = new Library({ file_adapter })

  // const runner = createModuleRunner({ path, library, files: file_adapter })
  // const { error } = await runner.run(path)
  // if (error) {
  //   process.exit(1)
  // }

  try {
    const mod = await library.mods.load(path)
    console.log(mod.output)
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    } else if (error instanceof pt.ParsingError) {
      const text = await library.files.get(path)
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
