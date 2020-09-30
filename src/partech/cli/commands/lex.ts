import * as ut from "../../../ut"
import path from "path"

export const command = "lex <input>"

export const description = "Lex a text file to tokens by a table-lexer"

export const builder = {
  output: { type: "string", alias: "o" },
  table: { type: "string" },
}

interface Argv {
  input: string
  output: string | undefined
  table: string | undefined
}

export const handler = async (argv: Argv) => {
  console.log({ argv })
}
