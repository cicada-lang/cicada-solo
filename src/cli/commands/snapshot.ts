import { Library } from "../../library"
import { LocalFileResource } from "../../file-resources"
import { FakeFileResource } from "../../file-resources"
import { libraryConfigSchema } from "../../library"
import * as Runners from "../../runners"
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
  const config_file = await find_up("library.json", { cwd: dir })
  const config = config_file
    ? libraryConfigSchema.validate(
        JSON.parse(await fs.promises.readFile(config_file, "utf8"))
      )
    : FakeFileResource.fakeLibraryConfig()
  const files = config_file
    ? await LocalFileResource.build(config_file)
    : new FakeFileResource({ dir })

  const library = new Library({ files, config })

  const runner = Runners.create_special_runner({ path, library, files })
  const { error } = await runner.run(path)
  if (error) {
    process.exit(1)
  }
}
