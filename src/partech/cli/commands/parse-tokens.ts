import * as ut from "../../../ut"
import path from "path"

export const command = "parse-tokens <input>"

export const description = "Parse tokens to tree by grammar"

export const builder = {
  output: { type: "string", alias: "o" },
  grammar: { type: "string" },
}

interface Argv {
  input: string
  output: string | undefined
  grammar: string | undefined
}

export const handler = async (argv: Argv) => {
  console.log({ argv })
}
