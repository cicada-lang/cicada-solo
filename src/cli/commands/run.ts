import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { SingleFileResource } from "../../library/file-resources"
import { DefaultRunner } from "../runners"
import { Repl } from "../repl"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const aliases = ["$0"]
export const command = "run [file]"
export const description = "Run a file -- support .md or .cic"
export const builder = {}

type Argv = {
  file?: string
}

export const handler = async (argv: Argv) => {
  if (argv["file"] === undefined) {
    const repl = new Repl()
    await repl.run()
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
  const config = await find_up("library.json", { cwd: dir })
  const files = config
    ? await LocalFileResource.build(config)
    : new SingleFileResource({ path })
  const library = new Library({ files })

  const runner = new DefaultRunner({ library, files })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
