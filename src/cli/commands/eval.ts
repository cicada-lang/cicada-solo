import * as Syntax from "../../syntax"
import { World } from "../../world"
import { Trace } from "../../trace"
import pt from "@cicada-lang/partech"
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

    let world = new World()
    world = await world.run_stmts(stmts)

    if (world.output) {
      console.log(world.output)
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
