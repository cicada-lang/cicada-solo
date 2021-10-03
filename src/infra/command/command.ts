import fs from "fs"
import { Schema } from "@xieyuheng/ty"
import { CommandRunner } from "../command-runner"

type SchemaObject<T> = { [P in keyof T]: Schema<T[P]> }

export abstract class Command<
  Args extends Object = {},
  Opts extends Object = {}
> {
  abstract description: string

  args: SchemaObject<Args> = {} as SchemaObject<Args>
  opts: SchemaObject<Opts> = {} as SchemaObject<Opts>

  abstract execute(argv: Args & Opts, runner: CommandRunner): Promise<void>

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
