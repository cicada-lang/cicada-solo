import { LocalLibrary } from "../../library"
import { Trace } from "../../trace"

export const command = "check-library <config-file>"
export const description = "Check all files in a library"

export const builder = {
  watch: { type: "boolean", default: false },
}

type Argv = {
  "config-file": string
  watch: boolean
}

export const handler = async (argv: Argv) => {
  const library = await LocalLibrary.from_config_file(argv["config-file"])
  try {
    const modules = await library.load_all()
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    }

    throw error
  }
}
