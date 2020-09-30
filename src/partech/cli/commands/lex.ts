import * as TableLexer from "../../table-lexer"
import * as ut from "../../../ut"
import path from "path"
import fs from "fs"

export const command = "lex <input>"

export const description = "Lex text to tokens by table-lexer"

export const builder = {
  output: { type: "string", alias: "o" },
  table: { type: "string", demandOption: true },
}

interface Argv {
  input: string
  output: string | undefined
  table: string
}

export const handler = async (argv: Argv) => {
  const present = await ut.read_object(argv.table)
  const lexer = TableLexer.build(present)
  const text = await fs.promises.readFile(argv.input, "utf8")
  const tokens = lexer.lex(text)
  ut.write_object(tokens, argv.output)
}
