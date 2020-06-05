import * as pt from "@forchange/partech"
import * as Top from "./top"
import * as CLI from "./cli"
import * as API from "./api"
import * as grammar from "./grammar"

const pkg: any = require("../package.json")

function run_code(code: string, config: { [key: string]: any }): void {
  const lexer = pt.lexers.common
  const parser = pt.parsers.earley

  try {
    let tokens = lexer.lex(code)
    let tree = parser.parse(tokens, grammar.top_list())
    let top_list: Array<Top.Top> = grammar.top_list_matcher(tree)
    API.run(top_list, config)
  } catch (error) {
    if (error instanceof pt.Err.Parsing) {
      console.log(`parsing error, at ${pt.Span.repr(error.span)}`)
      console.log(pt.Span.repr_in_context(error.span, code))
      console.log(`${error.message}`)
      process.exit(1)
    } else {
      throw error
    }
  }
}

export const cli = new CLI.CommandLineInterface(pkg.name, pkg.version, run_code)
