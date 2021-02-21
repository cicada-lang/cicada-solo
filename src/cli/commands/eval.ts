import * as Syntax from "../../syntax"
import * as Value from "../../value"
import * as Stmt from "../../stmt"
import * as Exp from "../../exp"
import * as Ctx from "../../ctx"
import { Env } from "../../env"
import * as Trace from "../../trace"
import * as pt from "../../partech"
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
    const ctx = Ctx.init()
    const env = Env.init()
    const output = Stmt.run(ctx, env, stmts)
    if (output) console.log(output)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      console.error(Trace.repr(error, (exp) => exp.repr()))
      process.exit(1)
    }
    if (error instanceof pt.ParsingError) {
      let message = error.message
      message += "\n"
      message += pt.Span.report(error.span, text)
      console.error(argv.nocolor ? strip_ansi(message) : message)
      process.exit(1)
    } else {
      throw error
    }
  }
}
