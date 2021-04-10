import * as Syntax from "../../syntax"
import { Module } from "../../module"
import { EmptyLibrary } from "../../library"
import { Trace } from "../../trace"
import pt from "@cicada-lang/partech"
import fs from "fs"
import strip_ansi from "strip-ansi"

export const command = "run <input>"
export const description = "Run a file"

export const builder = {
  nocolor: { type: "boolean", default: false },
}

type Argv = {
  input: string
  nocolor: boolean
}

export const handler = async (argv: Argv) => {
  const text = fs.readFileSync(argv.input, { encoding: "utf-8" })

  try {
    const stmts = Syntax.parse_stmts(text)
    let mod = new Module({ library: new EmptyLibrary() })
    for (const stmt of stmts) await stmt.execute(mod)
    if (mod.output) {
      console.log(mod.output)
    }
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    }

    if (error instanceof pt.ParsingError) {
      let message = error.message
      message += "\n"
      message += pt.report(error.span, text)
      console.error(argv.nocolor ? strip_ansi(message) : message)
      process.exit(1)
    }

    throw error
  }
}
