import * as Mod from "../../mod"
import * as EarleyParser from "../../earley-parser"
import { ParsingError } from "../../errors"
import * as TableLexer from "../../table-lexer"
import * as Span from "../../span"
import * as lexers from "../../lexers"
import * as ut from "../../../ut"
import fs from "fs"
import path from "path"
import strip_ansi from "strip-ansi"

export const command = "parse <input>"

export const aliases = ["$0"]

export const description = "Parse text to tree by grammar"

export const builder = {
  output: { type: "string", alias: "o" },
  grammar: { type: "string", demandOption: true },
  table: { type: "string" },
  nocolor: { type: "boolean", default: false },
}

interface Argv {
  input: string
  output: string | undefined
  grammar: string
  table: string | undefined
  nocolor: boolean
}

export const handler = async (argv: Argv) => {
  const lexer = argv.table
    ? TableLexer.build(await ut.read_object(argv.table))
    : lexers.common
  const text = await fs.promises.readFile(argv.input, "utf8")
  const tokens = lexer.lex(text)
  const mod = Mod.from_present(require(path.resolve(argv.grammar)))
  if (mod.metadata.start) {
    const grammar = Mod.dot(mod, mod.metadata.start)

    const parser = EarleyParser.create(grammar)
    try {
      const tree = parser.parse(tokens)
      ut.write_object(tree, argv.output)
    } catch (error) {
      if (error instanceof ParsingError) {
        let message = error.message
        message += "\n"
        message += Span.report(error.span, text)
        console.error(argv.nocolor ? strip_ansi(message) : message)
        process.exit(1)
      } else {
        throw error
      }
    }
  } else {
    throw new Error(`No start mod.metadata: ${ut.inspect(mod.metadata)}`)
  }
}
