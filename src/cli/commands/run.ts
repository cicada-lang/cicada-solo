import * as Syntax from "../../syntax"
import { Module } from "../../module"
import { Stmt } from "../../stmt"
import { EmptyLibrary } from "../../library"
import { Trace } from "../../trace"
import pt from "@cicada-lang/partech"
import fs from "fs"
import strip_ansi from "strip-ansi"

export const command = "run <file>"
export const description = "Run a file"

export const builder = {
  color: { type: "boolean", default: true },
  module: { type: "boolean", default: true },
}

type Argv = {
  file: string
  color: boolean
  module: boolean
}

export const handler = async (argv: Argv) => {
  console.log(argv)

  const text = fs.readFileSync(argv.file, { encoding: "utf-8" })

  try {
    const stmts = Syntax.parse_stmts(text)
    const library = argv["module"] ? new EmptyLibrary() : new EmptyLibrary()
    const mod = new Module({ library })
    await run_stmts(mod, stmts)
  } catch (error) {
    if (error instanceof pt.ParsingError) {
      let message = error.message
      message += "\n"
      message += pt.report(error.span, text)
      console.error(argv["color"] ? message : strip_ansi(message))
      process.exit(1)
    }

    throw error
  }
}

async function run_stmts(mod: Module, stmts: Array<Stmt>): Promise<void> {
  try {
    for (const stmt of stmts) await stmt.execute(mod)
    if (mod.output) {
      console.log(mod.output)
    }
  } catch (error) {
    if (error instanceof Trace) {
      console.error(error.repr((exp) => exp.repr()))
      process.exit(1)
    }

    throw error
  }
}
