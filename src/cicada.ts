import * as ptc from "partech"
import * as Top from "./top"
import * as CLI from "./cli"
import * as API from "./api"
import * as grammar from "./grammar"

const pkg: any = require("../package.json")

function run_code(code: string, config: { [key: string]: any }): void {
  const lexer = ptc.common_lexer
  const partech = ptc.earley
  const parser = new ptc.Parser(lexer, partech, grammar.top_list)

  try {
    let tree = parser.parse(code)
    let top_list: Array<Top.Top> = grammar.top_list_matcher(tree)
    API.run(top_list, config)
  } catch (error) {
    if (error instanceof ptc.ErrorDuringParsing) {
      console.log(`parsing error, at ${error.span.repr()}`)
      error.span.report_in_context(code)
      console.log(`${error.message}`)
      process.exit(1)
    } else {
      throw error
    }
  }
}

export const cli = new CLI.CommandLineInterface(pkg.name, pkg.version, run_code)
