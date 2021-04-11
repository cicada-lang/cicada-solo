import { LocalLibrary } from "../../library"

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
  // TODO
  // await library.check_all()
}
