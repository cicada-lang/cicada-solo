import { Library } from "../../library"
import { LocalFileResource } from "../../library/file-resources"
import { SingleFileResource } from "../../library/file-resources"
import { createRunner } from "../create-runner"
import find_up from "find-up"
import Path from "path"
import fs from "fs"

export const command = "snapshot <file>"
export const description = "Snapshot a file -- write to <file>.out"
export const builder = {}

type Argv = {
  file: string
}

export const handler = async (argv: Argv) => {
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

  const runner = createRunner({ path, library, files })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
