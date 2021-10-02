import fs from "fs"
import ty, { Schema } from "@xieyuheng/ty"

type SchemaObject<T> = { [P in keyof T]: Schema<T[P]> }

export abstract class Command<Argv> {
  abstract signature: string
  abstract description: string
  // NOTE The schema for options
  options: any = {}

  abstract positional: Array<string>
  abstract schemas: SchemaObject<Argv>

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
