import * as Syntax from "../../syntax"
import { Stmt } from "../../stmt"
import { run } from "../../run"
import { World } from "../../world"
import { Env } from "../../env"
import { Mod } from "../../mod"
import { ValueStack } from "../../value-stack"
import { Value } from "../../value"
import * as Trace from "../../../trace"
import * as pt from "../../../partech"
import fs from "fs"
import strip_ansi from "strip-ansi"

export const command = "eval <input>"

export const aliases = ["$0"]

export const description = "Eval a file"

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
    const world = World({
      env: Env(new Map()),
      mod: Mod(new Map()),
      value_stack: ValueStack([], 0),
    })
    const final = run(stmts, world)
    if (final.output) {
      console.log(final.output)
    }
  } catch (error) {
    if (error instanceof pt.ParsingError) {
      let message = error.message
      message += "\n"
      message += pt.Span.report(error.span, text)
      console.error(argv.nocolor ? strip_ansi(message) : message)
      process.exit(1)
    }

    throw error
  }
}
