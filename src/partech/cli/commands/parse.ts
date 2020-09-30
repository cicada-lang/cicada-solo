import * as Mod from "../../mod"
import * as EarleyParser from "../../earley-parser"
import { ParsingError } from "../../errors"
import * as TableLexer from "../../table-lexer"
import * as lexers from "../../lexers"
import * as ut from "../../../ut"
import path from "path"
import fs from "fs"
import strip_ansi from "strip-ansi"

export const command = "parse <input>"

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
  const mod = Mod.build(await ut.read_object(argv.grammar))
  if (mod.metadata.start) {
    const grammar = Mod.dot(mod, mod.metadata.start)
    const parser = EarleyParser.create(grammar)
    try {
      const tree = parser.parse(tokens)
      ut.write_object(tree, argv.output)
    } catch (error) {
      if (error instanceof ParsingError) {
        const message = argv.nocolor ? strip_ansi(error.message) : error.message
        console.error(message)
        process.exit(1)
      }
    }
  } else {
    throw new Error(`No start mod.metadata: ${ut.inspect(mod.metadata)}`)
  }
}
