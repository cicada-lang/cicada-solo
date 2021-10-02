import fs from "fs"

export abstract class Command<Argv> {
  abstract signature: string
  abstract description: string
  // NOTE The schema for options
  options: any = {}
  abstract execute(argv: Argv): Promise<void>

  static assertFile(file: string): void {
    if (!fs.existsSync(file)) {
      console.error(`The given file does not exist: ${file}`)
      process.exit(1)
    }

    if (!fs.lstatSync(file).isFile()) {
      console.error(`The given path does not refer to a file: ${file}`)
      process.exit(1)
    }
  }

  static assertExists(path: string): void {
    if (!fs.existsSync(path)) {
      console.error(`The given path does not exist: ${path}`)
      process.exit(1)
    }
  }
}
